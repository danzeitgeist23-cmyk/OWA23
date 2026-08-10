import logging
import os
import uuid
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any, Dict, List

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, HTTPException, Request, Response
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from starlette.middleware.cors import CORSMiddleware

from activity_catalog import BOOKABLE_ACTIVITIES, ActivityPricingError, calculate_price
from sumup_client import SumUpAPIError, SumUpClient, SumUpConfigurationError

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB connection
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class BookingCustomer(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(min_length=7, max_length=30)

    @field_validator("name", "phone")
    @classmethod
    def strip_text(cls, value: str) -> str:
        return value.strip()


class CheckoutCreate(BaseModel):
    activity_id: str = Field(min_length=2, max_length=120)
    service_date: date
    time_slot: str = Field(min_length=4, max_length=32)
    quantities: Dict[str, int]
    customer: BookingCustomer
    accepted_terms: bool


class CheckoutCreateResponse(BaseModel):
    booking_id: str
    checkout_id: str
    hosted_checkout_url: str
    amount: float
    currency: str


SUMUP_STATUS_MAP = {
    "PAID": "confirmed",
    "FAILED": "payment_failed",
    "EXPIRED": "payment_expired",
    "PENDING": "payment_pending",
}


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def build_public_booking(booking: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "booking_id": booking["id"],
        "activity_id": booking["activity_id"],
        "activity_title": booking["activity_title"],
        "service_date": booking["service_date"],
        "time_slot": booking["time_slot"],
        "amount": booking["total_cents"] / 100,
        "currency": booking["currency"],
        "status": booking["status"],
        "payment_status": booking["payment_status"],
        "cancellation_notice_hours": booking["cancellation_notice_hours"],
    }


def find_checkout_id(payload: Any) -> str | None:
    if not isinstance(payload, dict):
        return None

    for key in ("checkout_id", "checkoutId"):
        value = payload.get(key)
        if isinstance(value, str) and value:
            return value

    payload_value = payload.get("payload")
    nested_id = find_checkout_id(payload_value)
    if nested_id:
        return nested_id

    value = payload.get("id")
    if isinstance(value, str) and value:
        return value
    return None


async def refresh_booking_from_sumup(booking: Dict[str, Any]) -> Dict[str, Any]:
    checkout_id = booking.get("sumup_checkout_id")
    if not checkout_id or booking.get("payment_status") == "PAID":
        return booking

    checkout = await SumUpClient().get_checkout(checkout_id)
    sumup_status = str(checkout.get("status", "PENDING")).upper()
    booking_status = SUMUP_STATUS_MAP.get(sumup_status, "payment_pending")
    updated_at = utc_now().isoformat()

    await db.bookings.update_one(
        {"id": booking["id"]},
        {
            "$set": {
                "payment_status": sumup_status,
                "status": booking_status,
                "sumup_transaction_id": checkout.get("transaction_id"),
                "updated_at": updated_at,
            }
        },
    )
    booking.update(
        {
            "payment_status": sumup_status,
            "status": booking_status,
            "sumup_transaction_id": checkout.get("transaction_id"),
            "updated_at": updated_at,
        }
    )
    return booking


@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc["timestamp"] = doc["timestamp"].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check["timestamp"], str):
            check["timestamp"] = datetime.fromisoformat(check["timestamp"])
    return status_checks


@api_router.post("/payments/sumup/checkouts", response_model=CheckoutCreateResponse)
async def create_sumup_checkout(input: CheckoutCreate):
    payments_enabled = os.environ.get("SUMUP_PAYMENTS_ENABLED", "false").lower() in {
        "1",
        "true",
        "yes",
    }
    if not payments_enabled:
        raise HTTPException(
            status_code=503,
            detail="Los pagos online todavía no están activados en producción.",
        )
    if not input.accepted_terms:
        raise HTTPException(
            status_code=400,
            detail="Debes aceptar la política de cancelación antes de pagar.",
        )
    if input.service_date < date.today():
        raise HTTPException(
            status_code=400,
            detail="La fecha de la actividad no puede estar en el pasado.",
        )

    activity = BOOKABLE_ACTIVITIES.get(input.activity_id)
    if activity is None:
        raise HTTPException(
            status_code=404,
            detail="La actividad no está disponible para reserva online.",
        )
    if not activity.online_booking_enabled:
        raise HTTPException(
            status_code=409,
            detail="Esta actividad requiere confirmar antes el horario con el operador.",
        )
    if input.time_slot not in activity.allowed_time_slots:
        raise HTTPException(
            status_code=400,
            detail="La hora seleccionada no está disponible para esta actividad.",
        )

    try:
        pricing = calculate_price(input.activity_id, input.quantities)
    except ActivityPricingError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    booking_id = str(uuid.uuid4())
    checkout_reference = f"OWA-{booking_id.split('-')[0].upper()}"
    created_at = utc_now().isoformat()
    public_site_url = os.environ.get("PUBLIC_SITE_URL", "http://localhost:3000").rstrip("/")
    public_api_url = os.environ.get("PUBLIC_API_URL", public_site_url).rstrip("/")
    redirect_url = f"{public_site_url}/pago/resultado?booking_id={booking_id}"
    return_url = f"{public_api_url}/api/payments/sumup/webhook"

    booking = {
        "id": booking_id,
        "checkout_reference": checkout_reference,
        "activity_id": input.activity_id,
        "activity_title": activity.title,
        "provider_id": activity.provider_id,
        "provider_name": activity.provider_name,
        "provider_url": activity.provider_url,
        "service_date": input.service_date.isoformat(),
        "time_slot": input.time_slot,
        "quantities": pricing.normalized_quantities,
        "line_items": pricing.line_items,
        "total_seats": pricing.total_seats,
        "total_cents": pricing.total_cents,
        "currency": "EUR",
        "customer": input.customer.model_dump(),
        "status": "creating_checkout",
        "payment_status": "NOT_STARTED",
        "cancellation_notice_hours": activity.cancellation_notice_hours,
        "cancellation_source_url": activity.cancellation_source_url,
        "commercial_terms_verified_on": activity.commercial_terms_verified_on,
        "commission": {
            "min_percent": activity.commission_min_percent,
            "max_percent": activity.commission_max_percent,
            "agreed_percent": None,
        },
        "operations_contact": {
            "name": "Andres",
            "phone": "+34 673 55 27 72",
        },
        "created_at": created_at,
        "updated_at": created_at,
    }
    await db.bookings.insert_one(booking)

    try:
        checkout = await SumUpClient().create_checkout(
            checkout_reference=checkout_reference,
            amount_cents=pricing.total_cents,
            description=f"OWA · {activity.title}",
            redirect_url=redirect_url,
            return_url=return_url,
        )
    except SumUpConfigurationError as exc:
        await db.bookings.update_one(
            {"id": booking_id},
            {
                "$set": {
                    "status": "configuration_required",
                    "payment_status": "NOT_STARTED",
                    "updated_at": utc_now().isoformat(),
                }
            },
        )
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except SumUpAPIError as exc:
        await db.bookings.update_one(
            {"id": booking_id},
            {
                "$set": {
                    "status": "checkout_error",
                    "payment_status": "ERROR",
                    "updated_at": utc_now().isoformat(),
                }
            },
        )
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    checkout_id = str(checkout["id"])
    hosted_checkout_url = str(checkout["hosted_checkout_url"])
    payment_status = str(checkout.get("status", "PENDING")).upper()
    await db.bookings.update_one(
        {"id": booking_id},
        {
            "$set": {
                "sumup_checkout_id": checkout_id,
                "hosted_checkout_url": hosted_checkout_url,
                "status": "payment_pending",
                "payment_status": payment_status,
                "updated_at": utc_now().isoformat(),
            }
        },
    )

    return CheckoutCreateResponse(
        booking_id=booking_id,
        checkout_id=checkout_id,
        hosted_checkout_url=hosted_checkout_url,
        amount=pricing.total_cents / 100,
        currency="EUR",
    )


@api_router.get("/payments/sumup/bookings/{booking_id}")
async def get_sumup_booking(booking_id: str):
    booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if booking is None:
        raise HTTPException(status_code=404, detail="Reserva no encontrada.")

    try:
        booking = await refresh_booking_from_sumup(booking)
    except (SumUpAPIError, SumUpConfigurationError):
        logger.warning("Could not refresh SumUp checkout for booking %s", booking_id)

    return build_public_booking(booking)


@api_router.post("/payments/sumup/webhook")
async def sumup_webhook(request: Request):
    try:
        payload: Any = await request.json()
    except ValueError:
        form = await request.form()
        payload = dict(form)

    checkout_id = find_checkout_id(payload)
    if not checkout_id:
        raise HTTPException(
            status_code=400,
            detail="No se recibió un identificador de pago válido.",
        )

    booking = await db.bookings.find_one({"sumup_checkout_id": checkout_id}, {"_id": 0})
    if booking is None:
        return Response(status_code=202)

    try:
        await refresh_booking_from_sumup(booking)
    except (SumUpAPIError, SumUpConfigurationError) as exc:
        logger.warning(
            "Could not verify SumUp webhook for checkout %s: %s",
            checkout_id,
            exc,
        )
        raise HTTPException(
            status_code=502,
            detail="No se pudo verificar el estado del pago.",
        ) from exc

    return Response(status_code=204)


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def create_database_indexes():
    await db.bookings.create_index("id", unique=True)
    await db.bookings.create_index("checkout_reference", unique=True)
    await db.bookings.create_index("sumup_checkout_id", unique=True, sparse=True)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

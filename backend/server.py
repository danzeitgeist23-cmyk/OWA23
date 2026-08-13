import logging
import os
import re
import uuid
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any, Dict, List

from dotenv import load_dotenv
from fastapi import (
    APIRouter,
    Depends,
    FastAPI,
    HTTPException,
    Query,
    Request,
    Response,
    status,
)
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from starlette.middleware.cors import CORSMiddleware

from activity_catalog import BOOKABLE_ACTIVITIES, ActivityPricingError, calculate_price
from auth_utils import (
    create_access_token,
    decode_access_token,
    hash_password,
    normalize_email,
    verify_password,
)
from sumup_client import SumUpAPIError, SumUpClient, SumUpConfigurationError

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI()
api_router = APIRouter(prefix="/api")
bearer_scheme = HTTPBearer(auto_error=False)


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

    @field_validator("email", mode="before")
    @classmethod
    def strip_email(cls, value: Any) -> Any:
        return value.strip() if isinstance(value, str) else value

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


class AvailabilityRequestCreate(BaseModel):
    activity_id: str = Field(min_length=2, max_length=120)
    service_date: date | None = None
    time_slot: str | None = Field(default=None, min_length=4, max_length=32)
    quantities: Dict[str, int] = Field(default_factory=dict)
    customer: BookingCustomer
    notes: str | None = Field(default=None, max_length=1200)
    accepted_terms: bool

    @field_validator("notes")
    @classmethod
    def clean_notes(cls, value: str | None) -> str | None:
        return sanitize_optional_text(value)


class AvailabilityRequestResponse(BaseModel):
    request_id: str
    status: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str | None = Field(default=None, max_length=120)
    phone: str | None = Field(default=None, max_length=30)

    @field_validator("email", mode="before")
    @classmethod
    def clean_email(cls, value: Any) -> Any:
        return value.strip() if isinstance(value, str) else value

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, value: str) -> str:
        if not any(char.isalpha() for char in value) or not any(
            char.isdigit() for char in value
        ):
            raise ValueError("La contrasena debe incluir letras y numeros.")
        return value

    @field_validator("full_name", "phone")
    @classmethod
    def clean_optional_text(cls, value: str | None) -> str | None:
        return sanitize_optional_text(value)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

    @field_validator("email", mode="before")
    @classmethod
    def clean_email(cls, value: Any) -> Any:
        return value.strip() if isinstance(value, str) else value


class UserPublic(BaseModel):
    id: str
    email: EmailStr
    full_name: str | None = None
    phone: str | None = None
    role: str
    is_active: bool
    created_at: str
    updated_at: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


class ProfileUpdateRequest(BaseModel):
    full_name: str | None = Field(default=None, max_length=120)
    phone: str | None = Field(default=None, max_length=30)

    @field_validator("full_name", "phone")
    @classmethod
    def clean_optional_text(cls, value: str | None) -> str | None:
        return sanitize_optional_text(value)


class MediaAssetCreate(BaseModel):
    title: str = Field(min_length=2, max_length=160)
    url: str = Field(min_length=5, max_length=500)
    kind: str = Field(default="image", min_length=3, max_length=32)
    alt_text: str | None = Field(default=None, max_length=240)
    caption: str | None = Field(default=None, max_length=400)
    tags: List[str] = Field(default_factory=list)
    storage_key: str | None = Field(default=None, max_length=240)
    is_public: bool = True
    metadata: Dict[str, Any] = Field(default_factory=dict)

    @field_validator("title", "url", "kind", "storage_key")
    @classmethod
    def clean_required_text(cls, value: str | None) -> str | None:
        if value is None:
            return value
        return value.strip()

    @field_validator("alt_text", "caption")
    @classmethod
    def clean_optional_text(cls, value: str | None) -> str | None:
        return sanitize_optional_text(value)

    @field_validator("tags")
    @classmethod
    def normalize_tags(cls, value: List[str]) -> List[str]:
        return dedupe_tags(value)


class MediaAssetUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=160)
    url: str | None = Field(default=None, min_length=5, max_length=500)
    kind: str | None = Field(default=None, min_length=3, max_length=32)
    alt_text: str | None = Field(default=None, max_length=240)
    caption: str | None = Field(default=None, max_length=400)
    tags: List[str] | None = None
    storage_key: str | None = Field(default=None, max_length=240)
    is_public: bool | None = None
    metadata: Dict[str, Any] | None = None

    @field_validator("title", "url", "kind", "storage_key")
    @classmethod
    def clean_required_text(cls, value: str | None) -> str | None:
        if value is None:
            return value
        return value.strip()

    @field_validator("alt_text", "caption")
    @classmethod
    def clean_optional_text(cls, value: str | None) -> str | None:
        return sanitize_optional_text(value)

    @field_validator("tags")
    @classmethod
    def normalize_tags(cls, value: List[str] | None) -> List[str] | None:
        if value is None:
            return None
        return dedupe_tags(value)


class MediaAssetResponse(BaseModel):
    id: str
    title: str
    url: str
    kind: str
    alt_text: str | None = None
    caption: str | None = None
    tags: List[str]
    storage_key: str | None = None
    is_public: bool
    metadata: Dict[str, Any]
    created_at: str
    updated_at: str
    deleted_at: str | None = None


SUMUP_STATUS_MAP = {
    "PAID": "confirmed",
    "FAILED": "payment_failed",
    "EXPIRED": "payment_expired",
    "PENDING": "payment_pending",
}


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def sanitize_optional_text(value: str | None) -> str | None:
    if value is None:
        return None
    cleaned = value.strip()
    return cleaned or None


def dedupe_tags(tags: List[str]) -> List[str]:
    normalized_tags: List[str] = []
    seen: set[str] = set()
    for tag in tags:
        cleaned = tag.strip().lower()
        if cleaned and cleaned not in seen:
            normalized_tags.append(cleaned)
            seen.add(cleaned)
    return normalized_tags


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


def serialize_catalog_activity(activity_id: str, activity: Any) -> Dict[str, Any]:
    return {
        "id": activity_id,
        "title": activity.title,
        "provider_id": activity.provider_id,
        "provider_name": activity.provider_name,
        "provider_url": activity.provider_url,
        "online_booking_enabled": activity.online_booking_enabled,
        "allowed_time_slots": list(activity.allowed_time_slots),
        "capacity": activity.capacity,
        "tickets": [
            {
                "id": ticket_id,
                "label": ticket.label,
                "price": ticket.price_cents / 100,
                "minimum": ticket.minimum,
                "maximum": ticket.maximum,
                "seats": ticket.seats,
            }
            for ticket_id, ticket in activity.tickets.items()
        ],
        "cancellation_notice_hours": activity.cancellation_notice_hours,
        "commercial_terms_verified_on": activity.commercial_terms_verified_on,
    }


def build_user_booking(booking: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "booking_id": booking["id"],
        "checkout_reference": booking["checkout_reference"],
        "activity_id": booking["activity_id"],
        "activity_title": booking["activity_title"],
        "provider_name": booking.get("provider_name"),
        "service_date": booking["service_date"],
        "time_slot": booking["time_slot"],
        "quantities": booking.get("quantities", {}),
        "line_items": booking.get("line_items", []),
        "total_seats": booking.get("total_seats"),
        "amount": booking["total_cents"] / 100,
        "currency": booking["currency"],
        "status": booking["status"],
        "payment_status": booking["payment_status"],
        "customer": booking.get("customer", {}),
        "created_at": booking.get("created_at"),
        "updated_at": booking.get("updated_at"),
    }


def build_media_asset_response(asset: Dict[str, Any]) -> MediaAssetResponse:
    return MediaAssetResponse(
        id=asset["id"],
        title=asset["title"],
        url=asset["url"],
        kind=asset["kind"],
        alt_text=asset.get("alt_text"),
        caption=asset.get("caption"),
        tags=asset.get("tags", []),
        storage_key=asset.get("storage_key"),
        is_public=bool(asset.get("is_public", True)),
        metadata=asset.get("metadata", {}),
        created_at=asset["created_at"],
        updated_at=asset["updated_at"],
        deleted_at=asset.get("deleted_at"),
    )


def serialize_user(user: Dict[str, Any]) -> UserPublic:
    return UserPublic(
        id=user["id"],
        email=user["email"],
        full_name=user.get("full_name"),
        phone=user.get("phone"),
        role=user.get("role", "user"),
        is_active=bool(user.get("is_active", True)),
        created_at=user["created_at"],
        updated_at=user["updated_at"],
    )


def get_jwt_settings() -> tuple[str, str, int]:
    secret_key = os.environ.get("JWT_SECRET_KEY", "").strip()
    if not secret_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="La autenticacion no esta configurada en el servidor.",
        )
    algorithm = os.environ.get("JWT_ALGORITHM", "HS256").strip() or "HS256"
    expire_minutes = int(os.environ.get("JWT_EXPIRE_MINUTES", "1440"))
    return secret_key, algorithm, expire_minutes


def get_bootstrap_admin_emails() -> set[str]:
    raw_value = os.environ.get("AUTH_BOOTSTRAP_ADMIN_EMAILS", "")
    return {normalize_email(email) for email in raw_value.split(",") if email.strip()}


def unauthorized_exception(detail: str = "No autenticado.") -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


async def maybe_promote_bootstrap_admin(user: Dict[str, Any]) -> Dict[str, Any]:
    desired_role = (
        "admin"
        if user["email"] in get_bootstrap_admin_emails()
        else user.get("role", "user")
    )
    if user.get("role") == desired_role:
        return user

    updated_at = utc_now().isoformat()
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"role": desired_role, "updated_at": updated_at}},
    )
    user["role"] = desired_role
    user["updated_at"] = updated_at
    return user


async def get_optional_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> Dict[str, Any] | None:
    if credentials is None or credentials.scheme.lower() != "bearer":
        return None

    try:
        secret_key, algorithm, _ = get_jwt_settings()
        payload = decode_access_token(
            credentials.credentials,
            secret_key=secret_key,
            algorithms=[algorithm],
        )
        user_id = str(payload.get("sub", "")).strip()
    except (HTTPException, ValueError):
        return None

    if not user_id:
        return None

    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if user is None or not user.get("is_active", True):
        return None
    return await maybe_promote_bootstrap_admin(user)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> Dict[str, Any]:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise unauthorized_exception()

    secret_key, algorithm, _ = get_jwt_settings()
    try:
        payload = decode_access_token(
            credentials.credentials,
            secret_key=secret_key,
            algorithms=[algorithm],
        )
    except ValueError as exc:
        raise unauthorized_exception("Token invalido o expirado.") from exc

    user_id = str(payload.get("sub", "")).strip()
    if not user_id:
        raise unauthorized_exception("Token invalido o expirado.")

    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if user is None or not user.get("is_active", True):
        raise unauthorized_exception("Usuario no disponible.")

    return await maybe_promote_bootstrap_admin(user)


async def require_admin_user(
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> Dict[str, Any]:
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Se requieren permisos de administrador.",
        )
    return current_user


def issue_auth_response(user: Dict[str, Any]) -> AuthResponse:
    secret_key, algorithm, expire_minutes = get_jwt_settings()
    access_token = create_access_token(
        subject=user["id"],
        email=user["email"],
        role=user.get("role", "user"),
        secret_key=secret_key,
        algorithm=algorithm,
        expires_minutes=expire_minutes,
    )
    return AuthResponse(access_token=access_token, user=serialize_user(user))


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


@api_router.get("/catalog/activities")
async def list_catalog_activities():
    return [
        serialize_catalog_activity(activity_id, activity)
        for activity_id, activity in BOOKABLE_ACTIVITIES.items()
    ]


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


@api_router.post(
    "/auth/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED
)
async def register_user(input: RegisterRequest):
    normalized_email = normalize_email(str(input.email))
    existing_user = await db.users.find_one({"email": normalized_email}, {"_id": 0})
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una cuenta con ese email.",
        )

    created_at = utc_now().isoformat()
    bootstrap_admin_emails = get_bootstrap_admin_emails()
    users_count = await db.users.count_documents({})
    role = (
        "admin"
        if normalized_email in bootstrap_admin_emails
        or (users_count == 0 and not bootstrap_admin_emails)
        else "user"
    )
    user = {
        "id": str(uuid.uuid4()),
        "email": normalized_email,
        "password_hash": hash_password(input.password),
        "full_name": input.full_name,
        "phone": input.phone,
        "role": role,
        "is_active": True,
        "created_at": created_at,
        "updated_at": created_at,
    }
    await db.users.insert_one(user)
    return issue_auth_response(user)


@api_router.post("/auth/login", response_model=AuthResponse)
async def login_user(input: LoginRequest):
    normalized_email = normalize_email(str(input.email))
    user = await db.users.find_one({"email": normalized_email}, {"_id": 0})
    if user is None or not verify_password(
        input.password, user.get("password_hash", "")
    ):
        raise unauthorized_exception("Credenciales invalidas.")
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="La cuenta esta desactivada.",
        )

    user = await maybe_promote_bootstrap_admin(user)
    return issue_auth_response(user)


@api_router.get("/auth/me", response_model=UserPublic)
async def get_me(current_user: Dict[str, Any] = Depends(get_current_user)):
    return serialize_user(current_user)


@api_router.get("/me/bookings")
@api_router.get("/users/me/bookings")
async def list_my_bookings(current_user: Dict[str, Any] = Depends(get_current_user)):
    normalized_email = current_user["email"]
    bookings = await (
        db.bookings.find(
            {
                "$or": [
                    {"user_id": current_user["id"]},
                    {"customer_email_normalized": normalized_email},
                    {
                        "customer.email": {
                            "$regex": f"^{re.escape(normalized_email)}$",
                            "$options": "i",
                        }
                    },
                ]
            },
            {"_id": 0},
        )
        .sort([("service_date", -1), ("created_at", -1)])
        .to_list(200)
    )
    return [build_user_booking(booking) for booking in bookings]


@api_router.post("/booking-requests", response_model=AvailabilityRequestResponse)
async def create_booking_request(
    input: AvailabilityRequestCreate,
    current_user: Dict[str, Any] | None = Depends(get_optional_current_user),
):
    if not input.accepted_terms:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Debes aceptar la politica de cancelacion antes de enviar la solicitud.",
        )

    activity = BOOKABLE_ACTIVITIES.get(input.activity_id)
    if activity is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Actividad no encontrada.",
        )

    if input.service_date and input.service_date < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La fecha de la actividad no puede estar en el pasado.",
        )

    selected_time_slot = input.time_slot or "Horario a confirmar"
    if input.time_slot and input.time_slot not in activity.allowed_time_slots:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La hora seleccionada no esta disponible para esta actividad.",
        )

    normalized_quantities: Dict[str, int] = {}
    estimated_total_cents = 0
    if input.quantities:
        try:
            pricing = calculate_price(input.activity_id, input.quantities)
        except ActivityPricingError as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)
            ) from exc
        normalized_quantities = pricing.normalized_quantities
        estimated_total_cents = pricing.total_cents

    created_at = utc_now().isoformat()
    customer_email_normalized = normalize_email(str(input.customer.email))
    request_id = str(uuid.uuid4())
    request_doc = {
        "id": request_id,
        "user_id": current_user["id"] if current_user else None,
        "activity_id": input.activity_id,
        "activity_title": activity.title,
        "service_date": input.service_date.isoformat() if input.service_date else None,
        "time_slot": selected_time_slot,
        "quantities": normalized_quantities,
        "estimated_total_cents": estimated_total_cents,
        "customer": {
            **input.customer.model_dump(),
            "email": customer_email_normalized,
        },
        "customer_email_normalized": customer_email_normalized,
        "notes": input.notes,
        "status": "inquiry_pending",
        "created_at": created_at,
        "updated_at": created_at,
    }
    await db.booking_requests.insert_one(request_doc)
    return AvailabilityRequestResponse(request_id=request_id, status="inquiry_pending")


@api_router.patch("/me/profile", response_model=UserPublic)
async def update_my_profile(
    input: ProfileUpdateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    update_fields = {
        field_name: value
        for field_name, value in input.model_dump(exclude_unset=True).items()
    }
    if not update_fields:
        return serialize_user(current_user)

    update_fields["updated_at"] = utc_now().isoformat()
    await db.users.update_one({"id": current_user["id"]}, {"$set": update_fields})
    current_user.update(update_fields)
    return serialize_user(current_user)


@api_router.get("/media-assets", response_model=List[MediaAssetResponse])
@api_router.get("/admin/media", response_model=List[MediaAssetResponse])
async def list_media_assets(
    include_deleted: bool = Query(default=False),
    tag: str | None = Query(default=None, max_length=80),
    kind: str | None = Query(default=None, max_length=32),
    current_user: Dict[str, Any] | None = Depends(get_optional_current_user),
):
    if include_deleted and (
        current_user is None or current_user.get("role") != "admin"
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo administracion puede ver elementos borrados.",
        )

    query: Dict[str, Any] = {}
    if not include_deleted:
        query["deleted_at"] = None
    if tag:
        query["tags"] = tag.strip().lower()
    if kind:
        query["kind"] = kind.strip().lower()

    assets = await (
        db.media_assets.find(query, {"_id": 0}).sort([("created_at", -1)]).to_list(500)
    )
    return [build_media_asset_response(asset) for asset in assets]


@api_router.post(
    "/media-assets",
    response_model=MediaAssetResponse,
    status_code=status.HTTP_201_CREATED,
)
@api_router.post(
    "/admin/media",
    response_model=MediaAssetResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_media_asset(
    input: MediaAssetCreate,
    admin_user: Dict[str, Any] = Depends(require_admin_user),
):
    timestamp = utc_now().isoformat()
    asset = {
        "id": str(uuid.uuid4()),
        "title": input.title.strip(),
        "url": input.url.strip(),
        "kind": input.kind.strip().lower(),
        "alt_text": input.alt_text,
        "caption": input.caption,
        "tags": input.tags,
        "storage_key": input.storage_key,
        "is_public": input.is_public,
        "metadata": input.metadata,
        "deleted_at": None,
        "created_at": timestamp,
        "updated_at": timestamp,
        "created_by_user_id": admin_user["id"],
    }
    await db.media_assets.insert_one(asset)
    return build_media_asset_response(asset)


@api_router.patch("/media-assets/{asset_id}", response_model=MediaAssetResponse)
@api_router.patch("/admin/media/{asset_id}", response_model=MediaAssetResponse)
async def update_media_asset(
    asset_id: str,
    input: MediaAssetUpdate,
    admin_user: Dict[str, Any] = Depends(require_admin_user),
):
    existing_asset = await db.media_assets.find_one({"id": asset_id}, {"_id": 0})
    if existing_asset is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Asset no encontrado."
        )

    update_fields = {
        field_name: value
        for field_name, value in input.model_dump(exclude_unset=True).items()
    }
    if "kind" in update_fields and update_fields["kind"] is not None:
        update_fields["kind"] = update_fields["kind"].lower()
    update_fields["updated_at"] = utc_now().isoformat()
    update_fields["updated_by_user_id"] = admin_user["id"]

    await db.media_assets.update_one({"id": asset_id}, {"$set": update_fields})
    existing_asset.update(update_fields)
    return build_media_asset_response(existing_asset)


@api_router.delete("/media-assets/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
@api_router.delete("/admin/media/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_media_asset(
    asset_id: str,
    admin_user: Dict[str, Any] = Depends(require_admin_user),
):
    existing_asset = await db.media_assets.find_one({"id": asset_id}, {"_id": 0})
    if existing_asset is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Asset no encontrado."
        )

    timestamp = utc_now().isoformat()
    await db.media_assets.update_one(
        {"id": asset_id},
        {
            "$set": {
                "deleted_at": timestamp,
                "updated_at": timestamp,
                "updated_by_user_id": admin_user["id"],
            }
        },
    )
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@api_router.post("/payments/sumup/checkouts", response_model=CheckoutCreateResponse)
async def create_sumup_checkout(
    input: CheckoutCreate,
    current_user: Dict[str, Any] | None = Depends(get_optional_current_user),
):
    payments_enabled = os.environ.get("SUMUP_PAYMENTS_ENABLED", "false").lower() in {
        "1",
        "true",
        "yes",
    }
    if not payments_enabled:
        raise HTTPException(
            status_code=503,
            detail="Los pagos online todavia no estan activados en produccion.",
        )
    if not input.accepted_terms:
        raise HTTPException(
            status_code=400,
            detail="Debes aceptar la politica de cancelacion antes de pagar.",
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
            detail="La actividad no esta disponible para reserva online.",
        )
    if not activity.online_booking_enabled:
        raise HTTPException(
            status_code=409,
            detail="Esta actividad requiere confirmar antes el horario con el operador.",
        )
    if input.time_slot not in activity.allowed_time_slots:
        raise HTTPException(
            status_code=400,
            detail="La hora seleccionada no esta disponible para esta actividad.",
        )

    try:
        pricing = calculate_price(input.activity_id, input.quantities)
    except ActivityPricingError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    booking_id = str(uuid.uuid4())
    checkout_reference = f"OWA-{booking_id.split('-')[0].upper()}"
    created_at = utc_now().isoformat()
    public_site_url = os.environ.get("PUBLIC_SITE_URL", "http://localhost:3000").rstrip(
        "/"
    )
    public_api_url = os.environ.get("PUBLIC_API_URL", public_site_url).rstrip("/")
    redirect_url = f"{public_site_url}/pago/resultado?booking_id={booking_id}"
    return_url = f"{public_api_url}/api/payments/sumup/webhook"
    customer_email_normalized = normalize_email(str(input.customer.email))

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
        "customer": {
            **input.customer.model_dump(),
            "email": customer_email_normalized,
        },
        "customer_email_normalized": customer_email_normalized,
        "user_id": current_user["id"] if current_user else None,
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
            detail="No se recibio un identificador de pago valido.",
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


# ---------------------------------------------------------------------------
# Activities & destinations — Mongo-backed content API (read-only public).
# Booking/pricing stays in activity_catalog.py; this only serves content.
# ---------------------------------------------------------------------------

def _localize(value: Any, lang: str) -> Any:
    """Collapse i18n objects {"es": .., "en": ..} to one language (fallback en).
    Recurses through dicts and lists; non-i18n values pass through unchanged."""
    if isinstance(value, dict):
        if "es" in value or "en" in value:
            return value.get(lang) or value.get("en") or value.get("es")
        return {k: _localize(v, lang) for k, v in value.items()}
    if isinstance(value, list):
        return [_localize(v, lang) for v in value]
    return value


@api_router.get("/activities")
async def list_activities(
    island: str = Query(None),
    category: str = Query(None),
    featured: bool = Query(None),
    q: str = Query(None),
    lang: str = Query(None),
    limit: int = Query(60, ge=1, le=200),
    skip: int = Query(0, ge=0),
):
    query: Dict[str, Any] = {"active": True}
    if island:
        query["island"] = island
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    if q:
        query["$or"] = [
            {"title.es": {"$regex": q, "$options": "i"}},
            {"title.en": {"$regex": q, "$options": "i"}},
            {"location": {"$regex": q, "$options": "i"}},
        ]
    total = await db.activities.count_documents(query)
    items = await db.activities.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(length=limit)
    if lang:
        items = [_localize(it, lang) for it in items]
    return {"items": items, "total": total}


@api_router.get("/activities/{slug}")
async def get_activity(slug: str, lang: str = Query(None)):
    doc = await db.activities.find_one({"slug": slug, "active": True}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
    return _localize(doc, lang) if lang else doc


@api_router.get("/activities/{slug}/related")
async def related_activities(slug: str, limit: int = Query(4, ge=1, le=12), lang: str = Query(None)):
    base = await db.activities.find_one({"slug": slug}, {"_id": 0, "island": 1, "category": 1})
    if not base:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
    query = {
        "active": True,
        "slug": {"$ne": slug},
        "$or": [{"island": base.get("island")}, {"category": base.get("category")}],
    }
    items = await db.activities.find(query, {"_id": 0}).limit(limit).to_list(length=limit)
    if lang:
        items = [_localize(it, lang) for it in items]
    return {"items": items, "total": len(items)}


@api_router.get("/destinations")
async def list_destinations(lang: str = Query(None)):
    items = await db.destinations.find({"active": True}, {"_id": 0}).to_list(length=100)
    for it in items:
        it["activity_count"] = await db.activities.count_documents(
            {"island": it["slug"], "active": True}
        )
    if lang:
        items = [_localize(it, lang) for it in items]
    return items


@api_router.get("/destinations/{slug}")
async def get_destination(slug: str, lang: str = Query(None)):
    doc = await db.destinations.find_one({"slug": slug, "active": True}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Destination not found")
    doc["activity_count"] = await db.activities.count_documents({"island": slug, "active": True})
    return _localize(doc, lang) if lang else doc


# ---------------------------------------------------------------------------
# Admin content management (protected with require_admin_user).
# Activities become DB-driven: create/edit from the admin, no code changes.
# Booking/pricing still validated server-side by activity_catalog.py via slug.
# ---------------------------------------------------------------------------

I18nStr = Dict[str, str]


class ActivityUpsert(BaseModel):
    model_config = ConfigDict(extra="ignore")

    slug: str = Field(min_length=1, max_length=140)
    title: I18nStr
    excerpt: I18nStr | None = None
    description: I18nStr | None = None
    island: str
    location: str | None = None
    category: str
    duration: str | None = None
    price: float = Field(ge=0)
    original_price: float | None = None
    price_unit: str = "persona"
    currency: str = "EUR"
    image: str | None = None
    gallery: List[str] = []
    featured: bool = False
    booking_enabled: bool = False
    included: List[I18nStr] = []
    not_included: List[I18nStr] = []
    meeting_point: str | None = None
    provider: Dict[str, Any] | None = None
    cancellation_policy: Dict[str, Any] | None = None
    ticket_types: List[Dict[str, Any]] = []
    time_slots: List[str] = []
    active: bool = True


class DestinationUpsert(BaseModel):
    model_config = ConfigDict(extra="ignore")

    slug: str = Field(min_length=1, max_length=140)
    name: I18nStr
    image: str | None = None
    active: bool = True


@api_router.post("/admin/activities", status_code=status.HTTP_201_CREATED)
async def admin_create_activity(
    payload: ActivityUpsert,
    _admin: Dict[str, Any] = Depends(require_admin_user),
):
    if await db.activities.find_one({"slug": payload.slug}):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Ya existe una actividad con ese slug.")
    now = datetime.now(timezone.utc)
    doc = payload.model_dump()
    doc["bookable"] = payload.slug in BOOKABLE_ACTIVITIES
    doc["created_at"] = now
    doc["updated_at"] = now
    await db.activities.insert_one(doc)
    return {"slug": payload.slug, "created": True}


@api_router.put("/admin/activities/{slug}")
async def admin_update_activity(
    slug: str,
    payload: ActivityUpsert,
    _admin: Dict[str, Any] = Depends(require_admin_user),
):
    now = datetime.now(timezone.utc)
    doc = payload.model_dump()
    doc["slug"] = slug
    doc["bookable"] = slug in BOOKABLE_ACTIVITIES
    doc["updated_at"] = now
    await db.activities.update_one(
        {"slug": slug},
        {"$set": doc, "$setOnInsert": {"created_at": now}},
        upsert=True,
    )
    return {"slug": slug, "updated": True}


@api_router.delete("/admin/activities/{slug}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_activity(
    slug: str,
    _admin: Dict[str, Any] = Depends(require_admin_user),
):
    result = await db.activities.update_one(
        {"slug": slug}, {"$set": {"active": False, "updated_at": datetime.now(timezone.utc)}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@api_router.put("/admin/destinations/{slug}")
async def admin_upsert_destination(
    slug: str,
    payload: DestinationUpsert,
    _admin: Dict[str, Any] = Depends(require_admin_user),
):
    now = datetime.now(timezone.utc)
    doc = payload.model_dump()
    doc["slug"] = slug
    doc["updated_at"] = now
    await db.destinations.update_one(
        {"slug": slug},
        {"$set": doc, "$setOnInsert": {"created_at": now}},
        upsert=True,
    )
    return {"slug": slug, "updated": True}


@api_router.delete("/admin/destinations/{slug}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_destination(
    slug: str,
    _admin: Dict[str, Any] = Depends(require_admin_user),
):
    result = await db.destinations.update_one(
        {"slug": slug}, {"$set": {"active": False, "updated_at": datetime.now(timezone.utc)}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Destination not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# ---------------------------------------------------------------------------
# Admin reservations dashboard (protected): list/manage bookings & enquiry
# requests and a small summary for the admin home. Read/manage only — the
# booking creation + SumUp flow is unchanged.
# ---------------------------------------------------------------------------

BOOKING_STATUSES = {
    "payment_pending", "paid", "confirmed", "cancelled", "refunded", "completed",
}
REQUEST_STATUSES = {"inquiry_pending", "contacted", "confirmed", "cancelled"}


class StatusUpdate(BaseModel):
    status: str


@api_router.get("/admin/bookings")
async def admin_list_bookings(
    status_filter: str = Query(None, alias="status"),
    limit: int = Query(50, ge=1, le=200),
    skip: int = Query(0, ge=0),
    _admin: Dict[str, Any] = Depends(require_admin_user),
):
    query: Dict[str, Any] = {}
    if status_filter:
        query["status"] = status_filter
    total = await db.bookings.count_documents(query)
    items = await db.bookings.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(length=limit)
    return {"items": items, "total": total}


@api_router.get("/admin/booking-requests")
async def admin_list_booking_requests(
    status_filter: str = Query(None, alias="status"),
    limit: int = Query(50, ge=1, le=200),
    skip: int = Query(0, ge=0),
    _admin: Dict[str, Any] = Depends(require_admin_user),
):
    query: Dict[str, Any] = {}
    if status_filter:
        query["status"] = status_filter
    total = await db.booking_requests.count_documents(query)
    items = await db.booking_requests.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(length=limit)
    return {"items": items, "total": total}


@api_router.patch("/admin/bookings/{booking_id}")
async def admin_update_booking_status(
    booking_id: str,
    payload: StatusUpdate,
    _admin: Dict[str, Any] = Depends(require_admin_user),
):
    if payload.status not in BOOKING_STATUSES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Estado de reserva no válido.")
    result = await db.bookings.update_one(
        {"id": booking_id}, {"$set": {"status": payload.status, "updated_at": datetime.now(timezone.utc)}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    return {"id": booking_id, "status": payload.status}


@api_router.patch("/admin/booking-requests/{request_id}")
async def admin_update_request_status(
    request_id: str,
    payload: StatusUpdate,
    _admin: Dict[str, Any] = Depends(require_admin_user),
):
    if payload.status not in REQUEST_STATUSES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Estado de solicitud no válido.")
    result = await db.booking_requests.update_one(
        {"id": request_id}, {"$set": {"status": payload.status, "updated_at": datetime.now(timezone.utc)}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking request not found")
    return {"id": request_id, "status": payload.status}


@api_router.get("/admin/summary")
async def admin_summary(_admin: Dict[str, Any] = Depends(require_admin_user)):
    return {
        "activities": await db.activities.count_documents({"active": True}),
        "activities_bookable": await db.activities.count_documents({"active": True, "bookable": True}),
        "destinations": await db.destinations.count_documents({"active": True}),
        "bookings_total": await db.bookings.count_documents({}),
        "bookings_paid": await db.bookings.count_documents({"status": "paid"}),
        "bookings_pending": await db.bookings.count_documents({"status": "payment_pending"}),
        "requests_pending": await db.booking_requests.count_documents({"status": "inquiry_pending"}),
    }


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
    await db.bookings.create_index("user_id", sparse=True)
    await db.bookings.create_index("customer_email_normalized")
    await db.users.create_index("id", unique=True)
    await db.users.create_index("email", unique=True)
    await db.booking_requests.create_index("id", unique=True)
    await db.booking_requests.create_index("user_id", sparse=True)
    await db.booking_requests.create_index("customer_email_normalized")
    await db.media_assets.create_index("id", unique=True)
    await db.media_assets.create_index("deleted_at")
    await db.media_assets.create_index("tags")
    await db.activities.create_index("slug", unique=True)
    await db.activities.create_index([("island", 1), ("active", 1)])
    await db.activities.create_index([("category", 1), ("active", 1)])
    await db.activities.create_index([("featured", -1)])
    await db.destinations.create_index("slug", unique=True)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

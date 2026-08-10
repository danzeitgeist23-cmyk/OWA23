from dataclasses import dataclass
from typing import Dict, Mapping


class ActivityPricingError(ValueError):
    """Raised when a booking selection does not match the server-side catalog."""


@dataclass(frozen=True)
class TicketType:
    label: str
    price_cents: int
    minimum: int = 0
    maximum: int = 12
    seats: int = 1


@dataclass(frozen=True)
class BookableActivity:
    title: str
    provider_id: str
    provider_name: str
    provider_url: str
    cancellation_source_url: str
    cancellation_notice_hours: int
    allowed_time_slots: tuple[str, ...]
    tickets: Mapping[str, TicketType]
    capacity: int
    online_booking_enabled: bool = True
    commercial_terms_verified_on: str = "2026-08-10"
    commission_min_percent: int = 20
    commission_max_percent: int = 30


def _jet_ski_activity(title: str, price_cents: int) -> BookableActivity:
    return BookableActivity(
        title=title,
        provider_id="maspalomas-jet-ski-tour",
        provider_name="Maspalomas Jet Ski Tour",
        provider_url="https://maspalomasjetskitour.es/tours-en-moto-de-agua-maspalomas/",
        cancellation_source_url="https://maspalomasjetskitour.es/terminos-y-condiciones/",
        cancellation_notice_hours=24,
        allowed_time_slots=("Horario a confirmar",),
        tickets={
            "single_jet_ski": TicketType(
                label="Moto individual",
                price_cents=price_cents,
                maximum=6,
                seats=1,
            ),
            "double_jet_ski": TicketType(
                label="Moto doble",
                price_cents=price_cents,
                maximum=6,
                seats=2,
            ),
        },
        capacity=12,
        online_booking_enabled=False,
    )


BOOKABLE_ACTIVITIES: Dict[str, BookableActivity] = {
    "infinity-yacht-premium-shared": BookableActivity(
        title="Excursión Compartida en Yate Premium",
        provider_id="infinity-boat-gc",
        provider_name="Infinity Boat Tours",
        provider_url=(
            "https://www.infinityboatgc.com/" "excursion-compartida-en-yate-premium"
        ),
        cancellation_source_url=(
            "https://www.infinityboatgc.com/" "excursion-compartida-en-yate-premium"
        ),
        cancellation_notice_hours=48,
        allowed_time_slots=("09:30", "13:30"),
        tickets={
            "adult": TicketType(
                label="Adulto",
                price_cents=7921,
                maximum=12,
            ),
            "child": TicketType(
                label="Niño de 1 a 10 años",
                price_cents=5500,
                maximum=12,
            ),
        },
        capacity=12,
    ),
    "infinity-catamaran-shared": BookableActivity(
        title="Crucero Compartido en Catamarán Paradise",
        provider_id="infinity-boat-gc",
        provider_name="Infinity Boat Tours",
        provider_url="https://www.infinityboatgc.com/excursion-en-catamaran-compartida",
        cancellation_source_url=(
            "https://www.infinityboatgc.com/excursion-en-catamaran-compartida"
        ),
        cancellation_notice_hours=48,
        allowed_time_slots=("10:30",),
        tickets={
            "adult": TicketType(
                label="Adulto",
                price_cents=7393,
                maximum=45,
            ),
            "child": TicketType(
                label="Niño de 3 a 10 años",
                price_cents=5000,
                maximum=45,
            ),
        },
        capacity=45,
    ),
    "maspalomas-jet-ski-express": _jet_ski_activity(
        "Jet Ski Tour Express — 30 minutos",
        7500,
    ),
    "maspalomas-jet-ski-adventure": _jet_ski_activity(
        "Jet Ski Tour Aventura — 60 minutos",
        12000,
    ),
    "maspalomas-jet-ski-explorer": _jet_ski_activity(
        "Jet Ski Tour Explorer — 90 minutos",
        16000,
    ),
    "maspalomas-jet-ski-gran-canaria": _jet_ski_activity(
        "Jet Ski Tour Gran Canaria — 120 minutos",
        20000,
    ),
}


@dataclass(frozen=True)
class PriceCalculation:
    total_cents: int
    total_seats: int
    normalized_quantities: Dict[str, int]
    line_items: list[dict]


def calculate_price(
    activity_id: str,
    quantities: Mapping[str, int],
) -> PriceCalculation:
    activity = BOOKABLE_ACTIVITIES.get(activity_id)
    if activity is None:
        raise ActivityPricingError(
            "La actividad no está disponible para reserva online."
        )

    unknown_ticket_ids = set(quantities) - set(activity.tickets)
    if unknown_ticket_ids:
        raise ActivityPricingError(
            "La selección contiene un tipo de entrada no válido."
        )

    normalized: Dict[str, int] = {}
    line_items: list[dict] = []
    total_cents = 0
    total_seats = 0

    for ticket_id, ticket in activity.tickets.items():
        raw_quantity = quantities.get(ticket_id, 0)
        if isinstance(raw_quantity, bool) or not isinstance(raw_quantity, int):
            raise ActivityPricingError("Las cantidades deben ser números enteros.")
        if raw_quantity < ticket.minimum or raw_quantity > ticket.maximum:
            raise ActivityPricingError(
                f"La cantidad seleccionada para {ticket.label} no es válida."
            )

        normalized[ticket_id] = raw_quantity
        if raw_quantity == 0:
            continue

        line_total_cents = raw_quantity * ticket.price_cents
        total_cents += line_total_cents
        total_seats += raw_quantity * ticket.seats
        line_items.append(
            {
                "ticket_id": ticket_id,
                "label": ticket.label,
                "quantity": raw_quantity,
                "unit_price_cents": ticket.price_cents,
                "line_total_cents": line_total_cents,
                "seats": raw_quantity * ticket.seats,
            }
        )

    if total_cents <= 0:
        raise ActivityPricingError("Selecciona al menos una entrada.")
    if total_seats > activity.capacity:
        raise ActivityPricingError("La selección supera la capacidad de la actividad.")

    return PriceCalculation(
        total_cents=total_cents,
        total_seats=total_seats,
        normalized_quantities=normalized,
        line_items=line_items,
    )

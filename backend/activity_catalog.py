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


def _legacy_activity(
    *,
    title: str,
    provider_id: str,
    provider_name: str,
    provider_url: str = "",
    cancellation_source_url: str = "",
    cancellation_notice_hours: int = 24,
    allowed_time_slots: tuple[str, ...] = ("Horario a confirmar",),
    tickets: Mapping[str, TicketType],
    capacity: int,
) -> BookableActivity:
    return BookableActivity(
        title=title,
        provider_id=provider_id,
        provider_name=provider_name,
        provider_url=provider_url,
        cancellation_source_url=cancellation_source_url or provider_url,
        cancellation_notice_hours=cancellation_notice_hours,
        allowed_time_slots=allowed_time_slots,
        tickets=tickets,
        capacity=capacity,
        online_booking_enabled=False,
        commercial_terms_verified_on="2026-08-11",
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
    "water-taxi-lobos": _legacy_activity(
        title="Taxi acuatico a Lobos",
        provider_id="water-taxi-lobos",
        provider_name="OWA Partner",
        tickets={
            "adult": TicketType(label="Adultos", price_cents=1700, minimum=1),
            "child": TicketType(label="Ninos", price_cents=1700),
        },
        capacity=24,
    ),
    "ocean-giants-cruise": _legacy_activity(
        title="Ocean Giants Boat Cruise",
        provider_id="ocean-giants-cruise",
        provider_name="OWA Partner",
        tickets={
            "adult": TicketType(label="Adultos", price_cents=4000, minimum=1),
            "child": TicketType(label="Ninos", price_cents=3000),
        },
        capacity=24,
    ),
    "safari-buggy": _legacy_activity(
        title="Safari Buggy Experience",
        provider_id="safari-buggy",
        provider_name="OWA Partner",
        tickets={
            "buggy": TicketType(
                label="Buggy 2 plazas",
                price_cents=9500,
                minimum=1,
                maximum=6,
                seats=2,
            ),
        },
        capacity=12,
    ),
    "jet-ski-tenerife": _legacy_activity(
        title="Jet Ski Safari Tenerife",
        provider_id="jet-ski-tenerife",
        provider_name="OWA Partner",
        tickets={
            "single_jet_ski": TicketType(
                label="Moto individual",
                price_cents=6500,
                minimum=1,
                maximum=6,
                seats=1,
            ),
            "double_jet_ski": TicketType(
                label="Moto doble",
                price_cents=8000,
                maximum=6,
                seats=2,
            ),
        },
        capacity=12,
    ),
    "parasailing-lanzarote": _legacy_activity(
        title="Parasailing Lanzarote",
        provider_id="parasailing-lanzarote",
        provider_name="OWA Partner",
        tickets={
            "adult": TicketType(label="Adultos", price_cents=5500, minimum=1),
        },
        capacity=12,
    ),
    "banana-boat": _legacy_activity(
        title="Banana Boat Fun Ride",
        provider_id="banana-boat",
        provider_name="OWA Partner",
        tickets={
            "adult": TicketType(label="Adultos", price_cents=2800, minimum=1),
        },
        capacity=12,
    ),
    "boat-rental": _legacy_activity(
        title="Boat Rental Without License",
        provider_id="boat-rental",
        provider_name="OWA Partner",
        tickets={
            "boat": TicketType(
                label="Barco completo",
                price_cents=18000,
                minimum=1,
                maximum=2,
                seats=6,
            ),
        },
        capacity=12,
    ),
    "catamaran-sunset": _legacy_activity(
        title="Sunset Catamaran Cruise",
        provider_id="catamaran-sunset",
        provider_name="OWA Partner",
        tickets={
            "adult": TicketType(label="Adultos", price_cents=7500, minimum=1, maximum=24),
            "child": TicketType(label="Ninos", price_cents=5500, maximum=24),
        },
        capacity=48,
    ),
    "snorkel-teno": _legacy_activity(
        title="Snorkel in Teno Cliffs",
        provider_id="snorkel-teno",
        provider_name="OWA Partner",
        tickets={
            "adult": TicketType(label="Adultos", price_cents=4500, minimum=1),
        },
        capacity=12,
    ),
    "buceo-lanzarote": _legacy_activity(
        title="Buceo para Principiantes",
        provider_id="buceo-lanzarote",
        provider_name="OWA Partner",
        tickets={
            "adult": TicketType(label="Adultos", price_cents=8900, minimum=1),
        },
        capacity=12,
    ),
    "kayak-cuevas": _legacy_activity(
        title="Kayak y Cuevas Marinas",
        provider_id="kayak-cuevas",
        provider_name="OWA Partner",
        tickets={
            "adult": TicketType(label="Adultos", price_cents=3900, minimum=1),
        },
        capacity=12,
    ),
    "teide-hike": _legacy_activity(
        title="Teide Volcano Hike",
        provider_id="teide-hike",
        provider_name="OWA Partner",
        tickets={
            "adult": TicketType(label="Adultos", price_cents=4900, minimum=1),
        },
        capacity=12,
    ),
    "paragliding": _legacy_activity(
        title="Paragliding Tandem Flight",
        provider_id="paragliding",
        provider_name="OWA Partner",
        tickets={
            "adult": TicketType(label="Adultos", price_cents=11000, minimum=1),
        },
        capacity=12,
    ),
    "stand-up-paddle": _legacy_activity(
        title="Stand Up Paddle Session",
        provider_id="stand-up-paddle",
        provider_name="OWA Partner",
        tickets={
            "adult": TicketType(label="Adultos", price_cents=2500, minimum=1),
        },
        capacity=12,
    ),
    "wine-tour": _legacy_activity(
        title="Volcanic Wine Tasting Tour",
        provider_id="wine-tour",
        provider_name="OWA Partner",
        tickets={
            "adult": TicketType(label="Adultos", price_cents=6900, minimum=1),
        },
        capacity=12,
    ),
    "stargazing": _legacy_activity(
        title="Stargazing Under Canary Skies",
        provider_id="stargazing",
        provider_name="OWA Partner",
        tickets={
            "adult": TicketType(label="Adultos", price_cents=5900, minimum=1),
        },
        capacity=12,
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

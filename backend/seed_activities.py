"""Idempotent seed for the Mongo `activities` and `destinations` collections.

Reads the content exported from the frontend (seed_activities.json /
seed_destinations.json) and upserts it into Mongo. Translatable text fields are
stored as an i18n object {"es": ..., "en": ...}; `en` is seeded as a fallback
copy of `es` until real translations are added (do NOT invent them here).

The activity `slug` is the existing frontend id and is kept unchanged so the
SumUp checkout (which keys off that slug via backend/activity_catalog.py) is not
affected. `bookable` is derived from BOOKABLE_ACTIVITIES.

Run:  python seed_activities.py   (idempotent, safe to re-run)
"""

import json
import os
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne

from activity_catalog import BOOKABLE_ACTIVITIES

ROOT = Path(__file__).parent
load_dotenv(ROOT / ".env")

I18N_FALLBACK = "en"


def i18n(text):
    """Wrap a plain string as {"es": text, "en": text} (en = fallback for now)."""
    if text is None:
        return None
    return {"es": text, "en": text}


def i18n_list(items):
    return [i18n(x) for x in (items or [])]


def build_activity_doc(a: dict) -> dict:
    slug = a["id"]
    now = datetime.now(timezone.utc)
    return {
        "slug": slug,
        "title": i18n(a.get("title")),
        "excerpt": i18n(a.get("shortDescription")),
        "description": i18n(a.get("description")),
        "island": a.get("destination"),
        "location": a.get("location"),
        "category": a.get("category"),
        "duration": a.get("duration"),
        "price": a.get("price"),
        "original_price": a.get("originalPrice"),
        "price_unit": a.get("priceUnit", "persona"),
        "currency": a.get("paymentCurrency", "EUR"),
        "rating": a.get("rating"),
        "review_count": a.get("reviews", 0),
        "featured": bool(a.get("featured")),
        "bookable": slug in BOOKABLE_ACTIVITIES,
        "booking_enabled": bool(a.get("bookingEnabled")),
        "image": a.get("image"),
        "gallery": a.get("gallery", []),
        "included": i18n_list(a.get("included")),
        "not_included": i18n_list(a.get("notIncluded")),
        "meeting_point": a.get("meetingPoint"),
        "provider": a.get("provider"),
        "cancellation_policy": a.get("cancellationPolicy"),
        "ticket_types": a.get("ticketTypes", []),
        "time_slots": a.get("timeSlots", []),
        "active": True,
        "updated_at": now,
    }


def main():
    mongo_url = os.environ["MONGO_URL"]
    db_name = os.environ["DB_NAME"]
    client = MongoClient(mongo_url)
    db = client[db_name]

    activities = json.loads((ROOT / "seed_activities.json").read_text())
    destinations = json.loads((ROOT / "seed_destinations.json").read_text())

    # Indexes
    db.activities.create_index("slug", unique=True)
    db.activities.create_index([("island", 1), ("active", 1)])
    db.activities.create_index([("category", 1), ("active", 1)])
    db.activities.create_index([("featured", -1)])
    db.destinations.create_index("slug", unique=True)

    now = datetime.now(timezone.utc)

    # Upsert activities
    ops = []
    for a in activities:
        doc = build_activity_doc(a)
        ops.append(
            UpdateOne(
                {"slug": doc["slug"]},
                {"$set": doc, "$setOnInsert": {"created_at": now}},
                upsert=True,
            )
        )
    result = db.activities.bulk_write(ops, ordered=False)

    # Upsert destinations (with real activity_count)
    dops = []
    for d in destinations:
        count = db.activities.count_documents({"island": d["id"], "active": True})
        dops.append(
            UpdateOne(
                {"slug": d["id"]},
                {
                    "$set": {
                        "slug": d["id"],
                        "name": i18n(d.get("name")),
                        "image": d.get("image"),
                        "activity_count": count,
                        "active": True,
                        "updated_at": now,
                    },
                    "$setOnInsert": {"created_at": now},
                },
                upsert=True,
            )
        )
    dresult = db.destinations.bulk_write(dops, ordered=False)

    print(
        f"activities: upserted={result.upserted_count} modified={result.modified_count} "
        f"total={db.activities.count_documents({})}"
    )
    print(
        f"destinations: upserted={dresult.upserted_count} modified={dresult.modified_count} "
        f"total={db.destinations.count_documents({})}"
    )
    client.close()


if __name__ == "__main__":
    main()

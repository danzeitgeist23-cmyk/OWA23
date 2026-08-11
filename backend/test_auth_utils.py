from datetime import UTC, datetime

from auth_utils import (
    create_access_token,
    decode_access_token,
    hash_password,
    normalize_email,
    verify_password,
)


def test_password_hash_roundtrip():
    password = "SecurePass123"
    password_hash = hash_password(password)

    assert password_hash != password
    assert verify_password(password, password_hash) is True
    assert verify_password("wrong-pass", password_hash) is False


def test_access_token_roundtrip():
    token = create_access_token(
        subject="user-123",
        email=" User@Example.com ",
        role="admin",
        secret_key="test-secret",
        algorithm="HS256",
        expires_minutes=30,
        now=datetime(2026, 8, 11, 12, 0, tzinfo=UTC),
    )

    payload = decode_access_token(
        token,
        secret_key="test-secret",
        algorithms=["HS256"],
    )

    assert payload["sub"] == "user-123"
    assert payload["email"] == normalize_email(" User@Example.com ")
    assert payload["role"] == "admin"

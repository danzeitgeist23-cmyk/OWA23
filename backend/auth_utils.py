from datetime import UTC, datetime, timedelta
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

PASSWORD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")


def normalize_email(email: str) -> str:
    return email.strip().lower()


def hash_password(password: str) -> str:
    return PASSWORD_CONTEXT.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    if not password_hash:
        return False
    return PASSWORD_CONTEXT.verify(password, password_hash)


def create_access_token(
    *,
    subject: str,
    email: str,
    role: str,
    secret_key: str,
    algorithm: str,
    expires_minutes: int,
    now: datetime | None = None,
) -> str:
    issued_at = now or datetime.now(UTC)
    payload = {
        "sub": subject,
        "email": normalize_email(email),
        "role": role,
        "iat": int(issued_at.timestamp()),
        "exp": int((issued_at + timedelta(minutes=expires_minutes)).timestamp()),
    }
    return jwt.encode(payload, secret_key, algorithm=algorithm)


def decode_access_token(
    token: str,
    *,
    secret_key: str,
    algorithms: list[str],
) -> dict[str, Any]:
    try:
        payload = jwt.decode(token, secret_key, algorithms=algorithms)
    except JWTError as exc:
        raise ValueError("Token invalido o expirado.") from exc
    if not isinstance(payload, dict):
        raise ValueError("Token invalido o expirado.")
    return payload

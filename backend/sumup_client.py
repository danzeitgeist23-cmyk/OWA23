import os
from typing import Any
from urllib.parse import urlparse

import httpx


class SumUpConfigurationError(RuntimeError):
    pass


class SumUpAPIError(RuntimeError):
    pass


class SumUpClient:
    def __init__(self) -> None:
        self.api_key = os.environ.get("SUMUP_API_KEY", "").strip()
        self.merchant_code = os.environ.get("SUMUP_MERCHANT_CODE", "").strip()
        self.api_base_url = os.environ.get(
            "SUMUP_API_BASE_URL",
            "https://api.sumup.com",
        ).rstrip("/")
        self.timeout_seconds = float(os.environ.get("SUMUP_HTTP_TIMEOUT_SECONDS", "12"))

    def _require_configuration(self) -> None:
        if not self.api_key or not self.merchant_code:
            raise SumUpConfigurationError(
                "SumUp todavía no está configurado en el servidor."
            )

    @property
    def headers(self) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    async def create_checkout(
        self,
        *,
        checkout_reference: str,
        amount_cents: int,
        description: str,
        redirect_url: str,
        return_url: str,
    ) -> dict[str, Any]:
        self._require_configuration()
        payload = {
            "checkout_reference": checkout_reference,
            "amount": amount_cents / 100,
            "currency": "EUR",
            "merchant_code": self.merchant_code,
            "description": description,
            "redirect_url": redirect_url,
            "return_url": return_url,
            "hosted_checkout": {"enabled": True},
        }
        data = await self._request("POST", "/v0.1/checkouts", json=payload)

        hosted_checkout_url = data.get("hosted_checkout_url")
        if not self._is_sumup_checkout_url(hosted_checkout_url):
            raise SumUpAPIError("SumUp no devolvió una URL de pago alojada válida.")

        return data

    async def get_checkout(self, checkout_id: str) -> dict[str, Any]:
        self._require_configuration()
        if not checkout_id:
            raise SumUpAPIError("Falta el identificador del pago.")
        return await self._request("GET", f"/v0.1/checkouts/{checkout_id}")

    async def _request(
        self,
        method: str,
        path: str,
        **kwargs: Any,
    ) -> dict[str, Any]:
        try:
            async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
                response = await client.request(
                    method,
                    f"{self.api_base_url}{path}",
                    headers=self.headers,
                    **kwargs,
                )
        except httpx.HTTPError as exc:
            raise SumUpAPIError(
                "No se pudo conectar con SumUp. Inténtalo de nuevo."
            ) from exc

        if response.status_code >= 400:
            raise SumUpAPIError("SumUp rechazó temporalmente la solicitud de pago.")

        try:
            data = response.json()
        except ValueError as exc:
            raise SumUpAPIError("SumUp devolvió una respuesta no válida.") from exc

        if not isinstance(data, dict):
            raise SumUpAPIError("SumUp devolvió una respuesta no válida.")
        return data

    @staticmethod
    def _is_sumup_checkout_url(value: Any) -> bool:
        if not isinstance(value, str):
            return False
        parsed = urlparse(value)
        return (
            parsed.scheme == "https"
            and parsed.hostname == "checkout.sumup.com"
            and parsed.path.startswith("/web/")
        )

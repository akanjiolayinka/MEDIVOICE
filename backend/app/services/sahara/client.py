import httpx

from app.config.settings import Settings, settings
from app.services.sahara.interface import SaharaResult, SpeechProvider


class SaharaNotConfiguredError(Exception):
    """Raised when SAHARA_API_KEY (and/or SAHARA_API_URL) isn't set."""


class SaharaClient(SpeechProvider):
    """
    Real integration point for Sahara's CodeSwitch API. No Sahara API
    documentation was available when this was written, so the request/
    response shape below is a clearly-marked PLACEHOLDER — it must be
    confirmed against the actual hackathon-supplied Sahara docs before this
    can transcribe real audio. Until SAHARA_API_KEY is set, this always
    raises SaharaNotConfiguredError rather than fabricating a transcript
    (master build prompt rule #36).
    """

    def __init__(self, config: Settings = settings):
        self._api_key = config.sahara_api_key
        self._api_url = config.sahara_api_url

    async def transcribe(self, audio_bytes: bytes) -> SaharaResult:
        if not self._api_key:
            raise SaharaNotConfiguredError(
                "SAHARA_API_KEY is not set — Sahara speech transcription is "
                "unavailable until it is configured."
            )

        # TODO(Phase 3 follow-up): confirm the real Sahara CodeSwitch API
        # request/response contract. This is a placeholder REST shape
        # (multipart audio upload + bearer auth, expecting a JSON body of
        # {transcript, languages, confidence}) and has never been verified
        # against a live Sahara endpoint.
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{self._api_url}/v1/codeswitch/transcribe",
                headers={"Authorization": f"Bearer {self._api_key}"},
                files={"audio": ("recording.webm", audio_bytes, "audio/webm")},
            )
            response.raise_for_status()
            data = response.json()

        return SaharaResult(
            transcript=data["transcript"],
            languages=data.get("languages", []),
            confidence=data.get("confidence", 0.0),
        )


sahara_client = SaharaClient()

from abc import ABC, abstractmethod

from pydantic import BaseModel, Field


class SaharaResult(BaseModel):
    """Normalized transcription result, regardless of speech provider."""

    transcript: str
    languages: list[str] = Field(default_factory=list)
    confidence: float


class SpeechProvider(ABC):
    """
    Abstraction over a speech/code-switching backend. Sahara is the only
    real implementation right now (see client.py). This interface exists so
    a second provider can be benchmarked against Sahara later (master build
    prompt §23) without changing anything downstream of transcription —
    intentionally not pre-building ProviderB/ProviderC stubs until a real
    second provider is actually being integrated.
    """

    @abstractmethod
    async def transcribe(self, audio_bytes: bytes) -> SaharaResult:
        raise NotImplementedError

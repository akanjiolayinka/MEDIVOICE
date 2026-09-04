from pydantic import BaseModel, Field


class VoiceProcessResponse(BaseModel):
    """Successful /api/voice/process response — mirrors SaharaResult."""

    transcript: str
    languages: list[str] = Field(default_factory=list)
    confidence: float

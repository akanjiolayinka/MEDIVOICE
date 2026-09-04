from typing import Literal

from pydantic import BaseModel


class ServiceNotConfiguredError(BaseModel):
    """
    Returned with HTTP 503 whenever a downstream service (Sahara, and later
    YarnGPT/the LLM agent/facility search) is missing its credentials.
    Never replaced with a fabricated success response — see master build
    prompt rule #36.
    """

    error: Literal["service_not_configured"] = "service_not_configured"
    service: str
    message: str


class InvalidAudioError(BaseModel):
    error: Literal["invalid_audio"] = "invalid_audio"
    message: str

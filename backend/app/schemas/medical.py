from typing import Literal

from pydantic import BaseModel, Field


class MedicalState(BaseModel):
    """
    Structured conversation state (master build prompt §7). Shared between
    the agent (which populates it from a transcript, Phase 4) and the
    triage engine (which reads it to decide urgency, Phase 6) — kept
    intentionally free of anything not relevant to the current
    conversation, per the prompt's "don't collect unnecessary sensitive
    information" instruction.
    """

    symptoms: list[str] = Field(default_factory=list)
    duration: str = ""
    severity: str = ""
    temperature: str = ""
    additional_symptoms: list[str] = Field(default_factory=list)
    red_flags: list[str] = Field(default_factory=list)
    language_mix: list[str] = Field(default_factory=list)
    intent: str = ""
    user_age: int | None = None
    relevant_context: str = ""


Urgency = Literal["routine", "prompt", "emergency"]


class TriageResult(BaseModel):
    """Output of the deterministic safety/triage engine — never a diagnosis."""

    urgency: Urgency
    red_flags: list[str] = Field(default_factory=list)
    message: str
    recommend_emergency_care: bool = False

from pydantic import BaseModel, Field

from app.schemas.medical import MedicalState

MISSING_FIELD_QUESTIONS: dict[str, str] = {
    "symptoms": "Can you tell me what you've been experiencing?",
    "duration": "How long have you been feeling this way?",
    "temperature": "Have you been able to check your temperature?",
}


class AgentTurnResult(BaseModel):
    """What the agent produced for one conversation turn, before the
    safety/triage engine (which runs independently, in the API layer) gets
    a say in the final response text."""

    medical_state: MedicalState
    suggested_response: str = ""
    missing_fields: list[str] = Field(default_factory=list)

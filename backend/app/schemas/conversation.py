from pydantic import BaseModel

from app.schemas.medical import MedicalState, TriageResult


class ConversationMessageRequest(BaseModel):
    session_id: str
    transcript: str


class ConversationMessageResponse(BaseModel):
    response_text: str
    medical_state: MedicalState
    triage: TriageResult
    next_action: str

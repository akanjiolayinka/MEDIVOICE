from fastapi import APIRouter

from app.schemas.medical import MedicalState, TriageResult
from app.services.triage import rules

router = APIRouter()


@router.post("/api/triage/assess", response_model=TriageResult)
async def assess(state: MedicalState) -> TriageResult:
    """
    Real, deterministic safety/triage assessment (Phase 6) — needs no
    external credentials, so this works today. Takes a MedicalState (either
    produced by the real agent once Phase 4 is configured, or a labeled
    demo fixture from the frontend) and returns an honest, rule-based
    urgency assessment. Never a diagnosis.
    """
    return rules.assess(state)

from app.schemas.medical import TriageResult
from app.services.agent.models import MISSING_FIELD_QUESTIONS

DEFAULT_FOLLOWUP = "Thank you for sharing that. Is there anything else you'd like to add?"


def compose_response(
    *,
    triage: TriageResult,
    suggested_response: str,
    missing_fields: list[str],
) -> str:
    """
    Decides the final response text for this turn. The safety/triage
    engine always wins (master build prompt §8: "stop unnecessary
    questioning" and communicate urgency) regardless of what the LLM
    suggested — this is the one place the agent's output can be
    overridden outright.
    """
    if triage.recommend_emergency_care:
        return triage.message

    if suggested_response:
        return suggested_response

    for field in missing_fields:
        if field in MISSING_FIELD_QUESTIONS:
            return MISSING_FIELD_QUESTIONS[field]

    return DEFAULT_FOLLOWUP

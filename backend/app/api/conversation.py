from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.models.session import ConversationTurn, get_or_create_session
from app.schemas.conversation import ConversationMessageRequest, ConversationMessageResponse
from app.schemas.errors import ServiceNotConfiguredError
from app.services.agent.conversation import conversation_agent
from app.services.agent.llm_client import AgentNotConfiguredError
from app.services.agent.response import compose_response
from app.services.triage import rules as triage_rules

router = APIRouter()


def _determine_next_action(intent: str, recommend_emergency_care: bool) -> str:
    if recommend_emergency_care:
        return "seek_emergency_care"
    if intent == "request_facility_search":
        return "facility_search"
    return "continue_conversation"


@router.post("/api/conversation/message")
async def post_message(payload: ConversationMessageRequest):
    """
    Real conversation turn (Phase 5/8): loads session memory, runs the AI
    agent (Phase 4) to extract/merge structured medical info, runs the
    independent safety/triage engine (Phase 6, always real) on the result,
    and returns a response whose text the triage engine can override.
    Honestly reports 503 if the agent isn't configured — never fabricates
    an extraction or a triage outcome.
    """
    session = get_or_create_session(payload.session_id)
    session.turns.append(ConversationTurn(speaker="user", text=payload.transcript))

    try:
        agent_result = await conversation_agent.process_turn(
            payload.transcript, session.medical_state
        )
    except AgentNotConfiguredError as exc:
        return JSONResponse(
            status_code=503,
            content=ServiceNotConfiguredError(
                service="agent", message=str(exc)
            ).model_dump(),
        )

    session.medical_state = agent_result.medical_state
    triage_result = triage_rules.assess(session.medical_state)

    response_text = compose_response(
        triage=triage_result,
        suggested_response=agent_result.suggested_response,
        missing_fields=agent_result.missing_fields,
    )
    session.turns.append(ConversationTurn(speaker="agent", text=response_text))

    next_action = _determine_next_action(
        session.medical_state.intent, triage_result.recommend_emergency_care
    )

    return ConversationMessageResponse(
        response_text=response_text,
        medical_state=session.medical_state,
        triage=triage_result,
        next_action=next_action,
    )

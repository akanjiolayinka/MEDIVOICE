from app.schemas.medical import MedicalState
from app.services.agent import medical_extraction
from app.services.agent.intent import normalize_intent
from app.services.agent.llm_client import LLMClient, llm_client
from app.services.agent.models import AgentTurnResult


class ConversationAgent:
    """
    Orchestrates one conversation turn: extraction (medical_extraction.py)
    + intent normalization (intent.py). Response text is intentionally
    NOT decided here — that's response.py, called from the API layer
    after the (independent) triage engine has had a chance to override
    the agent's suggestion.
    """

    def __init__(self, client: LLMClient = llm_client):
        self._client = client

    async def process_turn(self, transcript: str, prior_state: MedicalState) -> AgentTurnResult:
        merged_state, suggested_response, missing_fields = await medical_extraction.extract(
            transcript, prior_state, client=self._client
        )
        merged_state.intent = normalize_intent(merged_state.intent)

        return AgentTurnResult(
            medical_state=merged_state,
            suggested_response=suggested_response,
            missing_fields=missing_fields,
        )


conversation_agent = ConversationAgent()

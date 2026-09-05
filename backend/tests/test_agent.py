import pytest

from app.schemas.medical import MedicalState, TriageResult
from app.services.agent.conversation import ConversationAgent
from app.services.agent.intent import normalize_intent
from app.services.agent.llm_client import LLMClient, AgentNotConfiguredError
from app.services.agent.medical_extraction import merge_medical_state
from app.services.agent.response import compose_response
from app.config.settings import Settings


class FakeLLMClient(LLMClient):
    def __init__(self, canned: dict):
        # Deliberately skip LLMClient.__init__ — this fake never makes a
        # real HTTP call, it just returns pre-set structured output.
        self._canned = canned

    async def extract_structured(self, *, system_prompt: str, user_prompt: str) -> dict:
        return self._canned


@pytest.mark.asyncio
async def test_raises_when_llm_key_missing():
    client = LLMClient(config=Settings(llm_api_key=None, llm_api_url=None))
    with pytest.raises(AgentNotConfiguredError):
        await client.extract_structured(system_prompt="s", user_prompt="u")


def test_merge_preserves_prior_answers():
    prior = MedicalState(symptoms=["Headache"], duration="1 day", temperature="")
    new = MedicalState(symptoms=["Fever"], duration="", temperature="38.7")
    merged = merge_medical_state(prior, new)
    assert merged.symptoms == ["Headache", "Fever"]
    assert merged.duration == "1 day"  # not re-asked / not overwritten by blank
    assert merged.temperature == "38.7"


def test_normalize_intent_unknown_falls_back_to_other():
    assert normalize_intent("describe_symptoms") == "describe_symptoms"
    assert normalize_intent("something_weird") == "other"
    assert normalize_intent("") == "other"


def test_response_overridden_by_emergency_triage():
    triage = TriageResult(
        urgency="emergency",
        red_flags=["seizure"],
        message="Please seek emergency care now.",
        recommend_emergency_care=True,
    )
    text = compose_response(
        triage=triage,
        suggested_response="Can you tell me more?",
        missing_fields=["duration"],
    )
    assert text == "Please seek emergency care now."


def test_response_uses_suggested_text_when_not_emergency():
    triage = TriageResult(urgency="routine", message="not urgent")
    text = compose_response(
        triage=triage, suggested_response="How long has this been going on?", missing_fields=[]
    )
    assert text == "How long has this been going on?"


@pytest.mark.asyncio
async def test_conversation_agent_process_turn_merges_and_normalizes():
    fake_client = FakeLLMClient(
        {
            "symptoms": ["Headache", "Fever"],
            "duration": "1 day",
            "intent": "describe_symptoms",
            "suggested_response": "Have you checked your temperature?",
            "missing_fields": ["temperature"],
        }
    )
    agent = ConversationAgent(client=fake_client)
    result = await agent.process_turn("my head dey pain me", MedicalState())

    assert result.medical_state.symptoms == ["Headache", "Fever"]
    assert result.medical_state.intent == "describe_symptoms"
    assert result.suggested_response == "Have you checked your temperature?"
    assert result.missing_fields == ["temperature"]

from app.schemas.medical import MedicalState
from app.services.agent.models import AgentTurnResult


def test_message_not_configured_by_default(client):
    # No LLM_API_KEY exists in this environment, so this must be the
    # honest outcome — never a fabricated response.
    response = client.post(
        "/api/conversation/message",
        json={"session_id": "convo-test-1", "transcript": "my head dey pain me"},
    )
    assert response.status_code == 503
    body = response.json()
    assert body["error"] == "service_not_configured"
    assert body["service"] == "agent"


def test_message_success_path_with_fake_agent(client, monkeypatch):
    async def fake_process_turn(transcript, prior_state):
        return AgentTurnResult(
            medical_state=MedicalState(
                symptoms=["Headache", "Fever"],
                duration="1 day",
                temperature="38.7",
                intent="describe_symptoms",
            ),
            suggested_response="Have you checked your temperature?",
            missing_fields=["temperature"],
        )

    import app.api.conversation as conversation_module

    monkeypatch.setattr(
        conversation_module.conversation_agent, "process_turn", fake_process_turn
    )

    response = client.post(
        "/api/conversation/message",
        json={"session_id": "convo-test-2", "transcript": "my head dey pain me"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["response_text"] == "Have you checked your temperature?"
    assert body["medical_state"]["symptoms"] == ["Headache", "Fever"]
    assert body["triage"]["urgency"] == "prompt"
    assert body["next_action"] == "continue_conversation"


def test_message_emergency_overrides_agent_response(client, monkeypatch):
    async def fake_process_turn(transcript, prior_state):
        return AgentTurnResult(
            medical_state=MedicalState(
                symptoms=["Seizure"],
                relevant_context="had a seizure a few minutes ago",
            ),
            suggested_response="Can you tell me more about that?",
            missing_fields=[],
        )

    import app.api.conversation as conversation_module

    monkeypatch.setattr(
        conversation_module.conversation_agent, "process_turn", fake_process_turn
    )

    response = client.post(
        "/api/conversation/message",
        json={"session_id": "convo-test-3", "transcript": "I just had a seizure"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["triage"]["urgency"] == "emergency"
    assert body["next_action"] == "seek_emergency_care"
    # The agent's own suggested follow-up question must NOT be used —
    # the safety engine's message wins.
    assert body["response_text"] != "Can you tell me more about that?"


def test_conversation_memory_persists_across_turns(client, monkeypatch):
    calls = []

    async def fake_process_turn(transcript, prior_state):
        calls.append(prior_state.model_copy())
        if len(calls) == 1:
            return AgentTurnResult(
                medical_state=MedicalState(symptoms=["Headache"], duration="1 day"),
                suggested_response="Have you checked your temperature?",
                missing_fields=["temperature"],
            )
        # Real ConversationAgent.process_turn always returns state already
        # merged with prior_state (medical_extraction.extract does this
        # internally) — replicate that contract here.
        merged = prior_state.model_copy(update={"temperature": "38.7"})
        return AgentTurnResult(
            medical_state=merged,
            suggested_response="Thanks, noted.",
            missing_fields=[],
        )

    import app.api.conversation as conversation_module

    monkeypatch.setattr(
        conversation_module.conversation_agent, "process_turn", fake_process_turn
    )

    session_id = "convo-test-memory"
    client.post(
        "/api/conversation/message",
        json={"session_id": session_id, "transcript": "my head dey pain me"},
    )
    second = client.post(
        "/api/conversation/message",
        json={"session_id": session_id, "transcript": "38.7 degrees"},
    )

    # Second call's prior_state must already carry the first turn's symptoms.
    assert calls[1].symptoms == ["Headache"]
    assert second.json()["medical_state"]["duration"] == "1 day"
    assert second.json()["medical_state"]["temperature"] == "38.7"

from app.schemas.medical import MedicalState
from app.services.agent.llm_client import LLMClient, llm_client

SYSTEM_PROMPT = """You are the medical-information extraction layer of \
MediVoice, a voice-first healthcare triage and navigation assistant for \
Nigerian users who often mix English, Nigerian Pidgin, Yoruba, Igbo and \
Hausa in a single conversation. You do NOT diagnose. You extract \
structured information from what the user just said and, when \
information is missing, name what to ask next. Always respond with a \
single JSON object matching this schema (omit nothing, use empty \
strings/lists/null for anything not mentioned in this turn):

{
  "symptoms": string[],
  "duration": string,
  "severity": string,
  "temperature": string,
  "additional_symptoms": string[],
  "red_flags": string[],
  "language_mix": string[],
  "intent": "describe_symptoms" | "answer_followup" | "request_facility_search" | "other",
  "user_age": number | null,
  "relevant_context": string,
  "suggested_response": string,
  "missing_fields": string[]
}
"""


def _build_user_prompt(transcript: str, prior_state: MedicalState) -> str:
    return (
        f"Prior known state (JSON): {prior_state.model_dump_json()}\n\n"
        f"The user just said: \"{transcript}\"\n\n"
        "Extract only what this turn adds or changes; the caller merges it "
        "with the prior state."
    )


def merge_medical_state(prior: MedicalState, new: MedicalState) -> MedicalState:
    """Conversation memory: never drop a previously known answer just
    because this turn's extraction didn't repeat it (master build prompt
    §10 — don't ask for the temperature again once it's answered)."""

    def merge_list(a: list[str], b: list[str]) -> list[str]:
        merged = list(a)
        merged.extend(item for item in b if item not in merged)
        return merged

    return MedicalState(
        symptoms=merge_list(prior.symptoms, new.symptoms),
        duration=new.duration or prior.duration,
        severity=new.severity or prior.severity,
        temperature=new.temperature or prior.temperature,
        additional_symptoms=merge_list(prior.additional_symptoms, new.additional_symptoms),
        red_flags=merge_list(prior.red_flags, new.red_flags),
        language_mix=merge_list(prior.language_mix, new.language_mix),
        intent=new.intent or prior.intent,
        user_age=new.user_age if new.user_age is not None else prior.user_age,
        relevant_context=new.relevant_context or prior.relevant_context,
    )


async def extract(
    transcript: str,
    prior_state: MedicalState,
    client: LLMClient = llm_client,
) -> tuple[MedicalState, str, list[str]]:
    """Returns (merged_medical_state, suggested_response, missing_fields).
    Raises AgentNotConfiguredError (propagated from LLMClient) when no LLM
    key is set — never fabricates an extraction."""

    raw = await client.extract_structured(
        system_prompt=SYSTEM_PROMPT,
        user_prompt=_build_user_prompt(transcript, prior_state),
    )

    new_state = MedicalState.model_validate(raw)
    merged = merge_medical_state(prior_state, new_state)

    suggested_response = raw.get("suggested_response", "") if isinstance(raw, dict) else ""
    missing_fields = raw.get("missing_fields", []) if isinstance(raw, dict) else []

    return merged, suggested_response, missing_fields

KNOWN_INTENTS = {"describe_symptoms", "answer_followup", "request_facility_search"}


def normalize_intent(raw_intent: str) -> str:
    """
    Maps whatever the LLM returned for `intent` onto a small controlled
    vocabulary, so intent accuracy can actually be measured (master build
    prompt §21) against a fixed label set rather than free text.
    """
    candidate = (raw_intent or "").strip().lower()
    return candidate if candidate in KNOWN_INTENTS else "other"

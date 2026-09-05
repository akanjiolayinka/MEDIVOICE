import re

from app.schemas.medical import MedicalState, TriageResult

# Deterministic keyword rules (master build prompt §8). This is
# intentionally NOT the LLM — the agent (Phase 4) may also flag red flags
# in MedicalState.red_flags, but this module independently re-derives them
# from the free-text fields so a single unsafe LLM judgement can never be
# the only thing standing between a user and an emergency-care escalation.
RED_FLAG_KEYWORDS: dict[str, list[str]] = {
    "severe difficulty breathing": [
        "severe difficulty breathing",
        "can't breathe",
        "cannot breathe",
        "struggling to breathe",
        "gasping for air",
    ],
    "severe chest pain": ["severe chest pain", "crushing chest pain"],
    "loss of consciousness": [
        "loss of consciousness",
        "passed out",
        "fainted",
        "unconscious",
    ],
    "severe bleeding": [
        "severe bleeding",
        "heavy bleeding",
        "bleeding a lot",
        "won't stop bleeding",
        "wont stop bleeding",
    ],
    "seizure": ["seizure", "convulsion", "convulsing"],
    "sudden severe neurological symptoms": [
        "can't speak",
        "cannot speak",
        "face drooping",
        "one side weak",
        "sudden weakness",
        "slurred speech",
        "worst headache of my life",
    ],
}


def detect_red_flags(state: MedicalState) -> list[str]:
    haystack = " ".join(
        [*state.symptoms, *state.additional_symptoms, state.relevant_context, state.severity]
    ).lower()

    detected = [
        flag
        for flag, keywords in RED_FLAG_KEYWORDS.items()
        if any(keyword in haystack for keyword in keywords)
    ]

    for flag in state.red_flags:
        if flag not in detected:
            detected.append(flag)

    return detected


def _has_notable_temperature(temperature: str) -> bool:
    match = re.search(r"(\d+(\.\d+)?)", temperature)
    if not match:
        return False
    return float(match.group(1)) >= 38.0


def assess(state: MedicalState) -> TriageResult:
    """
    Never a diagnosis: only an urgency level and a next-step message. Red
    flags always win regardless of anything else in the state.
    """
    red_flags = detect_red_flags(state)
    if red_flags:
        return TriageResult(
            urgency="emergency",
            red_flags=red_flags,
            message=(
                "What you're describing may need urgent medical attention. "
                "Please seek emergency care now or have someone take you to "
                "the nearest emergency facility."
            ),
            recommend_emergency_care=True,
        )

    symptom_count = len(state.symptoms) + len(state.additional_symptoms)
    if symptom_count >= 2 or _has_notable_temperature(state.temperature):
        return TriageResult(
            urgency="prompt",
            message="Your symptoms would be worth discussing with a healthcare professional soon.",
        )

    return TriageResult(
        urgency="routine",
        message=(
            "Nothing described so far looks urgent, but keep an eye on how "
            "you feel and reach out to a healthcare professional if things "
            "change or don't improve."
        ),
    )

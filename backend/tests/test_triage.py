from app.schemas.medical import MedicalState
from app.services.triage.rules import assess, detect_red_flags


def test_routine_case_no_symptoms():
    result = assess(MedicalState())
    assert result.urgency == "routine"
    assert result.red_flags == []
    assert result.recommend_emergency_care is False


def test_prompt_case_multiple_symptoms():
    state = MedicalState(
        symptoms=["Headache", "Fever"],
        additional_symptoms=["Weakness"],
        temperature="38.7",
    )
    result = assess(state)
    assert result.urgency == "prompt"
    assert result.recommend_emergency_care is False


def test_emergency_case_red_flag_keyword():
    state = MedicalState(
        symptoms=["Chest pain"],
        additional_symptoms=[],
        relevant_context="I have severe chest pain and can't breathe properly.",
    )
    result = assess(state)
    assert result.urgency == "emergency"
    assert result.recommend_emergency_care is True
    assert "severe chest pain" in result.red_flags
    assert "severe difficulty breathing" in result.red_flags


def test_red_flags_override_low_symptom_count():
    # Only one symptom logged, but a seizure mention must still escalate.
    state = MedicalState(symptoms=["Seizure"], relevant_context="had a seizure just now")
    result = assess(state)
    assert result.urgency == "emergency"
    assert "seizure" in result.red_flags


def test_agent_reported_red_flag_is_surfaced():
    state = MedicalState(red_flags=["patient reports loss of consciousness"])
    detected = detect_red_flags(state)
    assert "patient reports loss of consciousness" in detected


def test_high_temperature_alone_triggers_prompt():
    state = MedicalState(temperature="39.2°C")
    result = assess(state)
    assert result.urgency == "prompt"

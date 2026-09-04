import type { DemoFixture, MedicalState } from "@/lib/types";

// Fixture — pipeline replay data for Demo Mode.
//
// The transcript and medicalState/agentReply fields below are NOT live
// Sahara/agent output: no real Sahara or LLM credentials exist in this
// environment yet (see backend/app/services/sahara/client.py and
// backend/app/services/agent/llm_client.py). medicalState is hand-authored
// to represent what the real agent (Phase 4) would plausibly have
// extracted from each scripted transcript. Selecting a fixture on /app
// sends that medicalState to the REAL /api/triage/assess endpoint
// (Phase 6 — deterministic, needs no credentials), so the triage result
// shown for a demo scenario is genuinely computed by the backend, not
// fabricated on the frontend. The UI keeps a persistent "Fixture —
// pipeline replay" badge visible throughout, per the master build
// prompt's rule #36 exception for explicitly labeled fixtures.
//
// NOTE: the Yoruba/Igbo/Hausa phrases below are illustrative code-switched
// samples, not verified by a native speaker. Get a native-speaker accuracy
// review before using these beyond an internal demo.

function medicalState(partial: Partial<MedicalState>): MedicalState {
  return {
    symptoms: [],
    duration: "",
    severity: "",
    temperature: "",
    additional_symptoms: [],
    red_flags: [],
    language_mix: [],
    intent: "describe_symptoms",
    user_age: null,
    relevant_context: "",
    ...partial,
  };
}

export const demoFixtures: DemoFixture[] = [
  {
    id: "english-pidgin",
    title: "English + Pidgin — Headache & fever",
    languages: ["English", "Nigerian Pidgin"],
    result: {
      transcript:
        "My head dey pain me since yesterday, and my body dey hot. I also dey feel weak.",
      languages: ["en", "pcm"],
      confidence: 0.91,
    },
    medicalState: medicalState({
      symptoms: ["Headache", "Fever", "Weakness"],
      duration: "1 day",
      temperature: "38.7°C",
      additional_symptoms: ["Vomiting (once)"],
      language_mix: ["English", "Nigerian Pidgin"],
      relevant_context:
        "Reported vomiting once this morning; no chest pain; breathing normally.",
    }),
    agentReply:
      "Your symptoms would be worth discussing with a healthcare professional soon. Would you like me to help you find a healthcare facility nearby?",
  },
  {
    id: "english-yoruba",
    title: "English + Yoruba — Weakness & dizziness",
    languages: ["English", "Yoruba"],
    result: {
      transcript:
        "I've been feeling weak since morning, mo si n feel dizzy anytime mo ba duro.",
      languages: ["en", "yo"],
      confidence: 0.88,
    },
    medicalState: medicalState({
      symptoms: ["Weakness", "Postural dizziness"],
      duration: "Since this morning",
      additional_symptoms: ["Low food/fluid intake"],
      language_mix: ["English", "Yoruba"],
      relevant_context:
        "No fainting or chest pain reported; occasional visual heaviness.",
    }),
    agentReply:
      "This looks like it could be related to low food and fluid intake, but it's best to be safe. Would you like a consultation summary, or help finding a facility nearby?",
  },
  {
    id: "english-igbo",
    title: "English + Igbo — Sample consultation",
    languages: ["English", "Igbo"],
    result: {
      transcript:
        "Afo na-eme m nsogbu since last night, and I've vomited twice this morning.",
      languages: ["en", "ig"],
      confidence: 0.85,
    },
    medicalState: medicalState({
      symptoms: ["Abdominal pain", "Vomiting"],
      duration: "Since last night",
      additional_symptoms: ["Vomited twice"],
      language_mix: ["English", "Igbo"],
      relevant_context: "No fever reported yet; monitoring for dehydration.",
    }),
    agentReply:
      "Abdominal pain with repeated vomiting is worth having checked. Have you been able to keep any fluids down?",
  },
  {
    id: "english-hausa",
    title: "English + Hausa — Sample consultation",
    languages: ["English", "Hausa"],
    result: {
      transcript:
        "Ina jin zafi a kirji since yesterday, and I've been coughing a lot too.",
      languages: ["en", "ha"],
      confidence: 0.83,
    },
    medicalState: medicalState({
      symptoms: ["Chest discomfort", "Cough"],
      duration: "Since yesterday",
      additional_symptoms: ["Persistent cough"],
      language_mix: ["English", "Hausa"],
      relevant_context: "No severe breathing difficulty reported; cough ongoing.",
    }),
    agentReply:
      "Chest discomfort with a persistent cough is worth a professional check, even without severe breathing trouble. Would you like help finding a nearby clinic?",
  },
];

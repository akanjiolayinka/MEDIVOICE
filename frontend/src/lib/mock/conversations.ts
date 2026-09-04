import type { MedicalState } from "@/lib/types";

export interface ConversationTurn {
  speaker: "user" | "agent";
  text: string;
  /** ISO language codes detected for this turn (user turns only). */
  detectedLanguages?: string[];
  /** Marks the turn where the safety engine takes over (demo only). */
  isRedFlag?: boolean;
}

export interface ConversationScenario {
  id: string;
  title: string;
  description: string;
  languages: string[];
  turns: ConversationTurn[];
  /** Hand-authored final state fed to the mock triage service (Phase 6
   * equivalent) once the scripted conversation ends. */
  medicalState: MedicalState;
}

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

// Demo Mode scenarios (master build prompt §32). These are MOCK
// conversations — no audio, no real speech recognition, no real language
// model. Language mixing is illustrative and has not been reviewed by a
// native speaker; get that review before using these beyond a demo.
export const conversationScenarios: ConversationScenario[] = [
  {
    id: "pidgin-fever",
    title: "English + Pidgin",
    description: "Fever, headache and body weakness",
    languages: ["English", "Nigerian Pidgin"],
    turns: [
      { speaker: "user", text: "My body dey hot and I dey weak.", detectedLanguages: ["en", "pcm"] },
      { speaker: "agent", text: "I understand. How long have you been feeling this way?" },
      { speaker: "user", text: "Since yesterday.", detectedLanguages: ["en"] },
      { speaker: "agent", text: "Have you checked your temperature?" },
      { speaker: "user", text: "Yes, e dey around 38.5.", detectedLanguages: ["en", "pcm"] },
      {
        speaker: "agent",
        text: "Thank you. Are you experiencing any difficulty breathing, severe chest pain, fainting, or heavy bleeding?",
      },
      { speaker: "user", text: "No, none of that.", detectedLanguages: ["en"] },
      {
        speaker: "agent",
        text: "Thank you for sharing that. Based on what you've told me, I'd recommend having this checked by a healthcare professional soon.",
      },
    ],
    medicalState: medicalState({
      symptoms: ["Fever", "Weakness", "Headache"],
      duration: "1 day",
      severity: "Moderate",
      temperature: "38.5°C",
      language_mix: ["English", "Nigerian Pidgin"],
      relevant_context: "No breathing difficulty, chest pain, fainting, or bleeding reported.",
    }),
  },
  {
    id: "yoruba-weakness",
    title: "English + Yoruba",
    description: "Weakness and dizziness since morning",
    languages: ["English", "Yoruba"],
    turns: [
      {
        speaker: "user",
        text: "Mo ni weakness since this morning, and I dey feel dizzy.",
        detectedLanguages: ["en", "yo"],
      },
      { speaker: "agent", text: "I'm sorry to hear that. How long has this been going on?" },
      { speaker: "user", text: "Since morning today.", detectedLanguages: ["en"] },
      { speaker: "agent", text: "Have you eaten or had enough water today?" },
      {
        speaker: "user",
        text: "Mi o jeun much, and I no drink plenty water.",
        detectedLanguages: ["en", "yo"],
      },
      { speaker: "agent", text: "Thank you. Any fainting, chest pain, or blurred vision?" },
      {
        speaker: "user",
        text: "No fainting, but oju mi maa n wuwo sometimes.",
        detectedLanguages: ["en", "yo"],
      },
      {
        speaker: "agent",
        text: "This looks like it could be related to low food and fluid intake, but it's worth keeping an eye on. Rehydrating and eating something light is a good next step.",
      },
    ],
    medicalState: medicalState({
      symptoms: ["Weakness", "Dizziness"],
      duration: "Since this morning",
      severity: "Mild to moderate",
      additional_symptoms: ["Low food/fluid intake", "Occasional visual heaviness"],
      language_mix: ["English", "Yoruba"],
      relevant_context: "No fainting or chest pain reported.",
    }),
  },
  {
    id: "mixed-headache",
    title: "English + Pidgin + Yoruba",
    description: "Headache with mixed-language code-switching",
    languages: ["English", "Nigerian Pidgin", "Yoruba"],
    turns: [
      {
        speaker: "user",
        text: "My head dey pain me since yesterday, and mo tun feel weak.",
        detectedLanguages: ["en", "pcm", "yo"],
      },
      { speaker: "agent", text: "I understand. Have you noticed any fever or changes in body temperature?" },
      { speaker: "user", text: "Yes o, my body dey hot small small.", detectedLanguages: ["en", "pcm"] },
      { speaker: "agent", text: "Have you been able to take your temperature?" },
      { speaker: "user", text: "No, I never check am.", detectedLanguages: ["en", "pcm"] },
      { speaker: "agent", text: "That's okay. Any chest pain, breathing difficulty, or fainting?" },
      { speaker: "user", text: "No, nothing like that.", detectedLanguages: ["en"] },
      {
        speaker: "agent",
        text: "Thank you for walking me through that. It would be worth monitoring your temperature and speaking with a healthcare professional if things don't improve.",
      },
    ],
    medicalState: medicalState({
      symptoms: ["Headache", "Weakness"],
      duration: "1 day",
      severity: "Mild to moderate",
      additional_symptoms: ["Mild fever sensation (unmeasured)"],
      language_mix: ["English", "Nigerian Pidgin", "Yoruba"],
      relevant_context: "Temperature not yet measured; no chest pain, breathing difficulty, or fainting.",
    }),
  },
  {
    id: "emergency-chest-pain",
    title: "Emergency example",
    description: "Severe chest pain — demonstrates red-flag handling",
    languages: ["English", "Nigerian Pidgin"],
    turns: [
      {
        speaker: "user",
        text: "I dey feel serious chest pain and I dey find it hard to breathe.",
        detectedLanguages: ["en", "pcm"],
      },
      { speaker: "agent", text: "I'm sorry you're going through this. When did this start?" },
      { speaker: "user", text: "Just now, a few minutes ago.", detectedLanguages: ["en"] },
      {
        speaker: "agent",
        text: "What you're describing may need urgent medical attention. Please seek emergency care now or have someone take you to the nearest emergency facility.",
        isRedFlag: true,
      },
    ],
    medicalState: medicalState({
      symptoms: ["Severe chest pain", "Difficulty breathing"],
      duration: "A few minutes",
      severity: "Severe",
      red_flags: ["severe chest pain", "severe difficulty breathing"],
      language_mix: ["English", "Nigerian Pidgin"],
      relevant_context: "Sudden onset, ongoing at time of conversation.",
    }),
  },
];

export function getScenarioById(id: string): ConversationScenario | undefined {
  return conversationScenarios.find((scenario) => scenario.id === id);
}

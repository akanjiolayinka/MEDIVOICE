import { delay } from "@/lib/mock/delay";
import type { MedicalState, TriageResult } from "@/lib/types";

/**
 * FEATURE: Safety/triage assessment.
 * CURRENT: mock — a client-side port of the SAME deterministic keyword
 * rules as the real backend engine (backend/app/services/triage/rules.py),
 * kept in sync on purpose so this mock behaves like the eventual real
 * thing, not just a placeholder.
 * FUTURE: replace with a real call to POST /api/triage/assess.
 */

const RED_FLAG_KEYWORDS: Record<string, string[]> = {
  "severe difficulty breathing": [
    "severe difficulty breathing",
    "hard to breathe",
    "can't breathe",
    "cannot breathe",
    "struggling to breathe",
    "gasping for air",
  ],
  "severe chest pain": ["severe chest pain", "crushing chest pain"],
  "loss of consciousness": ["loss of consciousness", "passed out", "fainted", "unconscious"],
  "severe bleeding": ["severe bleeding", "heavy bleeding", "bleeding a lot"],
  seizure: ["seizure", "convulsion", "convulsing"],
  "sudden severe neurological symptoms": [
    "can't speak",
    "cannot speak",
    "face drooping",
    "one side weak",
    "sudden weakness",
    "slurred speech",
    "worst headache of my life",
  ],
};

function detectRedFlags(state: MedicalState): string[] {
  const haystack = [
    ...state.symptoms,
    ...state.additional_symptoms,
    state.relevant_context,
    state.severity,
  ]
    .join(" ")
    .toLowerCase();

  const detected = Object.entries(RED_FLAG_KEYWORDS)
    .filter(([, keywords]) => keywords.some((keyword) => haystack.includes(keyword)))
    .map(([flag]) => flag);

  for (const flag of state.red_flags) {
    if (!detected.includes(flag)) detected.push(flag);
  }

  return detected;
}

function hasNotableTemperature(temperature: string): boolean {
  const match = temperature.match(/(\d+(\.\d+)?)/);
  if (!match) return false;
  return parseFloat(match[1]) >= 38.0;
}

export async function mockAssessTriage(state: MedicalState): Promise<TriageResult> {
  await delay(400);

  const redFlags = detectRedFlags(state);
  if (redFlags.length > 0) {
    return {
      urgency: "emergency",
      red_flags: redFlags,
      message:
        "What you're describing may need urgent medical attention. Please seek emergency care now or have someone take you to the nearest emergency facility.",
      recommend_emergency_care: true,
    };
  }

  const symptomCount = state.symptoms.length + state.additional_symptoms.length;
  if (symptomCount >= 2 || hasNotableTemperature(state.temperature)) {
    return {
      urgency: "prompt",
      red_flags: [],
      message: "Your symptoms would be worth discussing with a healthcare professional soon.",
      recommend_emergency_care: false,
    };
  }

  return {
    urgency: "routine",
    red_flags: [],
    message:
      "Nothing described so far looks urgent, but keep an eye on how you feel and reach out to a healthcare professional if things change or don't improve.",
    recommend_emergency_care: false,
  };
}

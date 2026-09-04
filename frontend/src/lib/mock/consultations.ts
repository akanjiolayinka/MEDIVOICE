import type { ConversationScenario, ConversationTurn } from "@/lib/mock/conversations";
import type { TriageResult, Urgency } from "@/lib/types";

export interface ConsultationRecord {
  id: string;
  date: string; // ISO timestamp
  mainConcern: string;
  languages: string[];
  symptoms: string[];
  additionalSymptoms: string[];
  duration: string;
  severity: string;
  temperature?: string;
  triageUrgency: Urgency;
  triageMessage: string;
  redFlags: string[];
  status: "completed" | "in_progress";
  conversationNotes: string;
  turns: ConversationTurn[];
}

const STORAGE_KEY = "medivoice_mock_consultations";

// Seed history (master build prompt §8/§19) — always present so the
// dashboard and history page never show an empty product on first visit.
const seedConsultations: ConsultationRecord[] = [
  {
    id: "seed-1",
    date: new Date().toISOString(),
    mainConcern: "Fever, headache and body weakness",
    languages: ["English", "Nigerian Pidgin"],
    symptoms: ["Fever", "Headache", "Weakness"],
    additionalSymptoms: [],
    duration: "1 day",
    severity: "Moderate",
    temperature: "38.5°C",
    triageUrgency: "prompt",
    triageMessage: "Your symptoms would be worth discussing with a healthcare professional soon.",
    redFlags: [],
    status: "completed",
    conversationNotes:
      "Reported fever, headache and weakness since yesterday, temperature 38.5°C. No breathing difficulty, chest pain, fainting, or bleeding reported.",
    turns: [],
  },
  {
    id: "seed-2",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    mainConcern: "Weakness and dizziness",
    languages: ["English", "Yoruba"],
    symptoms: ["Weakness", "Dizziness"],
    additionalSymptoms: ["Low food/fluid intake"],
    duration: "Since morning",
    severity: "Mild to moderate",
    triageUrgency: "prompt",
    triageMessage: "Your symptoms would be worth discussing with a healthcare professional soon.",
    redFlags: [],
    status: "completed",
    conversationNotes:
      "Reported weakness and dizziness since morning, linked to low food and fluid intake. No fainting or chest pain reported.",
    turns: [],
  },
  {
    id: "seed-3",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
    mainConcern: "Mild cough and sore throat",
    languages: ["English"],
    symptoms: ["Cough", "Sore throat"],
    additionalSymptoms: [],
    duration: "2 days",
    severity: "Mild",
    triageUrgency: "routine",
    triageMessage:
      "Nothing described so far looks urgent, but keep an eye on how you feel and reach out to a healthcare professional if things change or don't improve.",
    redFlags: [],
    status: "completed",
    conversationNotes: "Reported mild cough and sore throat for two days, no fever reported.",
    turns: [],
  },
];

function readStoredConsultations(): ConsultationRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConsultationRecord[]) : [];
  } catch {
    return [];
  }
}

function writeStoredConsultations(records: ConsultationRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

/** All consultations, newest first: seed data plus anything created this session. */
export function getAllConsultations(): ConsultationRecord[] {
  const stored = readStoredConsultations();
  return [...stored, ...seedConsultations].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getConsultationById(id: string): ConsultationRecord | undefined {
  return getAllConsultations().find((record) => record.id === id);
}

export function addConsultation(record: ConsultationRecord): void {
  const stored = readStoredConsultations();
  writeStoredConsultations([record, ...stored]);
}

export function buildConsultationRecordFromScenario(
  scenario: ConversationScenario,
  turns: ConversationTurn[],
  triage: TriageResult,
): ConsultationRecord {
  const { medicalState } = scenario;
  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    mainConcern: medicalState.symptoms[0]
      ? [medicalState.symptoms[0], ...medicalState.symptoms.slice(1, 2)].join(" and ").toLowerCase()
      : scenario.description.toLowerCase(),
    languages: scenario.languages,
    symptoms: medicalState.symptoms,
    additionalSymptoms: medicalState.additional_symptoms,
    duration: medicalState.duration || "Not specified",
    severity: medicalState.severity || "Not specified",
    temperature: medicalState.temperature || undefined,
    triageUrgency: triage.urgency,
    triageMessage: triage.message,
    redFlags: triage.red_flags,
    status: "completed",
    conversationNotes: medicalState.relevant_context,
    turns,
  };
}

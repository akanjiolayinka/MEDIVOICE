// Shared pipeline contract types. These mirror the REAL backend schemas in
// backend/app/schemas/*.py exactly on purpose (master build prompt: "the
// interfaces should already match the eventual architecture") — the mock
// services in services/mock*.ts return data shaped like this, so swapping
// a mock service for a real fetch() against the FastAPI backend later is a
// near drop-in replacement, not a rewrite.
//
// During this mock-only product phase, nothing here is sent over the
// network — see services/mock*.ts and lib/mock/*.ts for the actual mock
// implementations. lib/api.ts (the real fetch client built in an earlier
// phase) is left in place, unused, as the reference for wiring these
// contracts up for real later.

// Mirrors backend/app/schemas/voice.py::VoiceProcessResponse.
export interface SaharaResult {
  transcript: string;
  languages: string[];
  confidence: number;
}

// Mirrors backend/app/schemas/medical.py::MedicalState.
export interface MedicalState {
  symptoms: string[];
  duration: string;
  severity: string;
  temperature: string;
  additional_symptoms: string[];
  red_flags: string[];
  language_mix: string[];
  intent: string;
  user_age: number | null;
  relevant_context: string;
}

export type Urgency = "routine" | "prompt" | "emergency";

// Mirrors backend/app/schemas/medical.py::TriageResult.
export interface TriageResult {
  urgency: Urgency;
  red_flags: string[];
  message: string;
  recommend_emergency_care: boolean;
}

// Mirrors backend/app/schemas/conversation.py::ConversationMessageResponse.
export interface ConversationMessageResult {
  response_text: string;
  medical_state: MedicalState;
  triage: TriageResult;
  next_action: string;
}

// Structured error the backend returns when a downstream service (Sahara,
// the agent, later YarnGPT/facilities) has no credentials configured.
export interface ServiceNotConfiguredError {
  error: "service_not_configured";
  service: string;
  message: string;
}

export type VoiceProcessOutcome =
  | { kind: "transcribed"; result: SaharaResult }
  | { kind: "not_configured"; error: ServiceNotConfiguredError }
  | { kind: "error"; message: string };

export type ConversationMessageOutcome =
  | { kind: "assessed"; result: ConversationMessageResult }
  | { kind: "not_configured"; error: ServiceNotConfiguredError }
  | { kind: "error"; message: string };

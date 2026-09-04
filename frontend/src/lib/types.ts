// Shape returned by a successful /api/voice/process call once Sahara is
// actually configured. Mirrors backend/app/schemas/voice.py::VoiceProcessResponse.
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

export type ConversationPhase =
  | "idle"
  | "recording"
  | "uploading"
  | "assessing"
  | "assessed"
  | "not_configured"
  | "error";

export interface DemoFixture {
  id: string;
  title: string;
  languages: string[];
  result: SaharaResult;
  // Fixture — pipeline replay: hand-authored, labeled data representing
  // what the real agent (Phase 4) would have extracted from this scripted
  // transcript. Sent to the REAL /api/triage/assess endpoint (Phase 6,
  // which needs no credentials) so the triage outcome shown for a demo
  // scenario is genuinely computed, not fabricated — only the
  // transcript/medicalState inputs are fixtures.
  medicalState: MedicalState;
  agentReply: string;
}

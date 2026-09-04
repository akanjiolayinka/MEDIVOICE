// Shape returned by a successful /api/voice/process call once Sahara is
// actually configured. Mirrors backend/app/schemas/voice.py::VoiceProcessResponse.
export interface SaharaResult {
  transcript: string;
  languages: string[];
  confidence: number;
}

// Structured error the backend returns when a downstream service (Sahara,
// later YarnGPT/agent/etc.) has no credentials configured.
export interface ServiceNotConfiguredError {
  error: "service_not_configured";
  service: string;
  message: string;
}

export type VoiceProcessOutcome =
  | { kind: "transcribed"; result: SaharaResult }
  | { kind: "not_configured"; error: ServiceNotConfiguredError }
  | { kind: "error"; message: string };

export type ConversationPhase =
  | "idle"
  | "recording"
  | "uploading"
  | "transcribed"
  | "not_configured"
  | "error";

export interface DemoFixture {
  id: string;
  title: string;
  languages: string[];
  result: SaharaResult;
}

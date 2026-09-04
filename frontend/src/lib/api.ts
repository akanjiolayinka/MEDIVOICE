import type {
  ConversationMessageOutcome,
  MedicalState,
  TriageResult,
  VoiceProcessOutcome,
} from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

/**
 * Uploads a real recorded audio Blob to the backend, which forwards it to
 * Sahara. Never returns a fabricated transcript on the frontend — every
 * outcome here reflects what the backend actually reported.
 */
export async function uploadVoice(
  sessionId: string,
  audio: Blob,
): Promise<VoiceProcessOutcome> {
  const formData = new FormData();
  formData.append("session_id", sessionId);
  formData.append("file", audio, "recording.webm");

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/voice/process`, {
      method: "POST",
      body: formData,
    });
  } catch {
    return {
      kind: "error",
      message:
        "We couldn't reach MediVoice's servers. Check your connection and try again.",
    };
  }

  if (response.status === 503) {
    const body = await response.json();
    return { kind: "not_configured", error: body };
  }

  if (!response.ok) {
    return {
      kind: "error",
      message: "We couldn't process that recording. Please try speaking again.",
    };
  }

  const result = await response.json();
  return { kind: "transcribed", result };
}

/**
 * Sends a transcript into the real conversation agent (Phase 4/5/6/8).
 * Honestly reports "not configured" when no LLM key exists rather than
 * fabricating a response — same pattern as uploadVoice/Sahara.
 */
export async function sendMessage(
  sessionId: string,
  transcript: string,
): Promise<ConversationMessageOutcome> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/conversation/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, transcript }),
    });
  } catch {
    return {
      kind: "error",
      message:
        "We couldn't reach MediVoice's servers. Check your connection and try again.",
    };
  }

  if (response.status === 503) {
    const body = await response.json();
    return { kind: "not_configured", error: body };
  }

  if (!response.ok) {
    return {
      kind: "error",
      message: "We couldn't process that response. Please try again.",
    };
  }

  const result = await response.json();
  return { kind: "assessed", result };
}

/**
 * Runs the REAL, deterministic triage engine (Phase 6 — needs no
 * credentials) against a given MedicalState. Used directly by Demo Mode:
 * the transcript/medicalState fed in are a labeled fixture, but the
 * triage result that comes back is genuinely computed by the backend, not
 * fabricated on the frontend.
 */
export async function assessTriage(
  medicalState: MedicalState,
): Promise<TriageResult> {
  const response = await fetch(`${API_BASE_URL}/api/triage/assess`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(medicalState),
  });
  return response.json();
}

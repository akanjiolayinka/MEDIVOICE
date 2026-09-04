import type { VoiceProcessOutcome } from "@/lib/types";

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

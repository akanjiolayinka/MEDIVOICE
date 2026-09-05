import { randomDelay } from "@/lib/mock/delay";
import type { ConversationTurn } from "@/lib/mock/conversations";

export interface MockTranscriptionResult {
  transcript: string;
  detectedLanguages: string[]; // ISO-ish codes, e.g. ["en", "pcm"]
}

/**
 * FEATURE: Voice input transcription.
 * CURRENT: mock — returns the active demo scenario's next scripted line
 * after a simulated processing delay. Ignores what was actually recorded;
 * this is a scripted product simulation, not real speech recognition.
 * FUTURE: replace with a real call to POST /api/voice/process (Sahara),
 * see backend/app/services/sahara/client.py and frontend/src/lib/api.ts.
 */
export async function mockTranscribe(turn: ConversationTurn): Promise<MockTranscriptionResult> {
  await randomDelay(900, 1400);
  return {
    transcript: turn.text,
    detectedLanguages: turn.detectedLanguages ?? ["en"],
  };
}

export const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  pcm: "Nigerian Pidgin",
  yo: "Yoruba",
  ig: "Igbo",
  ha: "Hausa",
};

/**
 * FEATURE: Voice output (speaking MediVoice's responses aloud).
 * CURRENT: mock — uses the browser's built-in Web Speech API
 * (SpeechSynthesis) as a stand-in voice. This is real audio playback, not
 * a fabricated "playing" animation, but it is NOT YarnGPT's voice and
 * does not speak Yoruba/Igbo/Hausa the way YarnGPT would — it's simply
 * the closest honest approximation available without real credentials.
 * FUTURE: replace with a real call to YarnGPT (backend/app/services/yarngpt/,
 * currently a Phase 7 stub) and play back the returned audio.
 */

export interface SpeakOptions {
  rate?: number; // 0.75 - 1.25, mirrors VoicePreferences.speakingSpeed
}

export function speakMock(text: string, options: SpeakOptions = {}): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate ?? 1;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeakingMock(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function isVoiceOutputSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

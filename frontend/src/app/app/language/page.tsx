"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";
import { useAuth } from "@/components/auth/AuthProvider";
import type { VoicePreferences } from "@/lib/mock/user";

const LANGUAGES = ["English", "Nigerian Pidgin", "Yoruba", "Igbo", "Hausa"];
const VOICES: { value: VoicePreferences["voice"]; label: string }[] = [
  { value: "warm-female", label: "Warm (female)" },
  { value: "calm-male", label: "Calm (male)" },
  { value: "neutral", label: "Neutral" },
];

export default function LanguagePage() {
  const { user, updateUser } = useAuth();
  const [savedFlash, setSavedFlash] = useState(false);

  if (!user) return null;

  const flashSaved = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1200);
  };

  const setVoicePref = (partial: Partial<VoicePreferences>) => {
    updateUser({ voicePreferences: { ...user.voicePreferences, ...partial } });
    flashSaved();
  };

  return (
    <Container className="max-w-2xl py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Language &amp; Voice</h1>
        {savedFlash && <span className="text-xs font-medium text-primary-700">Saved</span>}
      </div>
      <p className="mt-1 text-sm text-muted-500">
        MediVoice is designed to understand natural switching between supported languages.
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold">Preferred language</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => {
                updateUser({ preferredLanguage: lang });
                flashSaved();
              }}
              className={`rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors ${
                user.preferredLanguage === lang
                  ? "border-primary-600 bg-primary-50 text-primary-700"
                  : "border-muted-200 text-muted-500 hover:border-primary-200"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-muted-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Code-switching enabled</h2>
            <p className="mt-1 text-sm text-muted-500">
              MediVoice is designed to understand natural switching between supported languages
              — like moving between English and Pidgin in the same sentence.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={user.codeSwitchingEnabled}
            onClick={() => {
              updateUser({ codeSwitchingEnabled: !user.codeSwitchingEnabled });
              flashSaved();
            }}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              user.codeSwitchingEnabled ? "bg-primary-600" : "bg-muted-200"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                user.codeSwitchingEnabled ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold">Voice output</h2>
        <div className="mt-3 space-y-4 rounded-2xl border border-muted-200 bg-white p-5">
          <div>
            <label htmlFor="voice" className="mb-1.5 block text-sm font-medium">
              Voice
            </label>
            <select
              id="voice"
              value={user.voicePreferences.voice}
              onChange={(e) => setVoicePref({ voice: e.target.value as VoicePreferences["voice"] })}
              className="w-full rounded-xl border border-muted-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100 sm:w-64"
            >
              {VOICES.map((voice) => (
                <option key={voice.value} value={voice.value}>
                  {voice.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="speed" className="mb-1.5 block text-sm font-medium">
              Speaking speed: {user.voicePreferences.speakingSpeed.toFixed(2)}x
            </label>
            <input
              id="speed"
              type="range"
              min={0.75}
              max={1.25}
              step={0.05}
              value={user.voicePreferences.speakingSpeed}
              onChange={(e) => setVoicePref({ speakingSpeed: parseFloat(e.target.value) })}
              className="w-full sm:w-64"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={user.voicePreferences.autoPlayResponses}
              onChange={(e) => setVoicePref({ autoPlayResponses: e.target.checked })}
              className="h-4 w-4 rounded border-muted-200 text-primary-600 focus:ring-primary-100"
            />
            Auto-play MediVoice&rsquo;s spoken responses
          </label>
        </div>
      </section>
    </Container>
  );
}

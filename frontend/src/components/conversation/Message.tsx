"use client";

import LanguageChips from "@/components/ui/LanguageChips";
import { PlayIcon } from "@/components/icons";
import { speakMock } from "@/services/mockVoiceOutputService";

export interface DisplayMessage {
  id: string;
  speaker: "user" | "agent";
  text: string;
  languages?: string[]; // human-readable names, e.g. ["English", "Nigerian Pidgin"]
  timestamp: string; // ISO
  isRedFlag?: boolean;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export default function Message({ message }: { message: DisplayMessage }) {
  const isUser = message.speaker === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-md ${
          isUser
            ? "bg-primary-600 text-white"
            : message.isRedFlag
              ? "border border-red-200 bg-red-50 text-foreground"
              : "border border-muted-200 bg-white text-foreground"
        }`}
      >
        <p className="text-xs font-medium opacity-70">{isUser ? "You" : "MediVoice"}</p>
        <p className="mt-1 text-sm leading-relaxed">{message.text}</p>

        {isUser && message.languages && message.languages.length > 0 && (
          <LanguageChips languages={message.languages} className="mt-2" />
        )}

        <div className="mt-2 flex items-center justify-between gap-3">
          <span className={`text-[11px] ${isUser ? "text-white/70" : "text-muted-500"}`}>
            {formatTime(message.timestamp)}
          </span>
          {!isUser && (
            <button
              type="button"
              onClick={() => speakMock(message.text)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-primary-700 hover:text-primary-900"
              aria-label="Play this response"
            >
              <PlayIcon className="h-3 w-3" /> Play
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

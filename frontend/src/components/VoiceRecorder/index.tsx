"use client";

import { useRef, useState } from "react";
import {
  startRecording,
  MicPermissionDeniedError,
  MicUnavailableError,
  type ActiveRecording,
} from "@/lib/audio";

interface VoiceRecorderProps {
  disabled?: boolean;
  onRecorded: (blob: Blob) => void;
  onPermissionDenied: () => void;
  onUnavailable: (message: string) => void;
}

export default function VoiceRecorder({
  disabled = false,
  onRecorded,
  onPermissionDenied,
  onUnavailable,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const activeRecording = useRef<ActiveRecording | null>(null);

  const handlePress = async () => {
    if (disabled || isRecording) return;
    try {
      activeRecording.current = await startRecording();
      setIsRecording(true);
    } catch (err) {
      if (err instanceof MicPermissionDeniedError) {
        onPermissionDenied();
      } else if (err instanceof MicUnavailableError) {
        onUnavailable(err.message);
      }
    }
  };

  const handleRelease = async () => {
    if (!activeRecording.current) return;
    const recording = activeRecording.current;
    activeRecording.current = null;
    setIsRecording(false);
    const blob = await recording.stop();
    onRecorded(blob);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        disabled={disabled}
        aria-pressed={isRecording}
        aria-label="Hold to speak"
        onMouseDown={handlePress}
        onMouseUp={handleRelease}
        onMouseLeave={() => {
          if (isRecording) handleRelease();
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          handlePress();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          handleRelease();
        }}
        className={`flex h-20 w-20 items-center justify-center rounded-full text-white transition-all disabled:opacity-40 ${
          isRecording
            ? "scale-110 bg-primary-700 shadow-lg"
            : "bg-primary-600 hover:bg-primary-700"
        }`}
      >
        <MicIcon />
      </button>
      <p className="text-sm text-muted-500">
        {isRecording ? "Listening…" : "Hold to speak"}
      </p>
    </div>
  );
}

function MicIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

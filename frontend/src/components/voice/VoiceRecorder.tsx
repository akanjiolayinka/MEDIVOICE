"use client";

import { useEffect, useRef, useState } from "react";
import {
  startRecording,
  MicPermissionDeniedError,
  MicUnavailableError,
  type ActiveRecording,
} from "@/lib/audio";
import { MicIcon } from "@/components/icons";

const AUTO_STOP_MS = 4500;

interface VoiceRecorderProps {
  disabled?: boolean;
  isListening: boolean;
  onStart: () => void;
  /** blob is null when no microphone was available — the mock flow still continues. */
  onStop: (blob: Blob | null) => void;
  onPermissionDenied: () => void;
}

export default function VoiceRecorder({
  disabled = false,
  isListening,
  onStart,
  onStop,
  onPermissionDenied,
}: VoiceRecorderProps) {
  const [isStarting, setIsStarting] = useState(false);
  const activeRecording = useRef<ActiveRecording | null>(null);
  const autoStopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (autoStopTimer.current) clearTimeout(autoStopTimer.current);
      activeRecording.current?.cancel();
    };
  }, []);

  const stop = async () => {
    if (autoStopTimer.current) clearTimeout(autoStopTimer.current);
    const recording = activeRecording.current;
    activeRecording.current = null;
    if (!recording) {
      onStop(null);
      return;
    }
    const blob = await recording.stop();
    onStop(blob);
  };

  const handleClick = async () => {
    if (disabled) return;

    if (isListening) {
      await stop();
      return;
    }

    setIsStarting(true);
    onStart();
    try {
      activeRecording.current = await startRecording();
      autoStopTimer.current = setTimeout(stop, AUTO_STOP_MS);
    } catch (err) {
      if (err instanceof MicPermissionDeniedError) {
        onPermissionDenied();
      } else if (err instanceof MicUnavailableError) {
        // No microphone available — continue the mock demo without real audio.
        onStop(null);
      }
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isStarting}
      aria-pressed={isListening}
      aria-label={isListening ? "Stop speaking" : "Tap to speak"}
      className={`flex h-24 w-24 items-center justify-center rounded-full text-white transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
        isListening ? "scale-105 bg-primary-700 animate-mic-pulse" : "bg-primary-600 hover:bg-primary-700"
      }`}
    >
      <MicIcon className="h-8 w-8" />
    </button>
  );
}

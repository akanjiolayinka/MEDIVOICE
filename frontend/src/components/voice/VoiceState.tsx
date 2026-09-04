import Waveform from "@/components/voice/Waveform";

export type VoicePhase = "idle" | "listening" | "processing" | "preparing" | "speaking";

const PHASE_LABELS: Record<VoicePhase, string> = {
  idle: "Tap to speak",
  listening: "Listening…",
  processing: "Understanding your message…",
  preparing: "Preparing your next question…",
  speaking: "MediVoice is speaking…",
};

export default function VoiceState({ phase }: { phase: VoicePhase }) {
  return (
    <div className="flex flex-col items-center gap-2" aria-live="polite">
      {phase === "listening" ? (
        <Waveform active />
      ) : phase === "processing" || phase === "preparing" || phase === "speaking" ? (
        <span className="flex gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary-600 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary-600 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary-600" />
        </span>
      ) : null}
      <p className="text-sm text-muted-500">{PHASE_LABELS[phase]}</p>
    </div>
  );
}

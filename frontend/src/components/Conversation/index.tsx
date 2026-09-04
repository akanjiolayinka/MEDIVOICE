"use client";

import { useEffect, useReducer, useRef } from "react";
import VoiceRecorder from "@/components/VoiceRecorder";
import AudioPlayer from "@/components/AudioPlayer";
import Transcript from "@/components/Transcript";
import LanguageIndicator from "@/components/LanguageIndicator";
import NotConfiguredBanner from "@/components/NotConfiguredBanner";
import TriageResult from "@/components/TriageResult";
import ConsultationSummary from "@/components/ConsultationSummary";
import Badge from "@/components/ui/Badge";
import ModeTabs, { type Mode } from "@/components/Conversation/ModeTabs";
import ScenarioPicker from "@/components/Conversation/ScenarioPicker";
import { uploadVoice } from "@/lib/api";
import { getOrCreateSessionId } from "@/lib/session";
import { demoFixtures } from "@/content/demoFixtures";
import type { ConversationPhase, DemoFixture } from "@/lib/types";

interface State {
  mode: Mode;
  phase: ConversationPhase;
  transcript: string | null;
  languages: string[];
  errorMessage: string | null;
  isFixture: boolean;
  recordedBlob: Blob | null;
}

type Action =
  | { type: "SET_MODE"; mode: Mode }
  | { type: "START_RECORDING" }
  | { type: "START_UPLOAD"; blob: Blob }
  | { type: "TRANSCRIBED"; transcript: string; languages: string[] }
  | { type: "NOT_CONFIGURED"; message: string }
  | { type: "ERROR"; message: string }
  | { type: "PLAY_FIXTURE"; fixture: DemoFixture }
  | { type: "RESET" };

const initialState: State = {
  mode: "live",
  phase: "idle",
  transcript: null,
  languages: [],
  errorMessage: null,
  isFixture: false,
  recordedBlob: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_MODE":
      return { ...initialState, mode: action.mode };
    case "START_RECORDING":
      return { ...state, phase: "recording" };
    case "START_UPLOAD":
      return {
        ...state,
        phase: "uploading",
        recordedBlob: action.blob,
        isFixture: false,
      };
    case "TRANSCRIBED":
      return {
        ...state,
        phase: "transcribed",
        transcript: action.transcript,
        languages: action.languages,
      };
    case "NOT_CONFIGURED":
      return { ...state, phase: "not_configured", errorMessage: action.message };
    case "ERROR":
      return { ...state, phase: "error", errorMessage: action.message };
    case "PLAY_FIXTURE":
      return {
        ...state,
        phase: "uploading",
        isFixture: true,
        recordedBlob: null,
      };
    case "RESET":
      return { ...initialState, mode: state.mode };
    default:
      return state;
  }
}

const processingLabels: Record<string, string> = {
  recording: "Listening…",
  uploading: "Understanding your speech…",
};

export default function Conversation() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const sessionIdRef = useRef<string>("");
  const fixtureTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
    return () => {
      if (fixtureTimeout.current) clearTimeout(fixtureTimeout.current);
    };
  }, []);

  const handleRecorded = async (blob: Blob) => {
    dispatch({ type: "START_UPLOAD", blob });
    const outcome = await uploadVoice(sessionIdRef.current, blob);
    if (outcome.kind === "transcribed") {
      dispatch({
        type: "TRANSCRIBED",
        transcript: outcome.result.transcript,
        languages: outcome.result.languages,
      });
    } else if (outcome.kind === "not_configured") {
      dispatch({ type: "NOT_CONFIGURED", message: outcome.error.message });
    } else {
      dispatch({ type: "ERROR", message: outcome.message });
    }
  };

  const handleFixtureSelect = (fixture: DemoFixture) => {
    dispatch({ type: "PLAY_FIXTURE", fixture });
    fixtureTimeout.current = setTimeout(() => {
      dispatch({
        type: "TRANSCRIBED",
        transcript: fixture.result.transcript,
        languages: fixture.result.languages,
      });
    }, 900);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <ModeTabs
        mode={state.mode}
        onChange={(mode) => dispatch({ type: "SET_MODE", mode })}
      />

      {state.mode === "live" && state.phase === "idle" && (
        <VoiceRecorder
          onRecorded={handleRecorded}
          onPermissionDenied={() =>
            dispatch({
              type: "ERROR",
              message:
                "Microphone access is required. Please allow it in your browser settings and try again.",
            })
          }
          onUnavailable={(message) => dispatch({ type: "ERROR", message })}
        />
      )}

      {state.mode === "live" && state.phase === "recording" && (
        <VoiceRecorder
          onRecorded={handleRecorded}
          onPermissionDenied={() =>
            dispatch({ type: "ERROR", message: "Microphone access was denied." })
          }
          onUnavailable={(message) => dispatch({ type: "ERROR", message })}
        />
      )}

      {state.mode === "demo" && state.phase === "idle" && (
        <ScenarioPicker fixtures={demoFixtures} onSelect={handleFixtureSelect} />
      )}

      {state.phase === "uploading" && (
        <div className="flex flex-col items-center gap-2">
          {state.isFixture && <Badge tone="accent">Fixture — pipeline replay</Badge>}
          <p className="text-sm text-muted-500">
            {processingLabels.uploading}
          </p>
        </div>
      )}

      {state.phase === "not_configured" && (
        <div className="flex w-full max-w-md flex-col items-center gap-4">
          <NotConfiguredBanner
            service="Sahara"
            message={
              state.errorMessage ??
              "Sahara isn't configured yet — add SAHARA_API_KEY to enable real transcription."
            }
          />
          <button
            type="button"
            onClick={() => dispatch({ type: "SET_MODE", mode: "demo" })}
            className="text-sm font-medium text-primary-700 hover:text-primary-900"
          >
            Try the fixture demo instead →
          </button>
        </div>
      )}

      {state.phase === "error" && (
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="max-w-sm text-sm text-muted-500">
            {state.errorMessage}
          </p>
          <button
            type="button"
            onClick={() => dispatch({ type: "RESET" })}
            className="rounded-full border border-muted-200 px-4 py-2 text-sm font-medium hover:border-primary-600 hover:text-primary-700"
          >
            Try again
          </button>
        </div>
      )}

      {state.phase === "transcribed" && (
        <div className="flex w-full flex-col items-center gap-6">
          {state.isFixture && <Badge tone="accent">Fixture — pipeline replay</Badge>}

          <div className="w-full max-w-md rounded-2xl border border-muted-200 bg-white p-4">
            <p className="text-xs font-medium text-muted-500">You</p>
            <p className="mt-1">&ldquo;{state.transcript}&rdquo;</p>
          </div>

          <LanguageIndicator codes={state.languages} />
          {state.recordedBlob && <AudioPlayer blob={state.recordedBlob} />}
          <Transcript transcript={state.transcript} languages={state.languages} />

          <TriageResult />
          <ConsultationSummary />

          <button
            type="button"
            onClick={() => dispatch({ type: "RESET" })}
            className="text-sm font-medium text-primary-700 hover:text-primary-900"
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}

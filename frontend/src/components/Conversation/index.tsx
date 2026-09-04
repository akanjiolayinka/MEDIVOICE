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
import { uploadVoice, sendMessage, assessTriage } from "@/lib/api";
import { getOrCreateSessionId } from "@/lib/session";
import { demoFixtures } from "@/content/demoFixtures";
import type {
  ConversationPhase,
  DemoFixture,
  MedicalState,
  TriageResult as TriageResultType,
} from "@/lib/types";

interface State {
  mode: Mode;
  phase: ConversationPhase;
  transcript: string | null;
  languages: string[];
  errorMessage: string | null;
  notConfiguredService: string | null;
  isFixture: boolean;
  recordedBlob: Blob | null;
  medicalState: MedicalState | null;
  triage: TriageResultType | null;
  agentReply: string | null;
}

type Action =
  | { type: "SET_MODE"; mode: Mode }
  | { type: "START_RECORDING" }
  | { type: "START_UPLOAD"; blob: Blob }
  | { type: "PLAY_FIXTURE" }
  | {
      type: "ASSESSING";
      transcript: string;
      languages: string[];
      isFixture: boolean;
    }
  | {
      type: "ASSESSED";
      medicalState: MedicalState;
      triage: TriageResultType;
      agentReply: string;
    }
  | { type: "NOT_CONFIGURED"; service: string; message: string }
  | { type: "ERROR"; message: string }
  | { type: "RESET" };

const initialState: State = {
  mode: "live",
  phase: "idle",
  transcript: null,
  languages: [],
  errorMessage: null,
  notConfiguredService: null,
  isFixture: false,
  recordedBlob: null,
  medicalState: null,
  triage: null,
  agentReply: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_MODE":
      return { ...initialState, mode: action.mode };
    case "START_RECORDING":
      return { ...state, phase: "recording" };
    case "START_UPLOAD":
      return { ...state, phase: "uploading", recordedBlob: action.blob, isFixture: false };
    case "PLAY_FIXTURE":
      return { ...state, phase: "uploading", isFixture: true, recordedBlob: null };
    case "ASSESSING":
      return {
        ...state,
        phase: "assessing",
        transcript: action.transcript,
        languages: action.languages,
        isFixture: action.isFixture,
      };
    case "ASSESSED":
      return {
        ...state,
        phase: "assessed",
        medicalState: action.medicalState,
        triage: action.triage,
        agentReply: action.agentReply,
      };
    case "NOT_CONFIGURED":
      return {
        ...state,
        phase: "not_configured",
        notConfiguredService: action.service,
        errorMessage: action.message,
      };
    case "ERROR":
      return { ...state, phase: "error", errorMessage: action.message };
    case "RESET":
      return { ...initialState, mode: state.mode };
    default:
      return state;
  }
}

const PROCESSING_LABELS: Record<string, string> = {
  uploading: "Understanding your speech…",
  assessing: "Thinking about what to ask next…",
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

    const voiceOutcome = await uploadVoice(sessionIdRef.current, blob);
    if (voiceOutcome.kind === "not_configured") {
      dispatch({
        type: "NOT_CONFIGURED",
        service: voiceOutcome.error.service,
        message: voiceOutcome.error.message,
      });
      return;
    }
    if (voiceOutcome.kind === "error") {
      dispatch({ type: "ERROR", message: voiceOutcome.message });
      return;
    }

    dispatch({
      type: "ASSESSING",
      transcript: voiceOutcome.result.transcript,
      languages: voiceOutcome.result.languages,
      isFixture: false,
    });

    const convoOutcome = await sendMessage(sessionIdRef.current, voiceOutcome.result.transcript);
    if (convoOutcome.kind === "not_configured") {
      dispatch({
        type: "NOT_CONFIGURED",
        service: convoOutcome.error.service,
        message: convoOutcome.error.message,
      });
      return;
    }
    if (convoOutcome.kind === "error") {
      dispatch({ type: "ERROR", message: convoOutcome.message });
      return;
    }

    dispatch({
      type: "ASSESSED",
      medicalState: convoOutcome.result.medical_state,
      triage: convoOutcome.result.triage,
      agentReply: convoOutcome.result.response_text,
    });
  };

  const handleFixtureSelect = (fixture: DemoFixture) => {
    dispatch({ type: "PLAY_FIXTURE" });
    fixtureTimeout.current = setTimeout(async () => {
      dispatch({
        type: "ASSESSING",
        transcript: fixture.result.transcript,
        languages: fixture.result.languages,
        isFixture: true,
      });

      try {
        const triage = await assessTriage(fixture.medicalState);
        dispatch({
          type: "ASSESSED",
          medicalState: fixture.medicalState,
          triage,
          agentReply: fixture.agentReply,
        });
      } catch {
        dispatch({
          type: "ERROR",
          message: "We couldn't reach MediVoice's servers. Check your connection and try again.",
        });
      }
    }, 900);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <ModeTabs mode={state.mode} onChange={(mode) => dispatch({ type: "SET_MODE", mode })} />

      {state.mode === "live" && (state.phase === "idle" || state.phase === "recording") && (
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

      {state.mode === "demo" && state.phase === "idle" && (
        <ScenarioPicker fixtures={demoFixtures} onSelect={handleFixtureSelect} />
      )}

      {(state.phase === "uploading" || state.phase === "assessing") && (
        <div className="flex flex-col items-center gap-2">
          {state.isFixture && <Badge tone="accent">Fixture — pipeline replay</Badge>}
          <p className="text-sm text-muted-500">{PROCESSING_LABELS[state.phase]}</p>
        </div>
      )}

      {state.phase === "not_configured" && (
        <div className="flex w-full max-w-md flex-col items-center gap-4">
          <NotConfiguredBanner
            service={state.notConfiguredService ?? "Service"}
            message={state.errorMessage ?? "This service isn't configured yet."}
          />
          {state.transcript && (
            <p className="max-w-sm text-center text-sm italic text-muted-500">
              &ldquo;{state.transcript}&rdquo;
            </p>
          )}
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
          <p className="max-w-sm text-sm text-muted-500">{state.errorMessage}</p>
          <button
            type="button"
            onClick={() => dispatch({ type: "RESET" })}
            className="rounded-full border border-muted-200 px-4 py-2 text-sm font-medium hover:border-primary-600 hover:text-primary-700"
          >
            Try again
          </button>
        </div>
      )}

      {state.phase === "assessed" && state.medicalState && state.triage && (
        <div className="flex w-full flex-col items-center gap-6">
          {state.isFixture && <Badge tone="accent">Fixture — pipeline replay</Badge>}

          <div className="w-full max-w-md rounded-2xl border border-muted-200 bg-white p-4">
            <p className="text-xs font-medium text-muted-500">You</p>
            <p className="mt-1">&ldquo;{state.transcript}&rdquo;</p>
          </div>

          {state.agentReply && (
            <div className="w-full max-w-md rounded-2xl border border-primary-100 bg-primary-50 p-4">
              <p className="text-xs font-medium text-primary-700">MediVoice</p>
              <p className="mt-1">{state.agentReply}</p>
            </div>
          )}

          <LanguageIndicator codes={state.languages} />
          {state.recordedBlob && <AudioPlayer blob={state.recordedBlob} />}
          <Transcript transcript={state.transcript} languages={state.languages} />

          <TriageResult triage={state.triage} />
          <ConsultationSummary medicalState={state.medicalState} triage={state.triage} />

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

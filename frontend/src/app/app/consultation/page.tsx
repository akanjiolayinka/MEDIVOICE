"use client";

import { useEffect, useReducer, useRef } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import VoiceRecorder from "@/components/voice/VoiceRecorder";
import VoiceState, { type VoicePhase } from "@/components/voice/VoiceState";
import ScenarioPicker from "@/components/conversation/ScenarioPicker";
import ConversationPanel from "@/components/conversation/ConversationPanel";
import ModeTabs, { type ConsultationMode } from "@/components/conversation/ModeTabs";
import NotConfiguredBanner from "@/components/conversation/NotConfiguredBanner";
import type { DisplayMessage } from "@/components/conversation/Message";
import TriageCard from "@/components/triage/TriageCard";
import RedFlagAlert from "@/components/triage/RedFlagAlert";
import Button from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";
import { conversationScenarios, type ConversationScenario } from "@/lib/mock/conversations";
import { mockTranscribe, LANGUAGE_NAMES } from "@/services/mockVoiceService";
import { mockGetNextAgentTurn } from "@/services/mockConversationService";
import { mockAssessTriage } from "@/services/mockTriageService";
import { speakMock } from "@/services/mockVoiceOutputService";
import { uploadVoice, sendMessage } from "@/lib/api";
import { getOrCreateSessionId } from "@/lib/session";
import {
  addConsultation,
  buildConsultationRecordFromScenario,
  buildConsultationRecordFromLiveResult,
} from "@/lib/mock/consultations";
import type { ConversationTurn } from "@/lib/mock/conversations";
import type { TriageResult } from "@/lib/types";

type Phase = "idle" | "listening" | "processing" | "preparing" | "speaking" | "completed";

interface State {
  mode: ConsultationMode;
  scenario: ConversationScenario;
  phase: Phase;
  messages: DisplayMessage[];
  userStepsTaken: number;
  agentStepsTaken: number;
  triage: TriageResult | null;
  isRedFlag: boolean;
  micErrorMessage: string | null;
  consultationId: string | null;
  blockedService: string | null;
  blockedMessage: string | null;
  liveErrorMessage: string | null;
}

type Action =
  | { type: "SET_MODE"; mode: ConsultationMode }
  | { type: "SELECT_SCENARIO"; scenario: ConversationScenario }
  | { type: "SET_PHASE"; phase: Phase }
  | { type: "ADD_MESSAGE"; message: DisplayMessage }
  | { type: "SET_MIC_ERROR"; message: string | null }
  | { type: "LIVE_BLOCKED"; service: string; message: string }
  | { type: "LIVE_ERROR"; message: string }
  | { type: "FINALIZE"; triage: TriageResult; isRedFlag: boolean; consultationId: string };

function initialStateFor(scenario: ConversationScenario, mode: ConsultationMode = "demo"): State {
  return {
    mode,
    scenario,
    phase: "idle",
    messages: [],
    userStepsTaken: 0,
    agentStepsTaken: 0,
    triage: null,
    isRedFlag: false,
    micErrorMessage: null,
    consultationId: null,
    blockedService: null,
    blockedMessage: null,
    liveErrorMessage: null,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_MODE":
      return initialStateFor(state.scenario, action.mode);
    case "SELECT_SCENARIO":
      return initialStateFor(action.scenario, state.mode);
    case "SET_PHASE":
      return { ...state, phase: action.phase };
    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.message],
        userStepsTaken: state.userStepsTaken + (action.message.speaker === "user" ? 1 : 0),
        agentStepsTaken: state.agentStepsTaken + (action.message.speaker === "agent" ? 1 : 0),
      };
    case "SET_MIC_ERROR":
      return { ...state, micErrorMessage: action.message };
    case "LIVE_BLOCKED":
      return {
        ...state,
        phase: "idle",
        blockedService: action.service,
        blockedMessage: action.message,
      };
    case "LIVE_ERROR":
      return { ...state, phase: "idle", liveErrorMessage: action.message };
    case "FINALIZE":
      return {
        ...state,
        phase: "completed",
        triage: action.triage,
        isRedFlag: action.isRedFlag,
        consultationId: action.consultationId,
      };
    default:
      return state;
  }
}

export default function ConsultationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [state, dispatch] = useReducer(
    reducer,
    conversationScenarios[0],
    (scenario) => initialStateFor(scenario),
  );
  const messageIdRef = useRef(0);
  const sessionIdRef = useRef("");

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
  }, []);

  const nextMessageId = () => `msg-${++messageIdRef.current}`;

  const handleSelectScenario = (scenario: ConversationScenario) => {
    dispatch({ type: "SELECT_SCENARIO", scenario });
  };

  const runDemoTurn = async (blob: Blob | null) => {
    void blob; // real audio Blob captured for realism; the mock service doesn't inspect it.
    dispatch({ type: "SET_PHASE", phase: "processing" });

    const userTurns = state.scenario.turns.filter((turn) => turn.speaker === "user");
    const nextUserTurn: ConversationTurn | undefined = userTurns[state.userStepsTaken];
    if (!nextUserTurn) return;

    const transcription = await mockTranscribe(nextUserTurn);
    dispatch({
      type: "ADD_MESSAGE",
      message: {
        id: nextMessageId(),
        speaker: "user",
        text: transcription.transcript,
        languages: transcription.detectedLanguages.map((code) => LANGUAGE_NAMES[code] ?? code),
        timestamp: new Date().toISOString(),
      },
    });

    dispatch({ type: "SET_PHASE", phase: "preparing" });
    const agentTurn = await mockGetNextAgentTurn(state.scenario, state.agentStepsTaken);
    dispatch({
      type: "ADD_MESSAGE",
      message: {
        id: nextMessageId(),
        speaker: "agent",
        text: agentTurn.responseText,
        timestamp: new Date().toISOString(),
        isRedFlag: agentTurn.isRedFlag,
      },
    });

    const shouldFinalize = agentTurn.isRedFlag || agentTurn.isFinalTurn;

    if (user?.voicePreferences.autoPlayResponses) {
      dispatch({ type: "SET_PHASE", phase: "speaking" });
      await speakMock(agentTurn.responseText, { rate: user.voicePreferences.speakingSpeed });
    }

    if (shouldFinalize) {
      const triage = await mockAssessTriage(state.scenario.medicalState);
      const record = buildConsultationRecordFromScenario(state.scenario, state.scenario.turns, triage);
      addConsultation(record);
      dispatch({ type: "FINALIZE", triage, isRedFlag: agentTurn.isRedFlag, consultationId: record.id });
    } else {
      dispatch({ type: "SET_PHASE", phase: "idle" });
    }
  };

  /**
   * Real pipeline: recorded audio -> Sahara (backend/app/services/sahara)
   * -> the conversation agent (backend/app/services/agent). Each step
   * honestly reports "not configured" instead of a fake result — neither
   * SAHARA_API_KEY nor LLM_API_KEY exist in this environment yet, so this
   * currently stops at the first step. Requires the backend running at
   * NEXT_PUBLIC_API_BASE_URL (see backend/README setup).
   */
  const runLiveTurn = async (blob: Blob | null) => {
    if (!blob) {
      dispatch({
        type: "LIVE_ERROR",
        message:
          "Live Mode needs a real recording — try Demo Mode instead, or allow microphone access and try again.",
      });
      return;
    }

    dispatch({ type: "SET_PHASE", phase: "processing" });
    const voiceOutcome = await uploadVoice(sessionIdRef.current, blob);

    if (voiceOutcome.kind === "not_configured") {
      dispatch({
        type: "LIVE_BLOCKED",
        service: voiceOutcome.error.service,
        message: voiceOutcome.error.message,
      });
      return;
    }
    if (voiceOutcome.kind === "error") {
      dispatch({ type: "LIVE_ERROR", message: voiceOutcome.message });
      return;
    }

    dispatch({
      type: "ADD_MESSAGE",
      message: {
        id: nextMessageId(),
        speaker: "user",
        text: voiceOutcome.result.transcript,
        languages: voiceOutcome.result.languages.map((code) => LANGUAGE_NAMES[code] ?? code),
        timestamp: new Date().toISOString(),
      },
    });

    dispatch({ type: "SET_PHASE", phase: "preparing" });
    const convoOutcome = await sendMessage(sessionIdRef.current, voiceOutcome.result.transcript);

    if (convoOutcome.kind === "not_configured") {
      dispatch({
        type: "LIVE_BLOCKED",
        service: convoOutcome.error.service,
        message: convoOutcome.error.message,
      });
      return;
    }
    if (convoOutcome.kind === "error") {
      dispatch({ type: "LIVE_ERROR", message: convoOutcome.message });
      return;
    }

    dispatch({
      type: "ADD_MESSAGE",
      message: {
        id: nextMessageId(),
        speaker: "agent",
        text: convoOutcome.result.response_text,
        timestamp: new Date().toISOString(),
        isRedFlag: convoOutcome.result.triage.recommend_emergency_care,
      },
    });

    if (user?.voicePreferences.autoPlayResponses) {
      dispatch({ type: "SET_PHASE", phase: "speaking" });
      await speakMock(convoOutcome.result.response_text, { rate: user.voicePreferences.speakingSpeed });
    }

    const record = buildConsultationRecordFromLiveResult(
      voiceOutcome.result.transcript,
      voiceOutcome.result.languages.map((code) => LANGUAGE_NAMES[code] ?? code),
      convoOutcome.result.medical_state,
      convoOutcome.result.triage,
    );
    addConsultation(record);
    dispatch({
      type: "FINALIZE",
      triage: convoOutcome.result.triage,
      isRedFlag: convoOutcome.result.triage.recommend_emergency_care,
      consultationId: record.id,
    });
  };

  const voicePhase: VoicePhase = state.phase === "completed" ? "idle" : (state.phase as VoicePhase);
  const isBusy = state.phase === "processing" || state.phase === "preparing" || state.phase === "speaking";

  return (
    <Container className="flex max-w-2xl flex-col items-center gap-6 py-10">
      <div className="text-center">
        <h1 className="text-xl font-semibold tracking-tight">How are you feeling today?</h1>
        <p className="mt-1 text-sm text-muted-500">
          Speak naturally — English, Pidgin, Yoruba, Igbo and Hausa are all supported.
        </p>
      </div>

      <ModeTabs mode={state.mode} onChange={(mode) => dispatch({ type: "SET_MODE", mode })} />

      {state.mode === "demo" && (
        <ScenarioPicker
          scenarios={conversationScenarios}
          activeId={state.scenario.id}
          onSelect={handleSelectScenario}
        />
      )}

      {state.phase !== "completed" && (
        <div className="flex flex-col items-center gap-3 py-4">
          <VoiceRecorder
            isListening={state.phase === "listening"}
            disabled={isBusy}
            onStart={() => dispatch({ type: "SET_PHASE", phase: "listening" })}
            onStop={(blob) => {
              dispatch({ type: "SET_MIC_ERROR", message: null });
              void (state.mode === "demo" ? runDemoTurn(blob) : runLiveTurn(blob));
            }}
            onPermissionDenied={() =>
              dispatch({ type: "SET_MIC_ERROR", message: "Microphone access was denied." })
            }
          />
          <VoiceState phase={voicePhase} />

          {state.micErrorMessage && (
            <div className="mt-2 flex flex-col items-center gap-2 text-center">
              <p className="text-sm text-accent-700">{state.micErrorMessage}</p>
              {state.mode === "demo" && (
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: "SET_MIC_ERROR", message: null });
                    void runDemoTurn(null);
                  }}
                  className="text-sm font-medium text-primary-700 hover:text-primary-900"
                >
                  Continue without microphone →
                </button>
              )}
            </div>
          )}

          {state.mode === "live" && state.liveErrorMessage && (
            <p className="mt-2 max-w-sm text-center text-sm text-accent-700">{state.liveErrorMessage}</p>
          )}

          {state.mode === "live" && state.blockedService && (
            <div className="mt-2 flex flex-col items-center gap-3">
              <NotConfiguredBanner
                service={state.blockedService}
                message={state.blockedMessage ?? "This service isn't configured yet."}
              />
              <button
                type="button"
                onClick={() => dispatch({ type: "SET_MODE", mode: "demo" })}
                className="text-sm font-medium text-primary-700 hover:text-primary-900"
              >
                Try the demo instead →
              </button>
            </div>
          )}
        </div>
      )}

      <div className="w-full">
        <ConversationPanel messages={state.messages} />
      </div>

      {state.phase === "completed" && state.triage && (
        <div className="flex w-full flex-col items-center gap-4">
          {state.isRedFlag && <RedFlagAlert message={state.triage.message} />}
          <TriageCard triage={state.triage} />
          <div className="flex flex-wrap justify-center gap-3">
            <Button href={`/app/summary/${state.consultationId}`}>View consultation summary</Button>
            <Button
              variant="secondary"
              onClick={() => dispatch({ type: "SET_MODE", mode: state.mode })}
            >
              Start a new consultation
            </Button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => router.push("/app/facilities")}
        className="text-xs text-muted-500 hover:text-foreground"
      >
        Looking for a healthcare facility instead? →
      </button>
    </Container>
  );
}

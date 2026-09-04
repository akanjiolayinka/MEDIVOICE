"use client";

import { useReducer, useRef } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import VoiceRecorder from "@/components/voice/VoiceRecorder";
import VoiceState, { type VoicePhase } from "@/components/voice/VoiceState";
import ScenarioPicker from "@/components/conversation/ScenarioPicker";
import ConversationPanel from "@/components/conversation/ConversationPanel";
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
import { addConsultation, buildConsultationRecordFromScenario } from "@/lib/mock/consultations";
import type { ConversationTurn } from "@/lib/mock/conversations";
import type { TriageResult } from "@/lib/types";

type Phase = "idle" | "listening" | "processing" | "preparing" | "speaking" | "completed";

interface State {
  scenario: ConversationScenario;
  phase: Phase;
  messages: DisplayMessage[];
  userStepsTaken: number;
  agentStepsTaken: number;
  triage: TriageResult | null;
  isRedFlag: boolean;
  micErrorMessage: string | null;
  consultationId: string | null;
}

type Action =
  | { type: "SELECT_SCENARIO"; scenario: ConversationScenario }
  | { type: "SET_PHASE"; phase: Phase }
  | { type: "ADD_MESSAGE"; message: DisplayMessage }
  | { type: "SET_MIC_ERROR"; message: string | null }
  | { type: "FINALIZE"; triage: TriageResult; isRedFlag: boolean; consultationId: string };

function initialStateFor(scenario: ConversationScenario): State {
  return {
    scenario,
    phase: "idle",
    messages: [],
    userStepsTaken: 0,
    agentStepsTaken: 0,
    triage: null,
    isRedFlag: false,
    micErrorMessage: null,
    consultationId: null,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SELECT_SCENARIO":
      return initialStateFor(action.scenario);
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
  const [state, dispatch] = useReducer(reducer, conversationScenarios[0], initialStateFor);
  const messageIdRef = useRef(0);

  const nextMessageId = () => `msg-${++messageIdRef.current}`;

  const handleSelectScenario = (scenario: ConversationScenario) => {
    dispatch({ type: "SELECT_SCENARIO", scenario });
  };

  const runTurn = async (blob: Blob | null) => {
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
      const record = buildConsultationRecordFromScenario(
        state.scenario,
        state.scenario.turns,
        triage,
      );
      addConsultation(record);
      dispatch({ type: "FINALIZE", triage, isRedFlag: agentTurn.isRedFlag, consultationId: record.id });
    } else {
      dispatch({ type: "SET_PHASE", phase: "idle" });
    }
  };

  const voicePhase: VoicePhase =
    state.phase === "completed" ? "idle" : (state.phase as VoicePhase);

  return (
    <Container className="flex max-w-2xl flex-col items-center gap-6 py-10">
      <div className="text-center">
        <h1 className="text-xl font-semibold tracking-tight">How are you feeling today?</h1>
        <p className="mt-1 text-sm text-muted-500">
          Speak naturally — English, Pidgin, Yoruba, Igbo and Hausa are all supported.
        </p>
      </div>

      <ScenarioPicker
        scenarios={conversationScenarios}
        activeId={state.scenario.id}
        onSelect={handleSelectScenario}
      />

      {state.phase !== "completed" && (
        <div className="flex flex-col items-center gap-3 py-4">
          <VoiceRecorder
            isListening={state.phase === "listening"}
            disabled={state.phase === "processing" || state.phase === "preparing" || state.phase === "speaking"}
            onStart={() => dispatch({ type: "SET_PHASE", phase: "listening" })}
            onStop={(blob) => {
              dispatch({ type: "SET_MIC_ERROR", message: null });
              void runTurn(blob);
            }}
            onPermissionDenied={() =>
              dispatch({
                type: "SET_MIC_ERROR",
                message: "Microphone access was denied.",
              })
            }
          />
          <VoiceState phase={voicePhase} />

          {state.micErrorMessage && (
            <div className="mt-2 flex flex-col items-center gap-2 text-center">
              <p className="text-sm text-accent-700">{state.micErrorMessage}</p>
              <button
                type="button"
                onClick={() => {
                  dispatch({ type: "SET_MIC_ERROR", message: null });
                  void runTurn(null);
                }}
                className="text-sm font-medium text-primary-700 hover:text-primary-900"
              >
                Continue without microphone →
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
              onClick={() => dispatch({ type: "SELECT_SCENARIO", scenario: state.scenario })}
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

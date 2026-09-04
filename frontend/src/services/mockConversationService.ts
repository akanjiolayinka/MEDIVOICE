import { randomDelay } from "@/lib/mock/delay";
import type { ConversationScenario } from "@/lib/mock/conversations";

export interface MockAgentTurn {
  responseText: string;
  isRedFlag: boolean;
  /** True once the scripted scenario has no further turns. */
  isFinalTurn: boolean;
}

/**
 * FEATURE: Conversation reasoning (medical extraction, follow-up
 * questions, intent).
 * CURRENT: mock — walks a hand-authored scripted scenario turn by turn.
 * FUTURE: replace with a real call to POST /api/conversation/message
 * (the LLM-backed agent), see backend/app/services/agent/ and
 * frontend/src/lib/api.ts::sendMessage.
 */
export async function mockGetNextAgentTurn(
  scenario: ConversationScenario,
  agentTurnIndex: number,
): Promise<MockAgentTurn> {
  await randomDelay(700, 1100);

  const agentTurns = scenario.turns.filter((turn) => turn.speaker === "agent");
  const turn = agentTurns[agentTurnIndex];

  return {
    responseText: turn.text,
    isRedFlag: Boolean(turn.isRedFlag),
    isFinalTurn: agentTurnIndex >= agentTurns.length - 1,
  };
}

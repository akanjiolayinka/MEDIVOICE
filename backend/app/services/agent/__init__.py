# AI conversation agent (Phase 4 — architecture implemented, LLM-gated).
#
# See conversation.py (orchestrator), medical_extraction.py, intent.py,
# response.py, llm_client.py. No LLM_API_KEY exists in this environment,
# so ConversationAgent.process_turn() will raise AgentNotConfiguredError
# until one is set — the same honest-failure pattern as
# app/services/sahara/client.py, not a fabricated extraction.

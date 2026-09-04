# Deterministic safety/triage engine (Phase 6 — implemented).
# See rules.py: assess(MedicalState) -> TriageResult. Independent of the
# LLM agent by design (master build prompt §8) — red-flag keyword rules
# always take priority over anything the agent concluded.

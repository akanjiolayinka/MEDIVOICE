# MediVoice Africa

**Healthcare conversations that sound like home.**

A voice-first healthcare triage and navigation assistant for people who
naturally speak — and code-switch between — English, Nigerian Pidgin,
Yoruba, Igbo and Hausa. MediVoice does not diagnose; it helps people
describe symptoms naturally, answers follow-up questions, flags potentially
urgent situations, and helps them take a next step (a consultation summary,
or finding a healthcare facility).

## Problem

Voice AI products are usually built assuming people speak one language at
a time. Many Nigerians don't — a single sentence like *"My head dey pain
me, and mo feel weak too"* moves between English, Pidgin and Yoruba without
anyone thinking twice. Systems that can't handle that either misunderstand
the user or force them to speak unnaturally, which is a real problem when
the conversation is about their health.

## Solution

MediVoice is built around a single idea: **don't make people speak like
machines understand — make machines understand how people speak.** The
product accepts natural, mixed-language speech, understands it via Sahara's
code-switching speech layer, holds a real conversation to gather relevant
medical context, applies a deterministic safety/triage layer independent of
the language model, and performs an actual downstream task (a consultation
summary, or a facility search) rather than stopping at a transcript.

## Architecture (target)

```
your voice
   ↓
Sahara            — code-switched speech understanding
   ↓
AI agent          — conversation, medical information extraction
   ↓
Safety/triage     — deterministic red-flag rules, independent of the LLM
   ↓
Action            — consultation summary / facility search
   ↓
YarnGPT           — multilingual voice response
```

## Current status

This build follows an explicit, incremental phase plan (see
`## Development phases` below) and **stops as soon as a phase can't be
verified for real.** Right now:

- ✅ **Phase 1 — Project structure**: frontend (Next.js) + backend
  (FastAPI) scaffolded, marketing pages and the real `/app` conversation
  screen exist, all routes resolve.
- ✅ **Phase 2 — Audio recording/upload**: `/app` does real push-to-talk
  microphone recording (`MediaRecorder`) and uploads the real audio Blob to
  the backend, which validates and stores it.
- ✅ **Phase 3 — Sahara integration (built, not yet verifiable live)**: a
  real `SaharaClient` exists with a `SpeechProvider` interface, but **no
  Sahara API credentials or documentation exist in this environment.** The
  client is written against a clearly-marked *placeholder* request/response
  shape and needs the real Sahara CodeSwitch API contract confirmed before
  it can transcribe anything. Until `SAHARA_API_KEY` is set, every upload
  honestly returns `503 service_not_configured` — the frontend shows this
  as a plain-language banner, never a fake transcript.
- ✅ **Phase 4 — AI conversation agent (built, LLM-gated)**: a real
  `ConversationAgent` (`backend/app/services/agent/`) does structured
  medical-info extraction, intent normalization, and follow-up-question
  suggestion — same honest pattern as Sahara: **no `LLM_API_KEY` exists in
  this environment**, so it raises `AgentNotConfiguredError` → `503
  service_not_configured` (`service: "agent"`) instead of fabricating an
  extraction.
- ✅ **Phase 5 — Conversation memory**: `SessionState` now carries the
  accumulated `MedicalState` and turn history across a conversation, so the
  agent (once configured) never re-asks something already answered.
- ✅ **Phase 6 — Safety/triage engine (fully real, no credentials needed)**:
  `backend/app/services/triage/rules.py` is deterministic keyword-based
  red-flag detection, independent of the LLM by design. It's wired to a
  real `POST /api/triage/assess` endpoint and fully unit/endpoint tested.
- ✅ **Phase 8 (partial) — `/api/conversation/message`**: combines the
  agent + the (always-real) triage engine + session memory into one
  endpoint; the safety engine's message overrides the agent's suggested
  response whenever it recommends emergency care.
- ⏸️ **Phases 7, 9–14 remain deferred**: YarnGPT voice synthesis, facility
  search, the full audio→Sahara→agent→YarnGPT pipeline connection, the
  benchmark harness, UX polish, and end-to-end testing — all blocked on
  real credentials/docs (Sahara, an LLM provider, YarnGPT, a maps/places
  API) this environment doesn't have.

**Demo Mode** on `/app` now runs its four scripted code-switched scenarios
(English+Pidgin, +Yoruba, +Igbo, +Hausa) through the **real triage engine**:
each scenario's transcript and a hand-authored `MedicalState` are labeled
fixtures (no live Sahara/agent call), but the urgency assessment and
consultation summary shown are genuinely computed by
`POST /api/triage/assess` — verified end-to-end with a headless-browser
click-through. The UI keeps a persistent **"Fixture — pipeline replay"**
badge visible throughout so this is never mistaken for a live pipeline run.
Live Mode attempts the real pipeline at every step and honestly reports
whichever service (Sahara, then the agent) isn't configured yet.

The `/benchmark` page shows **"awaiting benchmark run"** rather than any
number, because no benchmark has actually been executed yet.

## Development phases

1. Project structure
2. Audio recording/upload
3. Sahara integration (stop-the-line: don't continue until `audio → Sahara
   → transcript` works for real)
4. AI conversation agent
5. Conversation memory
6. Safety/triage engine
7. YarnGPT voice synthesis
8. Connect the full pipeline
9. Facility search
10. Demo Mode (backend-integrated)
11. Live Mode (full pipeline)
12. Benchmark infrastructure
13. UX polish
14. End-to-end testing

## Sahara integration

See `backend/app/services/sahara/client.py`. `SaharaClient` implements a
`SpeechProvider` interface so a second speech model can be benchmarked
against it later without touching anything downstream. It raises
`SaharaNotConfiguredError` — surfaced as `503 service_not_configured` —
whenever `SAHARA_API_KEY` is unset. The actual HTTP request shape is a
documented placeholder pending real Sahara API docs.

## AI agent & safety/triage engine

`backend/app/services/agent/` — `llm_client.py` (same not-configured
pattern as Sahara, gated on `LLM_API_KEY`/`LLM_API_URL`),
`medical_extraction.py` (calls the LLM, merges the result into prior
session state so answers are never lost), `intent.py` (normalizes onto a
fixed label set), `response.py` (decides final response text — always
overridden by the triage engine when it recommends emergency care),
`conversation.py` (orchestrator).

`backend/app/services/triage/rules.py` — deterministic, keyword-based
red-flag detection over `MedicalState`, independent of the LLM by design
(master build prompt §8). Needs no credentials; fully unit-tested and
live-verified via `/api/triage/assess`.

## Setup

### Backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env   # fill in SAHARA_API_KEY when you have it
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000`. The frontend expects the backend at
`http://localhost:8000` (`NEXT_PUBLIC_API_BASE_URL`).

## Environment variables

See `.env.example` at the repo root. `SAHARA_API_KEY`/`SAHARA_API_URL` and
`LLM_API_KEY`/`LLM_API_URL` are both read today (by the Sahara client and
the agent's `LLMClient`, respectively) — neither is set in this
environment, so both honestly report "not configured" rather than working.
`YARNGPT_API_KEY`, `FACILITY_API_KEY`, and `DATABASE_URL` are declared for
future phases and currently unused.

## Project structure

```
frontend/    Next.js + TypeScript — marketing pages + the /app conversation screen
backend/     FastAPI — voice upload, Sahara client, stubbed routers for
             phases not yet built
benchmark/   Evaluation dataset scaffold (empty until Phase 12)
```

## Limitations

- No real speech transcription yet — Sahara isn't configured, and its
  actual API contract hasn't been confirmed against real docs.
- No real conversation agent output yet — no LLM provider/key has been
  chosen or configured, and the request shape in `llm_client.py` is an
  unconfirmed placeholder.
- No voice synthesis (YarnGPT) or facility search yet.
- No persistence — sessions are in-memory and reset when the backend
  restarts.
- Demo Mode's transcript and `MedicalState` are labeled fixtures; only the
  triage computation on top of them is live.

## Future work

Phases 7, 9–14 above, in order — most immediately, real Sahara and LLM
provider credentials/API documentation to unblock live verification of the
agent and Sahara integration and everything that depends on them.

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

The project has two layers that are intentionally **not wired together
yet** — see `FEATURE_STATUS.md` for the full per-feature breakdown.

### Backend (`backend/`) — real, credential-gated infrastructure

Built in an earlier phase, unchanged and still fully real:

- ✅ **Phase 1–2 — project structure, audio upload**: FastAPI scaffold,
  `POST /api/voice/process` validates and stores uploaded audio.
- ✅ **Phase 3 — Sahara integration (built, not yet verifiable live)**: a
  real `SaharaClient`/`SpeechProvider` exists, but no Sahara API
  credentials or documentation exist in this environment — it honestly
  returns `503 service_not_configured` rather than a fake transcript.
- ✅ **Phase 4 — AI conversation agent (built, LLM-gated)**: a real
  `ConversationAgent` does structured extraction/intent/follow-up
  suggestion, gated on `LLM_API_KEY` (also unset here) with the same
  honest-failure pattern.
- ✅ **Phase 5 — Conversation memory**: `SessionState` carries accumulated
  `MedicalState` + turn history.
- ✅ **Phase 6 — Safety/triage engine (fully real, no credentials needed)**:
  deterministic keyword-based red-flag detection, unit/endpoint tested.
- ✅ **Phase 8 (partial)** — `/api/conversation/message` combines agent +
  triage + memory, with triage always overriding the agent during an
  emergency.
- ⏸️ **Phases 7, 9, 12–14 remain deferred**: YarnGPT, facility search, the
  benchmark harness, and full e2e testing — blocked on real credentials
  this environment doesn't have.

### Frontend (`frontend/`) — mock-only product simulation

A separate, later phase: **the entire authenticated product
(`/app/*`)** — dashboard, voice consultation, triage checker, facilities,
history, language settings, research, profile, settings — was rebuilt as a
complete, navigable mock product per a later product-simulation brief. It
runs on `services/mock*.ts` / `lib/mock/*.ts`, not on the backend above —
no `fetch()` calls to `localhost:8000` happen anywhere in this phase, so
the product works standalone. Real login/signup, real Sahara transcription,
real LLM reasoning, real facility search, and a real benchmark run are all
still outstanding; `FEATURE_STATUS.md` maps each mock service to exactly
what replacing it with the code above will involve.

Verified end-to-end with a headless-browser click-through: signup → login
→ dashboard → a full 4-turn voice consultation (real microphone capture,
scripted transcript/replies, real client-side triage logic) → a triage
assessment matching the backend's own wording exactly.

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

Visit `http://localhost:3000`. The backend does **not** need to be running
for the current mock-only product — see "Current status" above and
`FEATURE_STATUS.md`. `NEXT_PUBLIC_API_BASE_URL` (default
`http://localhost:8000`) only matters once mock services start being
swapped for real `fetch()` calls in `lib/api.ts`.

## Environment variables

See `.env.example` at the repo root. `SAHARA_API_KEY`/`SAHARA_API_URL` and
`LLM_API_KEY`/`LLM_API_URL` are both read today (by the Sahara client and
the agent's `LLMClient`, respectively) — neither is set in this
environment, so both honestly report "not configured" rather than working.
`YARNGPT_API_KEY`, `FACILITY_API_KEY`, and `DATABASE_URL` are declared for
future phases and currently unused.

## Project structure

```
frontend/    Next.js + TypeScript
             (marketing)/  public site — home, how it works, research, about
             login/, signup/   mock auth
             app/              authenticated product (dashboard, consultation,
                                triage, facilities, history, language, research,
                                profile, settings) — mock-only, see FEATURE_STATUS.md
backend/     FastAPI — voice upload, Sahara client, agent, triage engine,
             stubbed routers for phases not yet built (not called by the
             frontend during the current mock-only phase)
benchmark/   Evaluation dataset scaffold (empty until Phase 12)
```

See `FEATURE_STATUS.md` for the feature-by-feature mock → real mapping.

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
- The authenticated app (`/app/*`) currently runs entirely on mock
  services (no `fetch()` calls to the backend at all) — see
  `FEATURE_STATUS.md`. Authentication, voice input/output, conversation
  reasoning, facility search, and benchmark results are all mocked there.

## Future work

Phases 7, 9–14 above, in order — most immediately, real Sahara and LLM
provider credentials/API documentation to unblock live verification of the
agent and Sahara integration and everything that depends on them.

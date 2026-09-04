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
- ⏸️ **Phases 4–14 are deferred** pending real Sahara API docs/credentials:
  the AI agent, conversation memory, the safety/triage engine, YarnGPT,
  the full pipeline, facility search, demo/live-mode backend integration,
  the benchmark harness, UX polish, and end-to-end testing.

A **Demo Mode** exists on `/app` today: it replays one of four scripted
code-switched scenarios (English+Pidgin, +Yoruba, +Igbo, +Hausa) through
the same conversation UI a live Sahara response would use, but stays
visibly labeled **"Fixture — pipeline replay"** throughout — it is not a
live Sahara call, and the code says so.

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

See `.env.example` at the repo root. Only `SAHARA_API_KEY`/`SAHARA_API_URL`
are used by anything today; the rest (`YARNGPT_API_KEY`, `LLM_API_KEY`,
`FACILITY_API_KEY`, `DATABASE_URL`) are declared for future phases and
currently unused.

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
- No AI agent, conversation memory, safety/triage engine, voice synthesis,
  or facility search yet.
- No persistence — sessions are in-memory and reset when the backend
  restarts.
- Demo Mode is a labeled fixture replay, not a live pipeline run.

## Future work

Phases 4–14 above, in order — most immediately, real Sahara credentials
and API documentation to unblock Phase 3 verification and everything after
it.

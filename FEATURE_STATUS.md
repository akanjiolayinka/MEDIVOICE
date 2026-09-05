# MediVoice — feature status

This tracks, per feature, what's real today vs. mocked, and exactly what
swapping in the real implementation later involves. It exists so nobody has
to reverse-engineer "is this real?" from reading component code.

## Current phase: wiring mocks to the real backend, one at a time

Demo Mode on `/app/consultation` still runs entirely on the mock services
in `frontend/src/services/mock*.ts` and data in `frontend/src/lib/mock/*.ts`
— no network calls, works standalone. **Live Mode is now wired to the real
backend for voice input**: it records real audio and posts it to the real
`POST /api/voice/process` (Sahara), then chains into the real
`POST /api/conversation/message` (agent + triage) if that succeeds. Neither
`SAHARA_API_KEY` nor `LLM_API_KEY` exist in this environment, so Live Mode
currently — and correctly — stops at Sahara with an honest "not configured"
banner (verified live: a real recording produces a real `503
service_not_configured` response, not a fabricated transcript). The rest of
the authenticated app still runs on mocks; wiring each remaining one is the
next phase of work.

**Running Live Mode locally requires the backend running** (`cd backend &&
uvicorn app.main:app --reload`) at `NEXT_PUBLIC_API_BASE_URL` (default
`http://localhost:8000`) — Demo Mode does not.

| Feature | Current | Future (real) |
|---|---|---|
| Authentication | `components/auth/AuthProvider.tsx` — a `MockUser` in `localStorage`, no real password check | A real auth provider/session backend; `/login` and `/signup` submit to it instead of `AuthProvider.login/signup` |
| Voice input (transcription + language ID) | **Live Mode: real**, via `lib/api.ts::uploadVoice` → `POST /api/voice/process` → `backend/app/services/sahara/client.py::SaharaClient` (gated on `SAHARA_API_KEY`, currently unset → honest 503). **Demo Mode: still mock** — `services/mockVoiceService.ts::mockTranscribe` returns the active scenario's next scripted line, ignoring the actual recorded audio | Add `SAHARA_API_KEY` + confirm the real Sahara CodeSwitch request/response contract against `client.py`'s placeholder shape |
| Conversation reasoning (extraction, follow-up questions, intent) | **Live Mode: real** (once Sahara succeeds), via `lib/api.ts::sendMessage` → `POST /api/conversation/message` → `backend/app/services/agent/` (gated on `LLM_API_KEY`, currently unset → honest 503). **Demo Mode: still mock** — `services/mockConversationService.ts::mockGetNextAgentTurn` walks a hand-authored scripted scenario | Add `LLM_API_KEY` + pick/confirm the real LLM provider against `llm_client.py`'s placeholder shape |
| Safety / triage | `services/mockTriageService.ts::mockAssessTriage` — a client-side port of the same deterministic keyword rules as the real engine, kept in sync on purpose | `backend/app/services/triage/rules.py` (already built, needs no credentials at all) via `POST /api/triage/assess`; frontend swap point is `lib/api.ts::assessTriage` (already written, currently unused) |
| Voice output (speaking responses aloud) | `services/mockVoiceOutputService.ts::speakMock` — real browser Web Speech API (`SpeechSynthesis`), not a fabricated animation, but not YarnGPT's voice and doesn't really speak Yoruba/Igbo/Hausa | `backend/app/services/yarngpt/` (Phase 7 stub — not yet implemented even on the backend) |
| Healthcare facility search | `services/mockFacilityService.ts` — filters a hard-coded list in `lib/mock/facilities.ts` | A real maps/places provider (`backend/app/services/facilities/`, Phase 9 stub — not yet implemented) |
| Benchmark / research | `lib/mock/benchmark.ts` — clearly labeled demo data (`BENCHMARK_DATA_LABEL`), rendered on `/app/research` | `backend/app/services/benchmark/` (Phase 12 stub) plus the `benchmark/` dataset scaffold at the repo root — neither populated yet |
| Consultation history & summaries | `lib/mock/consultations.ts` — `localStorage`-backed records created client-side when a mock consultation finishes | Persisted server-side (Postgres, per the backend README's Phase 5+ note) once accounts are real |

## Why this split is safe to build on

Every mock service's function signature already matches its real
counterpart's request/response shape (`MedicalState`, `TriageResult`,
`SaharaResult`-style results — see `frontend/src/lib/types.ts`). Swapping a
mock for the real thing later means changing what's *inside* the service
function, not the UI that calls it.

## Not yet built anywhere (mock or real)

- Real facility/maps provider (Phase 9)
- YarnGPT voice synthesis (Phase 7)
- Benchmark harness that actually runs Sahara against other models (Phase 12)
- Server-side persistence for accounts/consultations

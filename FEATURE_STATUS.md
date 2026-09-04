# MediVoice — feature status

This tracks, per feature, what's real today vs. mocked, and exactly what
swapping in the real implementation later involves. It exists so nobody has
to reverse-engineer "is this real?" from reading component code.

## Current phase: mock-only product simulation

The authenticated app (`/app/*`) currently runs entirely on the mock
services in `frontend/src/services/mock*.ts` and data in
`frontend/src/lib/mock/*.ts`. **No frontend code in this phase calls the
FastAPI backend.** That backend (`backend/`) is real, tested infrastructure
built in an earlier phase — it's just not wired to the UI yet. Wiring each
mock service to its real backend counterpart, one at a time, is the next
phase of work.

| Feature | Current (mock) | Future (real) |
|---|---|---|
| Authentication | `components/auth/AuthProvider.tsx` — a `MockUser` in `localStorage`, no real password check | A real auth provider/session backend; `/login` and `/signup` submit to it instead of `AuthProvider.login/signup` |
| Voice input (transcription + language ID) | `services/mockVoiceService.ts::mockTranscribe` — returns the active demo scenario's next scripted line after a simulated delay; ignores the actual recorded audio | `backend/app/services/sahara/client.py::SaharaClient` (already built, gated on `SAHARA_API_KEY`) via `POST /api/voice/process`; frontend swap point is `frontend/src/lib/api.ts::uploadVoice` (already written, currently unused) |
| Conversation reasoning (extraction, follow-up questions, intent) | `services/mockConversationService.ts::mockGetNextAgentTurn` — walks a hand-authored scripted scenario in `lib/mock/conversations.ts` | `backend/app/services/agent/` (already built, gated on `LLM_API_KEY`) via `POST /api/conversation/message`; frontend swap point is `lib/api.ts::sendMessage` (already written, currently unused) |
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

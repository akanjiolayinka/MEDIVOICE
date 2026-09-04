import type { DemoFixture } from "@/lib/types";

// Fixture — pipeline replay data for Demo Mode.
//
// These are NOT live Sahara responses: no real Sahara credentials exist in
// this environment yet (see backend/app/services/sahara/client.py). Each
// entry only carries the shape a real SaharaResult would have (transcript +
// detected languages + confidence) — no agent reply, triage result, or
// downstream action is fabricated here, since the agent (Phase 4) and
// triage engine (Phase 6) don't exist yet. Selecting a fixture on /app
// drives the same conversation UI a live transcription would, with a
// persistent "Fixture — pipeline replay" badge visible throughout, per the
// master build prompt's rule #36 exception for explicitly labeled fixtures.
// NOTE: the Yoruba/Igbo/Hausa phrases below are illustrative code-switched
// samples, not verified by a native speaker. Get a native-speaker accuracy
// review before using these beyond an internal demo.
export const demoFixtures: DemoFixture[] = [
  {
    id: "english-pidgin",
    title: "English + Pidgin — Headache & fever",
    languages: ["English", "Nigerian Pidgin"],
    result: {
      transcript:
        "My head dey pain me since yesterday, and my body dey hot. I also dey feel weak.",
      languages: ["en", "pcm"],
      confidence: 0.91,
    },
  },
  {
    id: "english-yoruba",
    title: "English + Yoruba — Weakness & dizziness",
    languages: ["English", "Yoruba"],
    result: {
      transcript:
        "I've been feeling weak since morning, mo si n feel dizzy anytime mo ba duro.",
      languages: ["en", "yo"],
      confidence: 0.88,
    },
  },
  {
    id: "english-igbo",
    title: "English + Igbo — Sample consultation",
    languages: ["English", "Igbo"],
    result: {
      transcript:
        "Afo na-eme m nsogbu since last night, and I've vomited twice this morning.",
      languages: ["en", "ig"],
      confidence: 0.85,
    },
  },
  {
    id: "english-hausa",
    title: "English + Hausa — Sample consultation",
    languages: ["English", "Hausa"],
    result: {
      transcript:
        "Ina jin zafi a kirji since yesterday, and I've been coughing a lot too.",
      languages: ["en", "ha"],
      confidence: 0.83,
    },
  },
];

# MediVoice benchmark dataset

This directory is a scaffold, populated in **Phase 12** of the master build
plan (see repo root `README.md`). It is not populated yet — no samples,
ground truth, or results exist here, and the `/benchmark` page in the
frontend deliberately shows "awaiting benchmark run" rather than fabricated
numbers until this is built.

Layout:

```
samples/{english,pidgin,yoruba,igbo,hausa,code_switched}/
ground_truth/
results/
scripts/
```

Each sample (once added) should look like:

```json
{
  "id": "sample_001",
  "audio": "...",
  "transcript": "...",
  "languages": ["en", "pcm", "yo"],
  "expected_symptoms": [],
  "expected_intent": ""
}
```

`scripts/` will hold the code that computes WER (overall + per-language +
code-switched), symptom-extraction precision/recall/F1, intent accuracy,
task completion rate, and end-to-end latency, and that runs the same
evaluation set against Sahara and at least two other speech models via the
`SpeechProvider` interface in `backend/app/services/sahara/interface.py`.

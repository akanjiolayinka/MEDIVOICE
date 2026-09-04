// STUB — the deterministic safety/triage engine is Phase 6 of the master
// build plan (backend/app/services/triage/). Nothing here should invent a
// triage outcome; it only tells the user what stage the product is at.

export default function TriageResult() {
  return (
    <div className="rounded-2xl border border-muted-200 bg-white/60 p-6 text-center">
      <p className="text-sm font-medium">Your assessment</p>
      <p className="mt-2 text-sm text-muted-500">
        The safety/triage engine isn&rsquo;t implemented yet — this will show
        a structured assessment (reported symptoms, urgency, and a
        recommended next step) once Phase 6 is built.
      </p>
    </div>
  );
}

// STUB — consultation summary generation depends on the AI agent (Phase 4)
// and conversation memory (Phase 5), neither of which exist yet. This
// placeholder tells the user what's coming rather than fabricating a
// summary.

export default function ConsultationSummary() {
  return (
    <div className="rounded-2xl border border-muted-200 bg-white/60 p-6 text-center">
      <p className="text-sm font-medium">Consultation summary</p>
      <p className="mt-2 text-sm text-muted-500">
        This will show a generated summary — reported symptoms, duration,
        severity and a suggested next step — once the AI agent (Phase 4) and
        conversation memory (Phase 5) are built.
      </p>
    </div>
  );
}

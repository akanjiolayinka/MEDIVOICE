import type { TriageResult as TriageResultType } from "@/lib/types";

const URGENCY_LABELS: Record<string, string> = {
  routine: "Routine",
  prompt: "Prompt medical attention",
  emergency: "Seek emergency care",
};

export default function TriageResult({ triage }: { triage: TriageResultType }) {
  return (
    <div
      className={`w-full max-w-md rounded-2xl border p-6 text-center ${
        triage.recommend_emergency_care
          ? "border-accent-600 bg-accent-100/60"
          : "border-muted-200 bg-white"
      }`}
    >
      <p className="text-sm font-medium">Your assessment</p>
      <p className="mt-2 text-lg font-semibold text-primary-700">
        {URGENCY_LABELS[triage.urgency] ?? triage.urgency}
      </p>
      <p className="mt-2 text-sm text-muted-500">{triage.message}</p>

      {triage.red_flags.length > 0 && (
        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {triage.red_flags.map((flag) => (
            <li
              key={flag}
              className="rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-700"
            >
              {flag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

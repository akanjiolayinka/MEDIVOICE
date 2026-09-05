import type { TriageResult } from "@/lib/types";
import UrgencyBadge from "@/components/triage/UrgencyBadge";

export default function TriageCard({ triage }: { triage: TriageResult }) {
  return (
    <div
      className={`w-full rounded-2xl border p-6 ${
        triage.recommend_emergency_care ? "border-red-200 bg-red-50" : "border-muted-200 bg-white"
      }`}
    >
      <p className="text-sm font-medium">Your assessment</p>
      <div className="mt-2">
        <UrgencyBadge urgency={triage.urgency} />
      </div>
      <p className="mt-3 text-sm text-muted-500">{triage.message}</p>

      {triage.red_flags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {triage.red_flags.map((flag) => (
            <li key={flag} className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
              {flag}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-xs text-muted-500">
        MediVoice provides informational guidance and does not replace professional medical advice.
      </p>
    </div>
  );
}

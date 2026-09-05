import Link from "next/link";
import type { ConsultationRecord } from "@/lib/mock/consultations";
import UrgencyBadge from "@/components/triage/UrgencyBadge";

function formatDate(iso: string): string {
  const date = new Date(iso);
  const isToday = date.toDateString() === new Date().toDateString();
  if (isToday) return "Today";
  return date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

export default function ConsultationCard({ consultation }: { consultation: ConsultationRecord }) {
  return (
    <div className="rounded-2xl border border-muted-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-500">{formatDate(consultation.date)}</span>
        <span className="text-xs font-medium capitalize text-primary-700">{consultation.status}</span>
      </div>

      <h3 className="mt-2 font-medium">{consultation.mainConcern}</h3>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-500">
        <span>{consultation.languages.join(" + ")}</span>
        <span aria-hidden>&middot;</span>
        <span>{consultation.duration}</span>
      </div>

      <div className="mt-3">
        <UrgencyBadge urgency={consultation.triageUrgency} />
      </div>

      <Link
        href={`/app/summary/${consultation.id}`}
        className="mt-4 inline-block text-sm font-medium text-primary-700 hover:text-primary-900"
      >
        View consultation →
      </Link>
    </div>
  );
}

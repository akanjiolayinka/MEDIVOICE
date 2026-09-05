import type { Urgency } from "@/lib/types";

const URGENCY_CONFIG: Record<Urgency, { label: string; className: string }> = {
  routine: { label: "Self-care / Monitor", className: "bg-primary-50 text-primary-700" },
  prompt: { label: "Prompt medical attention", className: "bg-accent-100 text-accent-700" },
  emergency: { label: "Emergency", className: "bg-red-100 text-red-700" },
};

export default function UrgencyBadge({ urgency, className = "" }: { urgency: Urgency; className?: string }) {
  const config = URGENCY_CONFIG[urgency];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
}

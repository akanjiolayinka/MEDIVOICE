import type { MedicalState, TriageResult } from "@/lib/types";

const URGENCY_LABELS: Record<string, string> = {
  routine: "Routine",
  prompt: "Prompt medical attention",
  emergency: "Seek emergency care",
};

export default function ConsultationSummary({
  medicalState,
  triage,
}: {
  medicalState: MedicalState;
  triage: TriageResult;
}) {
  const symptoms = [...medicalState.symptoms, ...medicalState.additional_symptoms];

  const rows: { label: string; value: string }[] = [
    { label: "Reported symptoms", value: symptoms.join(", ") || "None reported" },
    { label: "Duration", value: medicalState.duration || "Not specified" },
    { label: "Reported temperature", value: medicalState.temperature || "Not specified" },
    {
      label: "Red flags",
      value: triage.red_flags.length > 0 ? triage.red_flags.join(", ") : "None reported",
    },
    { label: "Urgency", value: URGENCY_LABELS[triage.urgency] ?? triage.urgency },
  ];

  return (
    <div className="w-full max-w-md rounded-2xl border border-muted-200 bg-white p-6">
      <p className="text-sm font-medium">Consultation summary</p>
      <dl className="mt-4 space-y-3 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4">
            <dt className="text-muted-500">{row.label}</dt>
            <dd className="text-right font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs text-muted-500">
        This is a summary, not a diagnosis.
      </p>
    </div>
  );
}

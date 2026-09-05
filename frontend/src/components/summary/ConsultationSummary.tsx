"use client";

import { useState } from "react";
import type { ConsultationRecord } from "@/lib/mock/consultations";
import UrgencyBadge from "@/components/triage/UrgencyBadge";
import { CopyIcon, DownloadIcon, PlayIcon, ShareIcon, CheckIcon } from "@/components/icons";
import { speakMock } from "@/services/mockVoiceOutputService";

function buildSummaryText(record: ConsultationRecord): string {
  const symptoms = [...record.symptoms, ...record.additionalSymptoms];
  return [
    "CONSULTATION SUMMARY",
    "",
    "Chief concerns:",
    ...symptoms.map((s) => `• ${s}`),
    "",
    `Duration: ${record.duration}`,
    `Severity: ${record.severity}`,
    record.temperature ? `Reported temperature: ${record.temperature}` : null,
    `Language: ${record.languages.join(" + ")}`,
    "",
    `Red flags: ${record.redFlags.length > 0 ? record.redFlags.join(", ") : "None reported during assessment"}`,
    "",
    `Suggested next step: ${record.triageMessage}`,
    "",
    "Conversation notes:",
    record.conversationNotes,
    "",
    "This is a summary, not a diagnosis. MediVoice provides informational guidance and does not replace professional medical advice.",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

export default function ConsultationSummary({ record }: { record: ConsultationRecord }) {
  const [copied, setCopied] = useState(false);
  const summaryText = buildSummaryText(record);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can fail (permissions, insecure context) — fail quietly.
    }
  };

  const handleDownload = () => {
    const blob = new Blob([summaryText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `medivoice-summary-${record.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "MediVoice consultation summary", text: summaryText });
      } catch {
        // User cancelled the share sheet — nothing to do.
      }
    } else {
      await handleCopy();
    }
  };

  return (
    <div className="rounded-3xl border border-muted-200 bg-white p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Consultation Summary</h2>
        <UrgencyBadge urgency={record.triageUrgency} />
      </div>

      <dl className="mt-6 space-y-5 text-sm">
        <div>
          <dt className="font-medium text-muted-500">Main concern</dt>
          <dd className="mt-1 capitalize">{record.mainConcern}</dd>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <dt className="font-medium text-muted-500">Duration</dt>
            <dd className="mt-1">{record.duration}</dd>
          </div>
          <div>
            <dt className="font-medium text-muted-500">Severity</dt>
            <dd className="mt-1">{record.severity}</dd>
          </div>
        </div>
        <div>
          <dt className="font-medium text-muted-500">Symptoms mentioned</dt>
          <dd className="mt-1">
            <ul className="list-inside list-disc space-y-0.5">
              {[...record.symptoms, ...record.additionalSymptoms].map((symptom) => (
                <li key={symptom}>{symptom}</li>
              ))}
            </ul>
          </dd>
        </div>
        {record.temperature && (
          <div>
            <dt className="font-medium text-muted-500">Additional information</dt>
            <dd className="mt-1">Temperature: {record.temperature}</dd>
          </div>
        )}
        <div>
          <dt className="font-medium text-muted-500">Language</dt>
          <dd className="mt-1">{record.languages.join(" + ")}</dd>
        </div>
        <div>
          <dt className="font-medium text-muted-500">Triage</dt>
          <dd className="mt-1">{record.triageMessage}</dd>
        </div>
        <div>
          <dt className="font-medium text-muted-500">Conversation notes</dt>
          <dd className="mt-1 text-muted-500">{record.conversationNotes}</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap gap-2 border-t border-muted-200 pt-6">
        <button
          type="button"
          onClick={() => speakMock(summaryText)}
          className="inline-flex items-center gap-1.5 rounded-full border border-muted-200 px-3.5 py-2 text-sm font-medium hover:border-primary-600 hover:text-primary-700"
        >
          <PlayIcon className="h-4 w-4" /> Play summary
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-full border border-muted-200 px-3.5 py-2 text-sm font-medium hover:border-primary-600 hover:text-primary-700"
        >
          {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
          {copied ? "Copied" : "Copy summary"}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 rounded-full border border-muted-200 px-3.5 py-2 text-sm font-medium hover:border-primary-600 hover:text-primary-700"
        >
          <DownloadIcon className="h-4 w-4" /> Download
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-full border border-muted-200 px-3.5 py-2 text-sm font-medium hover:border-primary-600 hover:text-primary-700"
        >
          <ShareIcon className="h-4 w-4" /> Share
        </button>
      </div>

      <p className="mt-4 text-xs text-muted-500">
        Do not include unnecessary personally identifying information when sharing this summary.
      </p>
    </div>
  );
}

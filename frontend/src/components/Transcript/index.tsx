"use client";

import { useState } from "react";
import LanguageIndicator from "@/components/LanguageIndicator";

export default function Transcript({
  transcript,
  languages,
}: {
  transcript: string | null;
  languages: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-md">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={!transcript}
        className="text-sm font-medium text-primary-700 hover:text-primary-900 disabled:text-muted-500"
      >
        {open ? "Hide transcript" : "View transcript"}
      </button>

      {open && (
        <div className="mt-3 rounded-2xl border border-muted-200 bg-white/60 p-4">
          <p className="text-xs font-medium text-muted-500">You</p>
          <p className="mt-1 text-sm italic">
            {transcript ? `"${transcript}"` : "Awaiting transcription…"}
          </p>
          <div className="mt-3">
            <LanguageIndicator codes={languages} />
          </div>
        </div>
      )}
    </div>
  );
}

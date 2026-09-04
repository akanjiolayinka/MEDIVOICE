"use client";

import { useEffect, useMemo, useRef } from "react";

export default function AudioPlayer({ blob }: { blob: Blob | null }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const url = useMemo(() => (blob ? URL.createObjectURL(blob) : null), [blob]);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  if (!url) return null;

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => audioRef.current?.play()}
        className="inline-flex items-center gap-2 rounded-full border border-muted-200 px-4 py-2 text-sm font-medium hover:border-primary-600 hover:text-primary-700"
      >
        ▶ Play recording
      </button>
      <audio ref={audioRef} src={url} className="hidden" />
    </div>
  );
}

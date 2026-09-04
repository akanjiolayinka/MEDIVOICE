import LanguageChips from "@/components/ui/LanguageChips";

export default function HeroMicCard() {
  return (
    <div className="w-full max-w-sm rounded-3xl border border-muted-200 bg-white/70 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">MediVoice</span>
        <span className="flex items-center gap-1.5 text-xs font-medium text-primary-700">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
          Listening
        </span>
      </div>

      <div className="my-6 flex h-16 items-end justify-center gap-1">
        {[6, 12, 20, 14, 24, 10, 18, 8, 16, 22, 12, 6].map((h, i) => (
          <span
            key={i}
            className="w-1.5 rounded-full bg-primary-600/70"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>

      <p className="text-sm italic text-muted-500">
        &ldquo;My head dey pain me...&rdquo;
      </p>

      <LanguageChips
        languages={["English", "Nigerian Pidgin"]}
        className="mt-4"
      />
    </div>
  );
}

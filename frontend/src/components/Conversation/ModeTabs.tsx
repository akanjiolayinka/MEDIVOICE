export type Mode = "live" | "demo";

export default function ModeTabs({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (mode: Mode) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-muted-200 bg-white/60 p-1">
      <button
        type="button"
        onClick={() => onChange("live")}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          mode === "live"
            ? "bg-primary-600 text-white"
            : "text-muted-500 hover:text-foreground"
        }`}
      >
        Live Mode
      </button>
      <button
        type="button"
        onClick={() => onChange("demo")}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          mode === "demo"
            ? "bg-primary-600 text-white"
            : "text-muted-500 hover:text-foreground"
        }`}
      >
        Demo Mode
      </button>
    </div>
  );
}

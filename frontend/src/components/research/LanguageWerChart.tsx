import type { BenchmarkByLanguageRow } from "@/lib/mock/benchmark";

// Categorical series colors validated for this exact 3-slot use (all-pairs
// safe, not just adjacent) via the dataviz skill's palette validator —
// distinct from the site's brand tokens, which aren't chart-safe at this
// saturation. Keep this order fixed; never cycle or reassign per filter.
const SERIES = [
  { key: "sahara" as const, label: "Sahara", color: "#2a78d6" },
  { key: "modelB" as const, label: "Model B", color: "#eb6834" },
  { key: "modelC" as const, label: "Model C", color: "#1baf7a" },
];

export default function LanguageWerChart({ rows }: { rows: BenchmarkByLanguageRow[] }) {
  const maxValue = Math.max(...rows.flatMap((row) => [row.sahara, row.modelB, row.modelC]));

  return (
    <div className="rounded-2xl border border-muted-200 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {SERIES.map((series) => (
          <span key={series.key} className="flex items-center gap-1.5 text-xs text-muted-500">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: series.color }} />
            {series.label}
          </span>
        ))}
      </div>

      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.language}>
            <p className="mb-1 text-xs font-medium text-muted-500">{row.language}</p>
            <div className="space-y-1">
              {SERIES.map((series) => {
                const value = row[series.key];
                const widthPct = (value / maxValue) * 100;
                return (
                  <div key={series.key} className="flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-muted-100">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${widthPct}%`, backgroundColor: series.color }}
                      />
                    </div>
                    <span className="w-12 shrink-0 text-right text-xs text-muted-500">{value}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-500">Word Error Rate by language — lower is better.</p>
    </div>
  );
}

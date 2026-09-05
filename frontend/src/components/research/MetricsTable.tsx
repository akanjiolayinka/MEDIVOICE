import type { BenchmarkMetricRow } from "@/lib/mock/benchmark";

function bestModel(row: BenchmarkMetricRow): "sahara" | "modelB" | "modelC" {
  const values: [("sahara" | "modelB" | "modelC"), number][] = [
    ["sahara", row.sahara],
    ["modelB", row.modelB],
    ["modelC", row.modelC],
  ];
  values.sort((a, b) => (row.lowerIsBetter ? a[1] - b[1] : b[1] - a[1]));
  return values[0][0];
}

export default function MetricsTable({ rows }: { rows: BenchmarkMetricRow[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-muted-200 bg-white">
      <table className="w-full min-w-[520px] text-sm">
        <thead>
          <tr className="border-b border-muted-200 text-left text-xs font-medium text-muted-500">
            <th className="px-4 py-3">Metric</th>
            <th className="px-4 py-3">Sahara</th>
            <th className="px-4 py-3">Model B</th>
            <th className="px-4 py-3">Model C</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const best = bestModel(row);
            return (
              <tr key={row.metric} className="border-b border-muted-200 last:border-0">
                <td className="px-4 py-3 font-medium">{row.metric}</td>
                {(["sahara", "modelB", "modelC"] as const).map((key) => (
                  <td
                    key={key}
                    className={`px-4 py-3 ${best === key ? "font-semibold text-primary-700" : "text-muted-500"}`}
                  >
                    {row[key]}
                    {row.unit}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

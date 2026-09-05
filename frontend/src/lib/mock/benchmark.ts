// DEMO DATA ONLY. None of the numbers below come from a real benchmark
// run — no real Sahara/Model B/Model C evaluation has been executed
// against real audio yet (master build prompt §20/§29: never invent real
// results; when placeholder values are shown, they must be clearly
// labeled as demo/mock). Every consumer of this file MUST surface
// `BENCHMARK_DATA_LABEL` next to any number drawn from here. When a real
// benchmark pipeline exists, this file's shape stays the same so the UI
// doesn't need to change — only the source of the numbers does.

export const BENCHMARK_DATA_LABEL = "Demo data — illustrative only, not a real benchmark run";

export type BenchmarkModel = "sahara" | "modelB" | "modelC";

export interface BenchmarkMetricRow {
  metric: string;
  unit: string;
  lowerIsBetter: boolean;
  sahara: number;
  modelB: number;
  modelC: number;
}

export const overallBenchmarkMetrics: BenchmarkMetricRow[] = [
  { metric: "Word Error Rate", unit: "%", lowerIsBetter: true, sahara: 18.4, modelB: 27.1, modelC: 31.9 },
  {
    metric: "Language ID accuracy",
    unit: "%",
    lowerIsBetter: false,
    sahara: 91.2,
    modelB: 78.6,
    modelC: 74.3,
  },
  {
    metric: "Symptom extraction F1",
    unit: "%",
    lowerIsBetter: false,
    sahara: 84.7,
    modelB: 71.2,
    modelC: 65.8,
  },
  { metric: "Intent accuracy", unit: "%", lowerIsBetter: false, sahara: 88.9, modelB: 76.4, modelC: 70.1 },
  {
    metric: "Task completion rate",
    unit: "%",
    lowerIsBetter: false,
    sahara: 82.3,
    modelB: 64.7,
    modelC: 58.2,
  },
  {
    metric: "End-to-end latency",
    unit: "ms",
    lowerIsBetter: true,
    sahara: 1420,
    modelB: 1180,
    modelC: 980,
  },
];

export interface BenchmarkByLanguageRow {
  language: string;
  sahara: number;
  modelB: number;
  modelC: number;
}

// Word Error Rate (%) broken down by language/code-switching condition.
export const wordErrorRateByLanguage: BenchmarkByLanguageRow[] = [
  { language: "English", sahara: 9.1, modelB: 12.4, modelC: 14.2 },
  { language: "Nigerian Pidgin", sahara: 16.8, modelB: 29.7, modelC: 34.1 },
  { language: "Yoruba", sahara: 19.3, modelB: 33.5, modelC: 38.9 },
  { language: "Igbo", sahara: 21.6, modelB: 35.2, modelC: 41.4 },
  { language: "Hausa", sahara: 20.2, modelB: 34.0, modelC: 39.7 },
  { language: "Code-switched", sahara: 24.9, modelB: 41.8, modelC: 48.3 },
];

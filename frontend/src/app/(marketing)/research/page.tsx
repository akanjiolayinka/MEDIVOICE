import Container from "@/components/layout/Container";
import Badge from "@/components/ui/Badge";

// TODO(Phase 12): populate real benchmark results from `benchmark/results/`.
// Never invent numbers here — this page must say "awaiting benchmark run"
// until a real evaluation has actually been executed.

const metrics = [
  "Word Error Rate",
  "Symptom Extraction F1",
  "Intent Accuracy",
  "Task Completion",
  "End-to-End Latency",
];

export const metadata = {
  title: "Research — MediVoice",
};

export default function Benchmark() {
  return (
    <Container className="max-w-2xl py-20">
      <Badge tone="accent">Awaiting benchmark run</Badge>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
        Building for real-world speech, not perfect transcripts.
      </h1>
      <p className="mt-4 text-muted-500">
        Code-switching is difficult to evaluate with a single accuracy
        number. MediVoice will measure how different speech systems perform
        across languages, code-switched speech and downstream healthcare
        tasks — benchmarking Sahara against at least two other speech
        models using the same evaluation set.
      </p>

      <ul className="mt-10 grid gap-3 sm:grid-cols-2">
        {metrics.map((metric) => (
          <li
            key={metric}
            className="rounded-xl border border-muted-200 bg-white/60 px-4 py-3 text-sm"
          >
            <span className="font-medium">{metric}</span>
            <span className="ml-2 text-muted-500">— awaiting benchmark run</span>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-muted-500">
        No results have been fabricated. This page will populate once a real
        benchmark run against the evaluation dataset in{" "}
        <code className="rounded bg-muted-100 px-1 py-0.5">benchmark/</code>{" "}
        has been completed.
      </p>
    </Container>
  );
}

import Container from "@/components/layout/Container";
import Badge from "@/components/ui/Badge";
import MetricsTable from "@/components/research/MetricsTable";
import LanguageWerChart from "@/components/research/LanguageWerChart";
import { overallBenchmarkMetrics, wordErrorRateByLanguage, BENCHMARK_DATA_LABEL } from "@/lib/mock/benchmark";

export default function ResearchAppPage() {
  return (
    <Container className="max-w-3xl py-10">
      <Badge tone="accent">{BENCHMARK_DATA_LABEL}</Badge>
      <h1 className="mt-3 text-xl font-semibold tracking-tight">Speech Benchmark</h1>
      <p className="mt-1 text-sm text-muted-500">
        This is what the benchmark comparison will look like once real evaluation data exists.
        Every number on this page is illustrative demo data — Sahara has not yet been benchmarked
        against Model B or Model C on real audio.
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold">Overall metrics</h2>
        <div className="mt-3">
          <MetricsTable rows={overallBenchmarkMetrics} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold">Word Error Rate by language</h2>
        <div className="mt-3">
          <LanguageWerChart rows={wordErrorRateByLanguage} />
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-muted-200 bg-muted-100/60 p-5 text-sm text-muted-500">
        <p className="font-medium text-foreground">Why this matters</p>
        <p className="mt-1">
          A transcription can look correct while still producing a poor healthcare interaction.
          MediVoice&rsquo;s real benchmark (once run) will evaluate the full pipeline — speech
          recognition, symptom extraction, intent, task completion, and latency — not just
          transcription accuracy in isolation.
        </p>
      </section>
    </Container>
  );
}

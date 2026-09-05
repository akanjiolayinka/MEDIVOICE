import Container from "@/components/layout/Container";
import Link from "next/link";

const points = [
  "Sahara benchmarked against other speech systems",
  "Evaluated on code-switched African speech",
  "Measured on end-to-end task performance, not transcription alone",
];

export default function ResearchTeaser() {
  return (
    <section className="border-t border-muted-200 bg-muted-100/60 py-20">
      <Container className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Building for real-world speech, not perfect transcripts.
        </h2>
        <ul className="mt-6 space-y-2 text-muted-500">
          {points.map((point) => (
            <li key={point} className="flex gap-2">
              <span aria-hidden>&middot;</span>
              {point}
            </li>
          ))}
        </ul>
        <Link
          href="/research"
          className="mt-6 inline-block text-sm font-medium text-primary-700 hover:text-primary-900"
        >
          See our research approach →
        </Link>
      </Container>
    </section>
  );
}

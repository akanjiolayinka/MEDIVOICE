import Link from "next/link";
import Container from "@/components/layout/Container";

export default function VoiceFirstSection() {
  return (
    <section className="border-t border-muted-200 bg-muted-100/60 py-20">
      <Container className="max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Built around a voice-first experience.
        </h2>
        <p className="mt-4 text-muted-500">
          MediVoice doesn&rsquo;t start with a form full of questions. It
          starts with a conversation. Speak. Listen. Respond. Continue.
        </p>
        <Link
          href="/app"
          className="mt-6 inline-block text-sm font-medium text-primary-700 hover:text-primary-900"
        >
          Start a conversation →
        </Link>
      </Container>
    </section>
  );
}

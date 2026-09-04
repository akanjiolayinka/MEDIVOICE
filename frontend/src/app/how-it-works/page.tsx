import Container from "@/components/layout/Container";
import ArchitectureFlow from "@/components/how-it-works/ArchitectureFlow";
import ExplainerBlock from "@/components/how-it-works/ExplainerBlock";

const explainers = [
  {
    eyebrow: "Sahara",
    title: "Understanding the way people actually speak.",
    body: "Sahara is used as MediVoice's speech/code-switching layer. Instead of assuming that every conversation happens in one language, MediVoice can process speech where languages naturally appear together.",
  },
  {
    eyebrow: "AI Agent",
    title: "Turning conversation into context.",
    body: "The agent keeps track of what the user has already said, extracts relevant information, and decides what question should come next.",
  },
  {
    eyebrow: "Safety engine",
    title: "AI with boundaries.",
    body: "Medical conversations require more than a language model. MediVoice separates conversational intelligence from safety-critical triage rules so that predefined warning signs can trigger appropriate escalation.",
  },
  {
    eyebrow: "YarnGPT",
    title: "Let the response sound natural too.",
    body: "Once MediVoice generates a response, YarnGPT can turn it into spoken output for supported African languages and English, allowing the interaction to remain voice-first from beginning to end.",
  },
];

export const metadata = {
  title: "How it works — MediVoice",
};

export default function HowItWorks() {
  return (
    <>
      <Container className="max-w-2xl py-20 text-center">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          A voice conversation, not another form.
        </h1>
        <p className="mt-4 text-muted-500">
          MediVoice combines speech technology, multilingual AI and
          structured safety checks to turn natural conversation into useful
          healthcare navigation.
        </p>
      </Container>

      <section className="border-t border-muted-200 bg-muted-100/60 py-20">
        <Container>
          <ArchitectureFlow />
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-12 sm:grid-cols-2">
          {explainers.map((item) => (
            <ExplainerBlock key={item.eyebrow} {...item} />
          ))}
        </Container>
      </section>
    </>
  );
}

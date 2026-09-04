import Container from "@/components/layout/Container";
import { MicIcon, GlobeIcon, ActivityIcon, MapPinIcon } from "@/components/icons";

const concepts = [
  {
    icon: MicIcon,
    title: "Voice-first",
    description: "MediVoice starts with a conversation, not a form full of fields to fill in.",
  },
  {
    icon: GlobeIcon,
    title: "Code-switching",
    description: "Built to understand natural switching between English, Pidgin and local languages.",
  },
  {
    icon: ActivityIcon,
    title: "Safety-first",
    description: "A deterministic safety layer runs independently of the conversation, never the other way around.",
  },
  {
    icon: MapPinIcon,
    title: "Healthcare navigation",
    description: "Helps you prepare a summary and find an appropriate next step — not a diagnosis.",
  },
];

export default function ConceptGrid() {
  return (
    <section className="py-20">
      <Container>
        <h2 className="max-w-xl text-2xl font-semibold tracking-tight md:text-3xl">
          Built around how people actually talk about their health.
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {concepts.map((concept) => (
            <div key={concept.title}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                <concept.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-medium">{concept.title}</h3>
              <p className="mt-1.5 text-sm text-muted-500">{concept.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

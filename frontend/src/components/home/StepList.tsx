import Container from "@/components/layout/Container";

const steps = [
  {
    number: "01",
    title: "Speak naturally",
    body: "Tell MediVoice what's happening using your own words.",
  },
  {
    number: "02",
    title: "MediVoice understands",
    body: "Sahara processes the spoken input, including code-switched speech.",
  },
  {
    number: "03",
    title: "Answer follow-up questions",
    body: "MediVoice asks relevant questions to understand your situation better.",
  },
  {
    number: "04",
    title: "Get a structured summary",
    body: "A clear consultation summary you can bring to a healthcare professional.",
  },
  {
    number: "05",
    title: "Find the right next step",
    body: "A safety assessment and, where relevant, a nearby healthcare facility.",
  },
];

export default function StepList() {
  return (
    <section className="border-t border-muted-200 bg-muted-100/60 py-20">
      <Container>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">How it works</h2>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step) => (
            <div key={step.number}>
              <span className="text-sm font-semibold text-primary-700">{step.number}</span>
              <h3 className="mt-2 font-medium">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-500">{step.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

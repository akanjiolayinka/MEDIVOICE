import Container from "@/components/layout/Container";

const steps = [
  {
    number: "01",
    title: "Speak naturally",
    body: "Tell MediVoice what's happening using your own words.",
  },
  {
    number: "02",
    title: "Be understood",
    body: "Sahara processes the spoken input, including code-switched speech.",
  },
  {
    number: "03",
    title: "Get guided",
    body: "MediVoice asks relevant follow-up questions and performs a safety assessment.",
  },
  {
    number: "04",
    title: "Take the next step",
    body: "Get a consultation summary or find a healthcare facility.",
  },
];

export default function StepList() {
  return (
    <section className="py-20">
      <Container>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          From conversation to action.
        </h2>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number}>
              <span className="text-sm font-semibold text-primary-700">
                {step.number}
              </span>
              <h3 className="mt-2 font-medium">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-500">{step.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

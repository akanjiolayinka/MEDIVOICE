import Container from "@/components/layout/Container";

const quotes = [
  {
    label: "English",
    text: "I'm having a headache and I feel weak.",
    emphasized: false,
  },
  {
    label: "Pidgin",
    text: "My body dey hot and I no too dey feel fine.",
    emphasized: false,
  },
  {
    label: "Code-switched",
    text: "My head dey pain me, and mo feel weak too.",
    emphasized: true,
  },
];

export default function QuoteSection() {
  return (
    <section className="border-t border-muted-200 bg-muted-100/60 py-20">
      <Container>
        <h2 className="max-w-2xl text-2xl font-semibold tracking-tight md:text-3xl">
          You shouldn&rsquo;t have to change how you speak to be understood.
        </h2>
        <p className="mt-4 max-w-xl text-muted-500">
          Healthcare doesn&rsquo;t always happen in one language. A
          conversation can move naturally between English, Pidgin and a
          local language without anyone thinking twice. MediVoice is built
          for those conversations.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {quotes.map((q) => (
            <div
              key={q.label}
              className={`rounded-2xl border p-6 ${
                q.emphasized
                  ? "border-primary-600 bg-white shadow-sm"
                  : "border-muted-200 bg-white/60"
              }`}
            >
              <p className="text-xs font-semibold tracking-wide text-primary-700">
                {q.label.toUpperCase()}
              </p>
              <p className="mt-3 text-lg">&ldquo;{q.text}&rdquo;</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

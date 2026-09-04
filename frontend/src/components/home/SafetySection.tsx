import Container from "@/components/layout/Container";

export default function SafetySection() {
  return (
    <section className="border-t border-muted-200 bg-muted-100/60 py-20">
      <Container className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Safety comes before certainty.
        </h2>
        <p className="mt-4 text-muted-500">
          MediVoice is not a doctor and does not diagnose medical conditions.
          Instead, it uses structured safety checks to identify potentially
          urgent situations and guide users toward appropriate professional
          care.
        </p>
      </Container>
    </section>
  );
}

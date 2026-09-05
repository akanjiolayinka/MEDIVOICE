import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export default function FinalCTA() {
  return (
    <section className="py-24">
      <Container className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Have something you need to talk through?
        </h2>
        <p className="mt-2 text-muted-500">Start with your voice.</p>
        <Button href="/login" className="mt-8">
          Try MediVoice
        </Button>
      </Container>
    </section>
  );
}

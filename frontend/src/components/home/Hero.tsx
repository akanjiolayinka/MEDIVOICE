import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import HeroMicCard from "@/components/home/HeroMicCard";

export default function Hero() {
  return (
    <Container className="grid gap-12 py-20 md:grid-cols-2 md:items-center md:py-28">
      <div>
        <p className="text-xs font-semibold tracking-widest text-primary-700">
          VOICE AI FOR AFRICAN HEALTHCARE
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
          Healthcare conversations that sound like home.
        </h1>
        <p className="mt-6 max-w-lg text-lg text-muted-500">
          Speak naturally in English, Nigerian Pidgin, Yoruba, Igbo or Hausa.
          MediVoice understands code-switched conversations, asks the right
          follow-up questions, and helps you take the next step toward care.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button href="/app">Try MediVoice</Button>
          <Button href="/how-it-works" variant="secondary">
            See how it works
          </Button>
        </div>

        <p className="mt-4 text-sm text-muted-500">
          No forms. No complicated menus. Just talk.
        </p>
      </div>

      <div className="flex justify-center md:justify-end">
        <HeroMicCard />
      </div>
    </Container>
  );
}

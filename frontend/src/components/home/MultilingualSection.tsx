import Container from "@/components/layout/Container";
import LanguageChips from "@/components/ui/LanguageChips";

const languages = ["English", "Nigerian Pidgin", "Yoruba", "Igbo", "Hausa"];

export default function MultilingualSection() {
  return (
    <section className="py-20">
      <Container className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Designed for multilingual Africa.
        </h2>
        <LanguageChips
          languages={languages}
          className="mt-8 justify-center"
        />
        <p className="mt-6 text-lg font-medium text-primary-700">
          And the conversations between them.
        </p>
      </Container>
    </section>
  );
}

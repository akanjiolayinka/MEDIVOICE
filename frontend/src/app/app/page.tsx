import Container from "@/components/layout/Container";
import Conversation from "@/components/Conversation";

export const metadata = {
  title: "Try MediVoice",
};

export default function AppScreen() {
  return (
    <Container className="flex max-w-2xl flex-col items-center gap-2 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        Tell MediVoice what&rsquo;s going on.
      </h1>
      <p className="mb-8 text-sm text-muted-500">
        You can speak naturally. English, Pidgin, Yoruba, Igbo and Hausa are
        supported.
      </p>

      <Conversation />
    </Container>
  );
}

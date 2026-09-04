import Container from "@/components/layout/Container";

export const metadata = { title: "Privacy — MediVoice" };

export default function Privacy() {
  return (
    <Container className="max-w-2xl py-20">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy</h1>
      <p className="mt-4 text-muted-500">
        MediVoice is currently a product prototype. This placeholder page will be replaced with a
        full privacy policy — covering what conversation and account data is collected, how long
        it&rsquo;s retained, and how it&rsquo;s used — before any real user data is processed.
      </p>
    </Container>
  );
}

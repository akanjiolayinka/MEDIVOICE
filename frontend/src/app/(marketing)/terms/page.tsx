import Container from "@/components/layout/Container";

export const metadata = { title: "Terms — MediVoice" };

export default function Terms() {
  return (
    <Container className="max-w-2xl py-20">
      <h1 className="text-3xl font-semibold tracking-tight">Terms</h1>
      <p className="mt-4 text-muted-500">
        MediVoice is currently a product prototype and does not provide medical diagnosis. This
        placeholder page will be replaced with full terms of service before any real user data is
        processed or the product moves beyond a demo.
      </p>
    </Container>
  );
}

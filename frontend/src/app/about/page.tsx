import Container from "@/components/layout/Container";

export const metadata = {
  title: "About — MediVoice",
};

export default function About() {
  return (
    <Container className="max-w-2xl py-20">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        Healthcare should meet people where they are.
      </h1>
      <p className="mt-6 text-muted-500">
        Language should not be a barrier to asking for help. MediVoice
        explores what happens when voice AI is designed around the way
        people actually communicate across Africa — not around the
        assumption that everyone speaks one language, one way, all the time.
      </p>

      <h2 className="mt-12 text-lg font-semibold">Mission</h2>
      <p className="mt-2 text-muted-500">
        Make voice interfaces more inclusive of the way Africans actually
        communicate. We are starting with healthcare navigation because the
        cost of being misunderstood can be high.
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold">MediVoice is</h2>
          <ul className="mt-2 space-y-1 text-muted-500">
            <li>Voice-first</li>
            <li>Multilingual</li>
            <li>Code-switching aware</li>
            <li>Safety-conscious</li>
            <li>Action-oriented</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold">MediVoice is not</h2>
          <ul className="mt-2 space-y-1 text-muted-500">
            <li>A doctor</li>
            <li>A diagnostic system</li>
            <li>A replacement for professional care</li>
          </ul>
        </div>
      </div>
    </Container>
  );
}

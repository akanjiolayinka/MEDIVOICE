import Container from "@/components/layout/Container";
import LanguageChips from "@/components/ui/LanguageChips";
import { MicIcon } from "@/components/icons";

export default function ProductPreview() {
  return (
    <section className="py-20">
      <Container className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-xs font-semibold tracking-widest text-primary-700">
            INSIDE MEDIVOICE
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            A real conversation, not another form.
          </h2>
          <p className="mt-4 text-muted-500">
            Once you&rsquo;re in, MediVoice feels like talking to someone who understands you —
            not filling out a symptom checker. This is what a consultation looks like.
          </p>
        </div>

        <div className="mx-auto w-full max-w-sm rounded-3xl border border-muted-200 bg-white p-5 shadow-sm">
          <p className="text-center text-sm font-semibold">MediVoice</p>

          <div className="mt-4 flex justify-end">
            <div className="max-w-[80%] rounded-2xl bg-primary-600 px-4 py-2.5 text-sm text-white">
              <p className="text-xs font-medium opacity-70">You</p>
              <p className="mt-0.5">My body dey hot and I dey weak.</p>
              <LanguageChips languages={["English", "Nigerian Pidgin"]} className="mt-2" />
            </div>
          </div>

          <div className="mt-3 flex justify-start">
            <div className="max-w-[80%] rounded-2xl border border-muted-200 bg-white px-4 py-2.5 text-sm">
              <p className="text-xs font-medium text-muted-500">MediVoice</p>
              <p className="mt-0.5">I understand. How long have you been feeling this way?</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-2">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white">
              <MicIcon className="h-6 w-6" />
            </span>
            <p className="text-xs text-muted-500">Tap to speak</p>
          </div>
        </div>
      </Container>
    </section>
  );
}

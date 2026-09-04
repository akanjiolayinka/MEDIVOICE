const nodes = [
  { title: "YOUR VOICE", detail: "Spoken naturally, in any mix of languages" },
  { title: "SAHARA", detail: "Code-switched speech" },
  { title: "AI AGENT", detail: "Conversation + extraction" },
  { title: "SAFETY ENGINE", detail: "Red flags + escalation" },
  { title: "ACTION", detail: "Summary / facility search" },
  { title: "YARNGPT", detail: "Voice response" },
];

export default function ArchitectureFlow() {
  return (
    <ol className="mx-auto flex max-w-md flex-col items-center">
      {nodes.map((node, i) => (
        <li key={node.title} className="flex w-full flex-col items-center">
          <div className="w-full rounded-2xl border border-muted-200 bg-white/70 px-6 py-4 text-center">
            <p className="text-sm font-semibold tracking-wide text-primary-700">
              {node.title}
            </p>
            <p className="mt-1 text-sm text-muted-500">{node.detail}</p>
          </div>
          {i < nodes.length - 1 && (
            <span
              aria-hidden
              className="my-1 h-8 w-px bg-muted-200"
            />
          )}
        </li>
      ))}
    </ol>
  );
}

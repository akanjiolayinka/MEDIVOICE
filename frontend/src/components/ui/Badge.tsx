type Tone = "neutral" | "accent" | "primary";

const tones: Record<Tone, string> = {
  neutral: "bg-muted-100 text-muted-500",
  accent: "bg-accent-100 text-accent-700",
  primary: "bg-primary-50 text-primary-700",
};

export default function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

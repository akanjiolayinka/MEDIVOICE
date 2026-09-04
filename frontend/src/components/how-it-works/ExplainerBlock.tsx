export default function ExplainerBlock({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-widest text-primary-700">
        {eyebrow.toUpperCase()}
      </p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-muted-500">{body}</p>
    </div>
  );
}

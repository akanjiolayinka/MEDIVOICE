export default function LanguageChips({
  languages,
  className = "",
}: {
  languages: string[];
  className?: string;
}) {
  if (languages.length === 0) {
    return <span className={`text-sm text-muted-500 ${className}`}>—</span>;
  }

  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
      {languages.map((lang) => (
        <li
          key={lang}
          className="rounded-full border border-muted-200 bg-white/60 px-3 py-1 text-xs font-medium text-muted-500"
        >
          {lang}
        </li>
      ))}
    </ul>
  );
}

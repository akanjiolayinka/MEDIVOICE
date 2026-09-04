import LanguageChips from "@/components/ui/LanguageChips";

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  pcm: "Nigerian Pidgin",
  yo: "Yoruba",
  ig: "Igbo",
  ha: "Hausa",
};

export default function LanguageIndicator({ codes }: { codes: string[] }) {
  const names = codes.map((code) => LANGUAGE_NAMES[code] ?? code);

  return (
    <div>
      <p className="text-xs font-medium text-muted-500">Detected speech</p>
      <LanguageChips languages={names} className="mt-2" />
    </div>
  );
}

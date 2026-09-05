import type { DemoFixture } from "@/lib/types";

export default function ScenarioPicker({
  fixtures,
  onSelect,
}: {
  fixtures: DemoFixture[];
  onSelect: (fixture: DemoFixture) => void;
}) {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      {fixtures.map((fixture) => (
        <button
          key={fixture.id}
          type="button"
          onClick={() => onSelect(fixture)}
          className="rounded-2xl border border-muted-200 bg-white/60 p-4 text-left transition-colors hover:border-primary-600"
        >
          <p className="text-sm font-medium">{fixture.title}</p>
          <p className="mt-1 text-xs text-muted-500">
            {fixture.languages.join(" · ")}
          </p>
        </button>
      ))}
    </div>
  );
}

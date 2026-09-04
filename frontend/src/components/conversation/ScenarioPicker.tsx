import type { ConversationScenario } from "@/lib/mock/conversations";

export default function ScenarioPicker({
  scenarios,
  activeId,
  onSelect,
}: {
  scenarios: ConversationScenario[];
  activeId: string;
  onSelect: (scenario: ConversationScenario) => void;
}) {
  return (
    <div className="w-full">
      <p className="mb-2 text-xs font-medium text-muted-500">Demo Mode — try a scenario</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {scenarios.map((scenario) => {
          const isActive = scenario.id === activeId;
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => onSelect(scenario)}
              className={`shrink-0 rounded-xl border px-3.5 py-2 text-left text-xs transition-colors ${
                isActive
                  ? "border-primary-600 bg-primary-50 text-primary-700"
                  : "border-muted-200 bg-white text-muted-500 hover:border-primary-200"
              }`}
            >
              <span className="block font-medium">{scenario.title}</span>
              <span className="block opacity-80">{scenario.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

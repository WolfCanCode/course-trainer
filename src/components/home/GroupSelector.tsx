import { component$, QRL } from "@builder.io/qwik";

interface GroupSelectorProps {
  groups: string[];
  selected: string;
  onSelect$: QRL<(group: string) => void>;
}

export const GroupSelector = component$<GroupSelectorProps>(
  ({ groups, selected, onSelect$ }) => (
    <div class="no-scrollbar flex gap-2 overflow-x-auto px-2 py-2">
      {groups.map((group) => (
        <button
          key={group}
          class={`rounded-full border-2 px-4 py-2 font-semibold whitespace-nowrap transition-all ${selected === group ? "border-blue-600 bg-blue-600 text-white shadow" : "border-blue-100 bg-white text-blue-700 hover:bg-blue-50"}`}
          onClick$={() => onSelect$(group)}
        >
          {group}
        </button>
      ))}
    </div>
  ),
);

import { component$, useSignal, $ } from "@builder.io/qwik";
import type { QRL } from "@builder.io/qwik";

interface GroupSelectorProps {
  groups: string[];
  selected: string;
  onSelect$: QRL<(group: string) => void>;
}

export const GroupSelector = component$<GroupSelectorProps>(
  ({ groups, selected, onSelect$ }) => {
    const showRightFog = useSignal(true);
    const scrollRef = useSignal<HTMLDivElement>();

    // Handler to check if at end
    const handleScroll = $(() => {
      const el = scrollRef.value;
      if (!el) return;
      // If scrolled to the end, hide fog
      showRightFog.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
    });

    return (
      <div class="relative">
        {/* Right fog overlay, only if not at end */}
        {showRightFog.value && (
          <div class="pointer-events-none absolute top-0 right-0 z-10 h-full w-8 bg-gradient-to-l from-white/90 to-transparent" />
        )}
        <div
          ref={scrollRef}
          class="no-scrollbar relative flex gap-2 overflow-x-auto px-2 py-2"
          onScroll$={handleScroll}
        >
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
      </div>
    );
  },
);

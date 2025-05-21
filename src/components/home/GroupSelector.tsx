import { component$, useSignal, $ } from "@builder.io/qwik";
import type { QRL } from "@builder.io/qwik";
import ImgAws from "../../media/img/aws.png?jsx";
import ImgAzure from "../../media/img/azure.png?jsx";
import ImgGcp from "../../media/img/gcp.png?jsx";
import ImgOracle from "../../media/img/oracle.png?jsx";
import ImgIbm from "../../media/img/ibm.png?jsx";
import ImgHashicorp from "../../media/img/hashicorp.png?jsx";
import ImgPmi from "../../media/img/pmi.png?jsx";

interface GroupSelectorProps {
  groups: string[];
  selected: string;
  onSelect$: QRL<(group: string) => void>;
}

const groupIcons: Record<string, any> = {
  AWS: <ImgAws class="inline-block h-5 w-5 align-middle" />,
  Azure: <ImgAzure class="inline-block h-5 w-5 align-middle" />,
  "Google Cloud": <ImgGcp class="inline-block h-5 w-5 align-middle" />,
  "Oracle Cloud": <ImgOracle class="inline-block h-5 w-5 align-middle" />,
  "IBM Cloud": <ImgIbm class="inline-block h-5 w-5 align-middle" />,
  HashiCorp: <ImgHashicorp class="inline-block h-5 w-5 align-middle" />,
  PMI: <ImgPmi class="inline-block h-5 w-5 align-middle" />,
};

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
              class={`flex items-center gap-2 rounded-full border-2 px-4 py-2 font-semibold whitespace-nowrap transition-all ${selected === group ? "border-blue-600 bg-blue-600 text-white shadow" : "border-blue-100 bg-white text-blue-700 hover:bg-blue-50"}`}
              onClick$={() => onSelect$(group)}
            >
              <span
                class={`flex h-6 w-6 items-center justify-center rounded-full ${selected === group ? "bg-white" : "bg-transparent"}`}
              >
                {groupIcons[group]}
              </span>
              <span>{group}</span>
            </button>
          ))}
        </div>
      </div>
    );
  },
);

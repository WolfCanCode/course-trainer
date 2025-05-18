import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import ImgAws from "../../media/img/aws.png?jsx";
import ImgAzure from "../../media/img/azure.png?jsx";
import ImgGcp from "../../media/img/gcp.png?jsx";
import ImgOracle from "../../media/img/oracle.png?jsx";
import ImgIbm from "../../media/img/ibm.png?jsx";
import ImgHashicorp from "../../media/img/hashicorp.png?jsx";

interface CourseCardProps {
  id: string;
  name: string;
  description: string;
  logoKey: string;
  bgKey: string;
}

export const CourseCard = component$<CourseCardProps>(
  ({ id, name, description, logoKey, bgKey }) => {
    const logoMap: Record<string, any> = {
      AWS: <ImgAws class="h-20 w-20 object-contain sm:h-24 sm:w-24" />,
      Azure: <ImgAzure class="h-20 w-20 object-contain sm:h-24 sm:w-24" />,
      "Google Cloud": (
        <ImgGcp class="h-20 w-20 object-contain sm:h-24 sm:w-24" />
      ),
      "Oracle Cloud": (
        <ImgOracle class="h-20 w-20 object-contain sm:h-24 sm:w-24" />
      ),
      "IBM Cloud": <ImgIbm class="h-20 w-20 object-contain sm:h-24 sm:w-24" />,
      HashiCorp: (
        <ImgHashicorp class="h-20 w-20 object-contain sm:h-24 sm:w-24" />
      ),
    };
    const bgMap: Record<string, string> = {
      AWS: "from-yellow-100 to-yellow-300",
      Azure: "from-blue-100 to-blue-300",
      "Google Cloud": "from-yellow-100 to-red-200",
      "Oracle Cloud": "from-orange-100 to-orange-300",
      "IBM Cloud": "from-slate-100 to-slate-300",
      HashiCorp: "from-zinc-100 to-zinc-300",
    };
    const expanded = useSignal(false);
    const cardRef = useSignal<HTMLElement>();

    useTask$(({ track }) => {
      track(() => expanded.value);
      if (cardRef.value) {
        if (expanded.value) {
          cardRef.value.style.maxHeight = "350px";
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              cardRef.value!.style.maxHeight =
                cardRef.value!.scrollHeight + "px";
            });
          });
        } else {
          cardRef.value.style.maxHeight = "350px";
        }
      }
    });

    return (
      <div
        ref={cardRef}
        class="flex w-full max-w-xs flex-1 flex-col items-center rounded-2xl border border-slate-200 bg-white p-4 shadow transition-all duration-700 ease-in sm:max-w-sm sm:p-6"
        style={{
          overflow: "hidden",
          minHeight: "350px",
          maxHeight: "350px",
        }}
      >
        <div class="flex w-full flex-1 flex-col items-center">
          <div class="mb-4 flex w-full items-center justify-center">
            <div
              class={`flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br sm:h-24 sm:w-24 ${bgMap[bgKey as string]}`}
            >
              {logoMap[logoKey as string]}
            </div>
          </div>
          <h2 class="mb-2 text-center text-2xl font-bold text-slate-800 sm:text-3xl">
            {name}
          </h2>
          <p class="mb-6 line-clamp-3 text-center text-base text-slate-600 sm:text-lg">
            {description}
          </p>
        </div>
        <Link
          href={`/course/${id}/`}
          class="mt-auto w-full"
          onClick$={() => {
            expanded.value = true;
          }}
        >
          <button class="w-full rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow transition hover:bg-blue-700 sm:text-xl">
            Start Quiz
          </button>
        </Link>
      </div>
    );
  },
);

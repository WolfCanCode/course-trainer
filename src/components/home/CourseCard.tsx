import { component$ } from "@builder.io/qwik";
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
      AWS: <ImgAws class="h-12 w-12 object-contain" />,
      Azure: <ImgAzure class="h-12 w-12 object-contain" />,
      "Google Cloud": <ImgGcp class="h-12 w-12 object-contain" />,
      "Oracle Cloud": <ImgOracle class="h-12 w-12 object-contain" />,
      "IBM Cloud": <ImgIbm class="h-12 w-12 object-contain" />,
      HashiCorp: <ImgHashicorp class="h-12 w-12 object-contain" />,
    };
    const bgMap: Record<string, string> = {
      AWS: "from-yellow-100 to-yellow-300",
      Azure: "from-blue-100 to-blue-300",
      "Google Cloud": "from-yellow-100 to-red-200",
      "Oracle Cloud": "from-orange-100 to-orange-300",
      "IBM Cloud": "from-slate-100 to-slate-300",
      HashiCorp: "from-zinc-100 to-zinc-300",
    };

    return (
      <div class="animate-fade-in flex h-[300px] w-full max-w-xs flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow sm:max-w-sm">
        <div class="flex flex-col items-center">
          <div class="mb-3 flex w-full items-center justify-center">
            <div
              class={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${bgMap[bgKey as string]}`}
            >
              {logoMap[logoKey as string]}
            </div>
          </div>
          <h2 class="mb-2 line-clamp-2 text-center text-lg font-bold text-slate-800">
            {name}
          </h2>
          <p class="mb-3 line-clamp-2 text-center text-sm text-slate-600">
            {description}
          </p>
        </div>
        <Link href={`/course/${id}/`} class="w-full">
          <button class="w-full rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow transition hover:bg-blue-700">
            Start Quiz
          </button>
        </Link>
      </div>
    );
  },
);

import { component$, useSignal } from "@builder.io/qwik";
import { CourseCard } from "./CourseCard";
import ImgAws from "../../media/img/aws.png?jsx";
import ImgAzure from "../../media/img/azure.png?jsx";
import ImgGcp from "../../media/img/gcp.png?jsx";
import ImgOracle from "../../media/img/oracle.png?jsx";
import ImgIbm from "../../media/img/ibm.png?jsx";
import ImgHashicorp from "../../media/img/hashicorp.png?jsx";

interface Course {
  id: string;
  name: string;
  description: string;
  group: string;
  logoKey: string;
  bgKey: string;
}

interface Group {
  name: string;
  courses: Course[];
}

interface DesktopCourseGridProps {
  groups: Group[];
}

const logoMap: Record<string, any> = {
  AWS: <ImgAws class="h-8 w-8 object-contain" />,
  Azure: <ImgAzure class="h-8 w-8 object-contain" />,
  "Google Cloud": <ImgGcp class="h-8 w-8 object-contain" />,
  "Oracle Cloud": <ImgOracle class="h-8 w-8 object-contain" />,
  "IBM Cloud": <ImgIbm class="h-8 w-8 object-contain" />,
  HashiCorp: <ImgHashicorp class="h-8 w-8 object-contain" />,
};

export const DesktopCourseGrid = component$<DesktopCourseGridProps>(
  ({ groups }) => {
    const selectedGroup = useSignal(groups[0]?.name || "");
    const group =
      groups.find((g) => g.name === selectedGroup.value) || groups[0];
    return (
      <div class="mx-auto hidden w-full max-w-7xl flex-row gap-8 sm:flex">
        {/* Sidebar */}
        <aside class="sticky top-8 flex h-fit min-w-[200px] flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-md">
          {groups.map((g) => (
            <button
              key={g.name}
              class={`flex items-center gap-2 rounded-lg px-4 py-2 text-left font-semibold transition-all hover:bg-blue-50 ${selectedGroup.value === g.name ? "bg-blue-100 text-blue-700" : "text-slate-700"}`}
              onClick$={() => (selectedGroup.value = g.name)}
            >
              {logoMap[g.name]}
              <span>{g.name}</span>
            </button>
          ))}
        </aside>
        {/* Main content: course grid */}
        <main class="flex-1">
          <div class="mb-6 flex items-center gap-3">
            {logoMap[group.name]}
            <h2 class="text-2xl font-bold text-slate-800">{group.name}</h2>
          </div>
          <div class="grid grid-cols-3 gap-4">
            {group.courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                name={course.name}
                description={course.description}
                logoKey={course.logoKey}
                bgKey={course.bgKey}
              />
            ))}
          </div>
        </main>
      </div>
    );
  },
);

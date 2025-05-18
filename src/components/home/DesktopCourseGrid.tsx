import { component$ } from "@builder.io/qwik";
import { CourseCard } from "./CourseCard";

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

export const DesktopCourseGrid = component$<DesktopCourseGridProps>(
  ({ groups }) => {
    return (
      <div class="hidden w-full max-w-4xl grid-cols-1 gap-8 sm:grid md:grid-cols-2">
        {groups.map((group) => (
          <div
            key={group.name}
            class="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-lg"
          >
            <h2 class="mb-4 border-b border-slate-100 pb-2 text-2xl font-semibold text-slate-800">
              {group.name}
            </h2>
            <div class="flex flex-col gap-4">
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
          </div>
        ))}
      </div>
    );
  },
);

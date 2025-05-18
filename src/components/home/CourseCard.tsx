import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

interface CourseCardProps {
  id: string;
  name: string;
  description: string;
  logo: any;
  bg: string;
}

export const CourseCard = component$<CourseCardProps>(
  ({ id, name, description, logo, bg }) => (
    <div class="flex h-[70vh] max-h-[500px] min-h-[350px] w-full max-w-xs flex-1 flex-col items-center rounded-2xl border border-slate-200 bg-white p-4 shadow sm:max-w-sm sm:p-6">
      <div class="flex w-full flex-1 flex-col items-center">
        <div class="mb-4 flex w-full items-center justify-center">
          <div
            class={`flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br sm:h-24 sm:w-24 ${bg}`}
          >
            {logo}
          </div>
        </div>
        <h2 class="mb-2 text-center text-2xl font-bold text-slate-800 sm:text-3xl">
          {name}
        </h2>
        <p class="mb-6 line-clamp-3 text-center text-base text-slate-600 sm:text-lg">
          {description}
        </p>
      </div>
      <Link href={`/course/${id}/`} class="mt-auto w-full">
        <button class="w-full rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow transition hover:bg-blue-700 sm:text-xl">
          Start Quiz
        </button>
      </Link>
    </div>
  ),
);

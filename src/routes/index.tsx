import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";

// Static data for course groups and courses
export const courseGroups = [
  {
    name: "AWS",
    courses: [
      { id: "aws-cloud-practitioner", name: "AWS Cloud Practitioner" },
      { id: "aws-solutions-architect", name: "AWS Solutions Architect" },
    ],
  },
  {
    name: "Azure",
    courses: [
      { id: "azure-fundamentals", name: "Azure Fundamentals" },
      { id: "azure-administrator", name: "Azure Administrator" },
    ],
  },
  // Add more groups/courses as needed
];

export default component$(() => {
  return (
    <div class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-2 py-8">
      <div class="mx-auto w-full max-w-2xl">
        <div class="mb-8 flex flex-col items-center">
          <h1 class="mb-2 text-center text-4xl font-extrabold text-blue-700 drop-shadow-sm">
            Course Trainer
          </h1>
          <p class="mb-6 max-w-xl text-center text-lg text-slate-600">
            AI-powered certification quiz practice for AWS, Azure, and more.
            Choose a course to get started!
          </p>
          <div class="mb-6 w-full max-w-md">
            <input
              type="text"
              placeholder="Search for a course... (coming soon)"
              class="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-base shadow transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              disabled
            />
          </div>
        </div>
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {courseGroups.map((group) => (
            <div
              key={group.name}
              class="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-xl transition hover:shadow-2xl"
            >
              <div class="mb-4 flex items-center gap-3">
                <span
                  class={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-200 to-blue-200 text-xl font-bold text-blue-700 shadow transition group-hover:scale-105`}
                >
                  {group.name[0]}
                </span>
                <h2 class="text-2xl font-bold text-slate-800">{group.name}</h2>
              </div>
              <div class="mt-2 flex flex-col gap-4">
                {group.courses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/course/${course.id}/`}
                    class="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-5 py-3 text-lg font-medium text-blue-700 shadow-sm transition hover:scale-[1.03] hover:bg-blue-100 hover:text-blue-900"
                  >
                    <span>{course.name}</span>
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                      <path
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 18l6-6-6-6"
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Course Trainer",
  meta: [
    {
      name: "description",
      content:
        "Course Trainer: AI-powered certification quiz practice for AWS, Azure, and more.",
    },
  ],
};

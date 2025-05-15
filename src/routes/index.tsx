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
      { id: "azure-fundamentals", name: "AWS Fundamentals" },
      { id: "azure-administrator", name: "AWS Administrator" },
    ],
  },
  // Add more groups/courses as needed
];

export default component$(() => {
  return (
    <div class="flex min-h-[70vh] flex-col items-center justify-center py-8">
      <h1 class="mb-2 text-center text-4xl font-bold text-blue-700">
        Choose a Course Group
      </h1>
      <p class="mb-8 max-w-xl text-center text-slate-600">
        Select a certification group and course to start your AI-powered quiz
        practice.
      </p>
      <div class="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        {courseGroups.map((group) => (
          <div
            key={group.name}
            class="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-lg"
          >
            <h2 class="mb-4 border-b border-slate-100 pb-2 text-2xl font-semibold text-slate-800">
              {group.name}
            </h2>
            <div class="flex flex-col gap-4">
              {group.courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/course/${course.id}/`}
                  class="block rounded-lg border border-blue-100 bg-blue-50 px-5 py-3 text-lg font-medium text-blue-700 shadow-sm transition hover:bg-blue-100 hover:text-blue-900"
                >
                  {course.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};

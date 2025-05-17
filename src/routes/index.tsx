import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import { useSignal, useVisibleTask$ } from "@builder.io/qwik";

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
  const current = useSignal(0);
  const cardCount = courseGroups.reduce(
    (acc, group) => acc + group.courses.length,
    0,
  );
  const touchStartX = useSignal(0);
  const touchEndX = useSignal(0);

  useVisibleTask$(() => {
    const container = document.getElementById("mobile-swipe-cards");
    if (!container) return;
    let startX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      touchStartX.value = startX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      touchEndX.value = endX;
      const diff = endX - startX;
      if (Math.abs(diff) > 50) {
        if (diff < 0 && current.value < cardCount - 1) {
          current.value++;
        } else if (diff > 0 && current.value > 0) {
          current.value--;
        }
      }
    };
    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);
    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  });

  return (
    <div class="flex min-h-screen flex-col items-center justify-center px-2 py-8">
      {/* Mobile swipeable cards */}
      <div
        id="mobile-swipe-cards"
        class="relative mx-auto block h-[80vh] w-full max-w-md overflow-hidden sm:hidden"
      >
        {courseGroups.map((group, groupIdx) =>
          group.courses.map((course, idx) => {
            const cardIdx = groupIdx * courseGroups[0].courses.length + idx;
            return (
              <div
                key={course.id}
                class={`absolute inset-0 flex flex-col items-center justify-center transition-transform duration-300 ${current.value === cardIdx ? "z-10 scale-100 opacity-100" : "pointer-events-none z-0 scale-95 opacity-0"}`}
                style={{
                  transform: `translateX(${(cardIdx - current.value) * 100}%)`,
                }}
              >
                <div class="mb-24 flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                  <div class="mb-4 flex w-full items-center justify-center">
                    <div class="flex h-32 w-32 items-center justify-center rounded-xl bg-gradient-to-br from-blue-200 to-purple-200 text-5xl font-bold text-blue-600">
                      <span>{course.name[0]}</span>
                    </div>
                  </div>
                  <h2 class="mb-2 text-center text-2xl font-bold text-slate-800">
                    {course.name}
                  </h2>
                  <p class="mb-6 text-center text-base text-slate-600">
                    Practice for your {course.name} certification with
                    AI-powered quizzes.
                  </p>
                  <Link href={`/course/${course.id}/`} class="w-full">
                    <button class="w-full rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow transition hover:bg-blue-700">
                      Start Quiz
                    </button>
                  </Link>
                </div>
                {/* Swipe controls */}
                <div class="absolute bottom-4 left-0 flex w-full items-center justify-between px-4">
                  <button
                    class="rounded-full bg-slate-200 p-2 text-xl text-slate-500 disabled:opacity-40"
                    disabled={current.value === 0}
                    onClick$={() =>
                      (current.value = Math.max(0, current.value - 1))
                    }
                  >
                    &#8592;
                  </button>
                  <button
                    class="rounded-full bg-slate-200 p-2 text-xl text-slate-500 disabled:opacity-40"
                    disabled={
                      current.value ===
                      courseGroups.flatMap((g) => g.courses).length - 1
                    }
                    onClick$={() =>
                      (current.value = Math.min(
                        courseGroups.flatMap((g) => g.courses).length - 1,
                        current.value + 1,
                      ))
                    }
                  >
                    &#8594;
                  </button>
                </div>
              </div>
            );
          }),
        )}
      </div>
      {/* Desktop grid/list */}
      <div class="hidden w-full max-w-4xl grid-cols-1 gap-8 sm:grid md:grid-cols-2">
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
      {/* Bottom nav for mobile */}
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

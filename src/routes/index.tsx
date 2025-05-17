import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import { useSignal, $, useVisibleTask$ } from "@builder.io/qwik";

// Static data for course groups and courses
export const courseGroups = [
  {
    name: "AWS",
    courses: [
      {
        id: "aws-cloud-practitioner",
        name: "AWS Certified Cloud Practitioner",
      },
      {
        id: "aws-solutions-architect",
        name: "AWS Certified Solutions Architect – Associate",
      },
      { id: "aws-developer", name: "AWS Certified Developer – Associate" },
      {
        id: "aws-sysops",
        name: "AWS Certified SysOps Administrator – Associate",
      },
      {
        id: "aws-devops",
        name: "AWS Certified DevOps Engineer – Professional",
      },
      { id: "aws-security", name: "AWS Certified Security – Specialty" },
      {
        id: "aws-advanced-networking",
        name: "AWS Certified Advanced Networking – Specialty",
      },
      {
        id: "aws-machine-learning",
        name: "AWS Certified Machine Learning – Specialty",
      },
    ],
  },
  {
    name: "Azure",
    courses: [
      {
        id: "azure-fundamentals",
        name: "Microsoft Certified: Azure Fundamentals (AZ-900)",
      },
      {
        id: "azure-administrator",
        name: "Microsoft Certified: Azure Administrator Associate (AZ-104)",
      },
      {
        id: "azure-developer",
        name: "Microsoft Certified: Azure Developer Associate (AZ-204)",
      },
      {
        id: "azure-solutions-architect",
        name: "Microsoft Certified: Azure Solutions Architect Expert (AZ-305)",
      },
      {
        id: "azure-security",
        name: "Microsoft Certified: Azure Security Engineer Associate (AZ-500)",
      },
      {
        id: "azure-ai",
        name: "Microsoft Certified: Azure AI Engineer Associate (AI-102)",
      },
      {
        id: "azure-data-engineer",
        name: "Microsoft Certified: Azure Data Engineer Associate (DP-203)",
      },
    ],
  },
  {
    name: "Google Cloud",
    courses: [
      { id: "gcp-cloud-digital-leader", name: "Google Cloud Digital Leader" },
      {
        id: "gcp-associate-cloud-engineer",
        name: "Google Associate Cloud Engineer",
      },
      {
        id: "gcp-professional-cloud-architect",
        name: "Google Professional Cloud Architect",
      },
      { id: "gcp-data-engineer", name: "Google Professional Data Engineer" },
      {
        id: "gcp-security-engineer",
        name: "Google Professional Cloud Security Engineer",
      },
    ],
  },
  // Add more groups/courses as needed
];

export default component$(() => {
  const current = useSignal(0);
  const selectedGroup = useSignal(courseGroups[0].name);
  const cardCount =
    courseGroups.find((g) => g.name === selectedGroup.value)?.courses.length ||
    0;
  const touchStartX = useSignal(0);
  const touchEndX = useSignal(0);

  // Reset course index when group changes
  const handleGroupSelect = $((groupName: string) => {
    selectedGroup.value = groupName;
    current.value = 0;
  });

  // eslint-disable-next-line qwik/no-use-visible-task
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
    <div class="flex max-h-screen flex-col items-start justify-start overflow-hidden px-2 pb-8 sm:max-h-full sm:min-h-screen">
      {/* Mobile group selector */}
      <div class="mx-auto mb-4 block w-full max-w-md sm:hidden">
        <div class="no-scrollbar flex gap-2 overflow-x-auto px-2 py-2">
          {courseGroups.map((group) => (
            <button
              key={group.name}
              class={`rounded-full border-2 px-4 py-2 font-semibold whitespace-nowrap transition-all ${selectedGroup.value === group.name ? "border-blue-600 bg-blue-600 text-white shadow" : "border-blue-100 bg-white text-blue-700 hover:bg-blue-50"}`}
              onClick$={() => handleGroupSelect(group.name)}
            >
              {group.name}
            </button>
          ))}
        </div>
      </div>
      {/* Mobile swipeable cards */}
      <div
        id="mobile-swipe-cards"
        class="relative mx-auto block h-[70vh] w-full max-w-md overflow-hidden px-4 sm:hidden"
      >
        {courseGroups
          .find((g) => g.name === selectedGroup.value)
          ?.courses.map((course, idx) => {
            const offset = idx - current.value;
            const z = 10 - Math.abs(offset);
            let style = {};
            if (offset === 0) {
              style = { transform: "translateX(0) scale(1)", zIndex: z };
            } else if (offset === -1) {
              style = { transform: "translateX(-20%) scale(0.92)", zIndex: z };
            } else if (offset === 1) {
              style = { transform: "translateX(20%) scale(0.92)", zIndex: z };
            } else {
              style = {
                transform: `translateX(${offset * 100}%) scale(0.88)`,
                zIndex: 0,
                opacity: 0,
              };
            }
            // Determine group for image
            const group = selectedGroup.value;
            let logo = null;
            let bg = "from-blue-200 to-purple-200";
            if (group === "AWS") {
              logo = (
                <svg viewBox="0 0 48 48" width="48" height="48" fill="none">
                  <rect width="48" height="48" rx="12" fill="#232F3E" />
                  <text
                    x="50%"
                    y="60%"
                    text-anchor="middle"
                    fill="#FF9900"
                    font-size="18"
                    font-weight="bold"
                    font-family="Arial"
                  >
                    AWS
                  </text>
                </svg>
              );
              bg = "from-yellow-100 to-yellow-300";
            } else if (group === "Azure") {
              logo = (
                <svg viewBox="0 0 48 48" width="48" height="48" fill="none">
                  <rect width="48" height="48" rx="12" fill="#0078D4" />
                  <polygon points="24,8 40,40 8,40" fill="#fff" />
                </svg>
              );
              bg = "from-blue-100 to-blue-300";
            } else if (group === "Google Cloud") {
              logo = (
                <svg viewBox="0 0 48 48" width="48" height="48" fill="none">
                  <rect width="48" height="48" rx="12" fill="#fff" />
                  <circle cx="24" cy="24" r="18" fill="#4285F4" />
                  <path
                    d="M24 12a12 12 0 0 1 9.8 19.2l-3.2-2.4A8 8 0 1 0 24 16v4l6 6h-8v-8z"
                    fill="#fff"
                  />
                </svg>
              );
              bg = "from-yellow-100 to-red-200";
            }
            return (
              <div
                key={course.id}
                class={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 ${offset === 0 ? "opacity-100" : "pointer-events-none opacity-60"}`}
                style={style}
              >
                <div
                  class={`mb-24 flex w-full max-w-xs flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 ${offset === 0 ? "shadow-2xl" : "shadow"}`}
                >
                  <div class="mb-4 flex w-full items-center justify-center">
                    <div
                      class={`flex h-32 w-32 items-center justify-center rounded-xl bg-gradient-to-br ${bg}`}
                    >
                      {logo}
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
              </div>
            );
          })}
        {/* Swipe indicator dots */}
        <div class="absolute bottom-20 left-0 z-20 flex w-full justify-center gap-2">
          {[...Array(cardCount)].map((_, idx) => (
            <span
              key={idx}
              class={`h-2 w-2 rounded-full transition-all duration-300 ${current.value === idx ? "w-4 bg-blue-600" : "bg-slate-300"}`}
            ></span>
          ))}
        </div>
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

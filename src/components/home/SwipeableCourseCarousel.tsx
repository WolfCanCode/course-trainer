import { component$, useVisibleTask$, useSignal } from "@builder.io/qwik";
import type { QRL } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
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

interface SwipeableCourseCarouselProps {
  courses: Course[];
  current: number;
  onCurrentChange$: QRL<(idx: number) => void>;
}

export const SwipeableCourseCarousel = component$<SwipeableCourseCarouselProps>(
  ({ courses, current, onCurrentChange$ }) => {
    const touchStartX = useSignal(0);
    const touchEndX = useSignal(0);
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
          if (diff < 0 && current < courses.length - 1) {
            onCurrentChange$(current + 1);
          } else if (diff > 0 && current > 0) {
            onCurrentChange$(current - 1);
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
    return (
      <div
        id="mobile-swipe-cards"
        class="animate-fade-in relative mx-auto block h-[70vh] w-full max-w-md overflow-hidden px-4 sm:hidden"
      >
        {courses.map((course, idx) => {
          const offset = idx - current;
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
          return (
            <div
              key={course.id}
              class={`absolute inset-0 flex flex-col items-center justify-start pt-5 transition-all duration-300 ${offset === 0 ? "opacity-100" : "pointer-events-none opacity-60"}`}
              style={style}
            >
              <div
                class={`mb-24 flex w-full max-w-xs flex-1 flex-col items-center rounded-2xl border border-slate-200 bg-white p-4 sm:max-w-sm sm:p-6 ${offset === 0 ? "shadow-2xl" : "shadow"} h-[70vh] max-h-[500px] min-h-[350px]`}
              >
                <div class="flex w-full flex-1 flex-col items-center">
                  <div class="mb-4 flex w-full items-center justify-center">
                    <div
                      class={`flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br sm:h-24 sm:w-24 ${bgMap[course.bgKey as string]}`}
                    >
                      {logoMap[course.logoKey as string]}
                    </div>
                  </div>
                  <h2 class="mb-2 text-center text-2xl font-bold text-slate-800 sm:text-3xl">
                    {course.name}
                  </h2>
                  <p class="mb-6 line-clamp-3 text-center text-base text-slate-600 sm:text-lg">
                    {course.description}
                  </p>
                </div>
                <Link href={`/course/${course.id}/`} class="mt-auto w-full">
                  <button class="w-full rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow transition hover:bg-blue-700 sm:text-xl">
                    Start Quiz
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
        {/* Swipe indicator dots */}
        <div class="absolute bottom-6 left-0 z-20 flex w-full justify-center gap-2 sm:bottom-10">
          {[...Array(courses.length)].map((_, idx) => (
            <span
              key={idx}
              class={`h-2 w-2 rounded-full transition-all duration-300 ${current === idx ? "w-4 bg-blue-600" : "bg-slate-300"}`}
            ></span>
          ))}
        </div>
      </div>
    );
  },
);

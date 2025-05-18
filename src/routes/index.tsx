import { $, component$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { courseGroups } from "../lib/course-data";
import ImgAws from "../media/img/aws.png?jsx";
import ImgAzure from "../media/img/azure.png?jsx";
import ImgGcp from "../media/img/gcp.png?jsx";
import { GroupSelector } from "../components/home/GroupSelector";
import { SwipeableCourseCarousel } from "../components/home/SwipeableCourseCarousel";
import { DesktopCourseGrid } from "../components/home/DesktopCourseGrid";

const groupLogos: Record<string, { logo: any; bg: string }> = {
  AWS: {
    logo: <ImgAws class="h-20 w-20 object-contain sm:h-24 sm:w-24" />,
    bg: "from-yellow-100 to-yellow-300",
  },
  Azure: {
    logo: <ImgAzure class="h-20 w-20 object-contain sm:h-24 sm:w-24" />,
    bg: "from-blue-100 to-blue-300",
  },
  "Google Cloud": {
    logo: <ImgGcp class="h-20 w-20 object-contain sm:h-24 sm:w-24" />,
    bg: "from-yellow-100 to-red-200",
  },
};

export default component$(() => {
  const current = useSignal(0);
  const selectedGroup = useSignal(courseGroups[0].name);
  const groupNames = courseGroups.map((g) => g.name);
  const selectedCourses =
    courseGroups
      .find((g) => g.name === selectedGroup.value)
      ?.courses.map((course) => ({
        ...course,
        ...groupLogos[selectedGroup.value as keyof typeof groupLogos],
      })) || [];
  const desktopGroups = courseGroups.map((g) => ({
    ...g,
    courses: g.courses.map((course) => ({
      ...course,
      ...groupLogos[g.name as keyof typeof groupLogos],
    })),
  }));

  // Reset course index when group changes
  const handleGroupSelect = $((groupName: string) => {
    selectedGroup.value = groupName;
    current.value = 0;
  });

  return (
    <div class="flex flex-col items-start justify-start overflow-hidden px-2 pb-2">
      {/* Mobile group selector */}
      <div class="mx-auto mb-4 block w-full max-w-md sm:hidden">
        <GroupSelector
          groups={groupNames}
          selected={selectedGroup.value}
          onSelect$={handleGroupSelect}
        />
      </div>
      {/* Mobile swipeable cards */}
      <SwipeableCourseCarousel
        courses={selectedCourses}
        current={current.value}
        onCurrentChange$={$((idx) => (current.value = idx))}
      />
      {/* Desktop grid/list */}
      <DesktopCourseGrid groups={desktopGroups} />
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

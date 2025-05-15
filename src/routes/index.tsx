import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";

// Static data for course groups and courses
const courseGroups = [
  {
    name: "AWS",
    courses: [
      { id: "aws-cloud-practitioner", name: "Cloud Practitioner" },
      { id: "aws-solutions-architect", name: "Solutions Architect" },
    ],
  },
  {
    name: "Azure",
    courses: [
      { id: "azure-fundamentals", name: "Fundamentals" },
      { id: "azure-administrator", name: "Administrator" },
    ],
  },
  // Add more groups/courses as needed
];

export default component$(() => {
  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h1>Choose a Course Group</h1>
      {courseGroups.map((group) => (
        <div key={group.name} style={{ marginBottom: "2rem" }}>
          <h2>{group.name}</h2>
          <ul>
            {group.courses.map((course) => (
              <li key={course.id} style={{ margin: "0.5rem 0" }}>
                <Link href={`/course/${course.id}/`}>{course.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
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

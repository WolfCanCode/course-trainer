import { component$ } from "@builder.io/qwik";
import { useLocation, Link } from "@builder.io/qwik-city";

export default component$(() => {
  const loc = useLocation();
  const courseId = loc.params.courseId;

  // Simple mapping for display name (in real app, fetch or use context)
  const courseNames: Record<string, string> = {
    "aws-cloud-practitioner": "AWS Cloud Practitioner",
    "aws-solutions-architect": "AWS Solutions Architect",
    "azure-fundamentals": "Azure Fundamentals",
    "azure-administrator": "Azure Administrator",
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>{courseNames[courseId] || courseId}</h1>
      <p>Welcome to the {courseNames[courseId] || courseId} course page.</p>
      <Link href={`/course/${courseId}/quiz`}>
        <button
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            marginTop: "1.5rem",
          }}
        >
          Start Quiz
        </button>
      </Link>
    </div>
  );
});

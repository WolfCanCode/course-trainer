import { component$ } from "@builder.io/qwik";
import { useLocation, Link } from "@builder.io/qwik-city";

const courseNames: Record<string, string> = {
  "aws-cloud-practitioner": "AWS Cloud Practitioner",
  "aws-solutions-architect": "AWS Solutions Architect",
  "azure-fundamentals": "Azure Fundamentals",
  "azure-administrator": "Azure Administrator",
};
const courseDescriptions: Record<string, string> = {
  "aws-cloud-practitioner":
    "Prepare for the AWS Cloud Practitioner certification with foundational cloud concepts and AWS services.",
  "aws-solutions-architect":
    "Master AWS architecture and design for the Solutions Architect certification.",
  "azure-fundamentals":
    "Learn the basics of Microsoft Azure and cloud computing for the Azure Fundamentals exam.",
  "azure-administrator":
    "Get ready for the Azure Administrator certification with hands-on cloud management skills.",
};

export default component$(() => {
  const loc = useLocation();
  const courseId = loc.params.courseId;
  const name = courseNames[courseId] || courseId;
  const desc =
    courseDescriptions[courseId] || "Start your certification journey.";

  return (
    <div class="flex min-h-[60vh] flex-col items-center justify-center py-8">
      <div class="flex w-full max-w-xl flex-col items-center rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 class="mb-2 text-center text-3xl font-bold text-blue-700">
          {name}
        </h1>
        <p class="mb-8 text-center text-slate-600">{desc}</p>
        <Link href={`/course/${courseId}/quiz`}>
          <button class="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow transition hover:bg-blue-700">
            Start Quiz
          </button>
        </Link>
      </div>
    </div>
  );
});

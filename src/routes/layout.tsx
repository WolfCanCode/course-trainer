import { component$, Slot } from "@builder.io/qwik";
import { Footer } from "../components/Footer";
import type { RequestHandler, DocumentHead } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export const head: DocumentHead = {
  title: "Course Trainer – AI-Powered Certification Quiz Practice",
  meta: [
    {
      name: "description",
      content:
        "Practice for AWS, Azure, and Google Cloud certifications with AI-generated quizzes. Modern, mobile-friendly, and endlessly challenging. Powered by HuggingFace AI.",
    },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "theme-color", content: "#2563eb" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "default" },
    { name: "mobile-web-app-capable", content: "yes" },
    // Social
    {
      property: "og:title",
      content: "Course Trainer – AI-Powered Certification Quiz Practice",
    },
    {
      property: "og:description",
      content:
        "Practice for AWS, Azure, and Google Cloud certifications with AI-generated quizzes. Modern, mobile-friendly, and endlessly challenging.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://course-trainer.vercel.app/" },
    {
      property: "og:image",
      content: "https://course-trainer.vercel.app/og-image.png",
    },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "Course Trainer – AI-Powered Certification Quiz Practice",
    },
    {
      name: "twitter:description",
      content:
        "Practice for AWS, Azure, and Google Cloud certifications with AI-generated quizzes. Modern, mobile-friendly, and endlessly challenging.",
    },
    {
      name: "twitter:image",
      content: "https://course-trainer.vercel.app/og-image.png",
    },
  ],
  links: [
    { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    { rel: "manifest", href: "/manifest.json" },
    // { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  ],
};

export default component$(() => {
  return (
    <div class="flex min-h-screen flex-col bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <header class="fixed top-0 left-0 z-50 flex w-full items-center justify-between bg-white/80 px-6 py-4 shadow-sm">
        <a
          href="/"
          class="text-2xl font-bold tracking-tight text-blue-700 hover:underline focus:outline-none"
        >
          Course Trainer
        </a>
        {/* Optionally add language switcher or user info here */}
      </header>
      <main class="mx-auto flex w-full max-w-5xl flex-1 flex-col pt-18">
        <Slot />
      </main>
      <Footer />
    </div>
  );
});

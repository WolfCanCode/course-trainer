import { component$, Slot } from "@builder.io/qwik";
import { Footer } from "../components/Footer";
import type { RequestHandler } from "@builder.io/qwik-city";

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

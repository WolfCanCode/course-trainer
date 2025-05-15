import { component$, Slot } from "@builder.io/qwik";
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
    <div class="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <header class="mb-6 flex w-full items-center justify-between bg-white/80 px-6 py-4 shadow-sm">
        <div class="text-2xl font-bold tracking-tight text-blue-700">
          Course Trainer
        </div>
        {/* Optionally add language switcher or user info here */}
      </header>
      <main class="mx-auto max-w-5xl px-2">
        <Slot />
      </main>
    </div>
  );
});

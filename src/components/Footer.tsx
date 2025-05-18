import { component$ } from "@builder.io/qwik";

const BUILD_VERSION = process.env.PUBLIC_BUILD_SHA?.slice(0, 7) || "local";
const MODEL_NAME = "meta-llama/llama-4-maverick";
const currentYear = new Date().getFullYear();

export const Footer = component$(() => {
  return (
    <footer class="safe-area-pb mt-auto flex w-full flex-col items-center gap-2 py-8 text-center text-xs text-gray-500 sm:text-sm">
      <span>
        <strong>Build</strong>{" "}
        <span class="font-mono text-xs">v1.0 {BUILD_VERSION}</span>
      </span>
      <span>
        <strong>Model</strong>{" "}
        <span class="font-mono text-xs">{MODEL_NAME}</span>
      </span>
      <div class="mb-2 flex gap-4">
        <a
          href="https://www.facebook.com/woftcancode/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          class="text-2xl transition-colors hover:text-cyan-400"
        >
          {/* Facebook Icon */}
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
          </svg>
        </a>
        <a
          href="https://github.com/WolfCanCode"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          class="text-2xl transition-colors hover:text-cyan-400"
        >
          {/* GitHub Icon */}
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/in/wolfcancode/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          class="text-2xl transition-colors hover:text-cyan-400"
        >
          {/* LinkedIn Icon */}
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.762 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.785-1.75-1.75s.784-1.75 1.75-1.75 1.75.785 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.597 2.001 3.597 4.6v5.596z" />
          </svg>
        </a>
      </div>
      <span class="cursor-pointer pb-4 text-xs text-gray-400">
        © {currentYear} Course Trainer. All rights reserved.
      </span>
    </footer>
  );
});

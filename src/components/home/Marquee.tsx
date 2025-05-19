import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { QwikIntrinsicElements } from "@builder.io/qwik";

interface MarqueeProps {
  children: QwikIntrinsicElements["span"]["children"];
}

export const Marquee = component$<MarqueeProps>(({ children }) => {
  const containerRef = useSignal<HTMLDivElement>();
  const textRef = useSignal<HTMLSpanElement>();
  const needsMarquee = useSignal(false);
  const distance = useSignal(0);

  useVisibleTask$(() => {
    // Wait for DOM paint
    requestAnimationFrame(() => {
      const container = containerRef.value;
      const text = textRef.value;
      if (container && text) {
        const containerWidth = container.offsetWidth;
        const textWidth = text.scrollWidth;
        if (textWidth > containerWidth) {
          needsMarquee.value = true;
          distance.value = textWidth - containerWidth + 24; // 24px buffer
        } else {
          needsMarquee.value = false;
        }
      }
    });
  });

  return (
    <div
      ref={containerRef}
      class="relative mx-auto w-[180px] overflow-hidden sm:inline sm:w-auto sm:overflow-visible"
      style={{ height: "1.5em" }}
    >
      <span
        ref={textRef}
        class={
          "inline-block whitespace-nowrap transition-all duration-300 " +
          (needsMarquee.value ? " will-change-transform" : "")
        }
        style={
          needsMarquee.value
            ? {
                animation: `marquee-move 4s linear infinite`,
                // @ts-ignore
                "--marquee-distance": `-${distance.value}px`,
              }
            : {}
        }
      >
        {children}
      </span>
      <style>{`
        @keyframes marquee-move {
          0% { transform: translateX(0); }
          100% { transform: translateX(var(--marquee-distance, -40px)); }
        }
      `}</style>
    </div>
  );
});

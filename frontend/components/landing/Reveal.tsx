"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Fades and slides its children in the first time they scroll into view. Content stays visible without JS. */
export default function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (el.getBoundingClientRect().top <= window.innerHeight * 0.9) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(28px)";
    el.style.transition = "opacity 1s cubic-bezier(.2,.7,.2,1), transform 1s cubic-bezier(.2,.7,.2,1)";
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.style.opacity = "1";
        el.style.transform = "none";
        io.disconnect();
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

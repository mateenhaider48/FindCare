"use client";

import { useEffect, useRef } from "react";
import { SPECIALTY_ROWS } from "./data";

const DIRS = [1, -1, 1];
const REPEAT = 4;

/** Three rows of specialty pills drifting in alternating directions; each row slows down on hover. */
export default function SpecialtyMarquee() {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const targets = useRef([1, 1, 1]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pos = [0, 0, 0];
    const factor = [1, 1, 1];
    let raf = 0;
    let last = 0;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = last ? Math.min(50, now - last) : 16;
      last = now;
      if (reduce) return;
      rowRefs.current.forEach((el, i) => {
        if (!el) return;
        const half = el.scrollWidth / 2;
        if (!half) return;
        factor[i] += (targets.current[i] - factor[i]) * 0.06;
        pos[i] += (dt / 1000) * 26 * factor[i] * (i === 1 ? 1.15 : 1);
        const m = pos[i] % half;
        el.style.transform = `translate3d(${DIRS[i] > 0 ? m - half : -m}px,0,0)`;
      });
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="mt-16 flex flex-col gap-3.5 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      {SPECIALTY_ROWS.map((row, i) => {
        const items = Array.from({ length: REPEAT }, () => row).flat();
        return (
          <div
            key={i}
            className="overflow-hidden py-1"
            onMouseEnter={() => (targets.current[i] = 0.12)}
            onMouseLeave={() => (targets.current[i] = 1)}
          >
            <div
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              className="flex w-max gap-3 will-change-transform"
            >
              {items.map((p, j) => (
                <div
                  key={j}
                  className="flex flex-none items-center gap-3 rounded-full border border-white bg-white/80 py-3 pr-[22px] pl-3 text-[clamp(15px,1.3vw,17px)] font-medium tracking-[-0.01em] whitespace-nowrap transition-[border-color,color,background] duration-300 hover:border-sky-soft hover:bg-sky-soft/40 hover:text-navy"
                >
                  <span className="font-landing-mono flex size-[34px] items-center justify-center rounded-full bg-sky-soft text-[11px] font-medium text-navy">
                    {p.code}
                  </span>
                  {p.name}
                  {p.isNew && (
                    <span className="font-landing-mono rounded-full bg-sky-ink px-[7px] py-[3px] text-[10px] text-white">
                      NEW
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

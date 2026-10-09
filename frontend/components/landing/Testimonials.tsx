"use client";

import { useEffect, useRef, useState } from "react";
import { TESTIMONIALS } from "./data";

const count = TESTIMONIALS.length;
const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("");
const TINTS = ["from-[#8cc8ff] to-[#3b93ec]", "from-[#7c6bff] to-[#4a3fd6]", "from-[#2fc2b0] to-[#178a9c]", "from-[#ff9a62] to-[#e8574b]", "from-[#5b6b85] to-[#24324a]"];

// Arc geometry: people sit on a circle whose centre is off to the left.
const R = 240;
const CX = -150;
const CY = 220;
const STEP = 30;

/** Names travel along a curved line on the left; the active person's feedback shows on the right. */
export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState(true);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const go = (i: number) => {
    setShown(false);
    clearTimeout(timeout.current);
    setIdx(((i % count) + count) % count);
    timeout.current = setTimeout(() => setShown(true), 320);
  };

  // Auto-advance; any change of idx (including a click) restarts the timer.
  useEffect(() => {
    const id = setTimeout(() => go(idx + 1), 5600);
    return () => clearTimeout(id);
  }, [idx]);
  useEffect(() => () => clearTimeout(timeout.current), []);

  const t = TESTIMONIALS[idx];

  return (
    <div className="relative mt-4">
      <div className="relative grid items-center gap-8 md:grid-cols-[360px_1fr]">
        <div>
          {/* Arc (desktop) */}
          <div className="relative hidden h-[440px] md:block">
            <svg aria-hidden className="absolute inset-0 size-full overflow-visible" viewBox="0 0 360 440">
              <circle cx={CX} cy={CY} r={R} fill="none" stroke="#cfdbe9" strokeWidth="1.5" />
            </svg>
            {TESTIMONIALS.map((p, i) => {
              let off = (((i - idx) % count) + count) % count;
              if (off > count / 2) off -= count;
              const th = (off * STEP * Math.PI) / 180;
              const x = CX + R * Math.cos(th);
              const y = CY + R * Math.sin(th);
              const on = off === 0;
              const vis = Math.abs(off) <= 1;
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => go(i)}
                  tabIndex={vis ? 0 : -1}
                  aria-label={`Show review from ${p.name}`}
                  className="absolute top-0 left-0 flex cursor-pointer items-center gap-3 text-left transition-all duration-700 ease-[cubic-bezier(.22,.8,.2,1)]"
                  style={{ transform: `translate(${x - (on ? 30 : 22)}px, ${y - (on ? 30 : 22)}px)`, opacity: vis ? (on ? 1 : 0.7) : 0, pointerEvents: vis ? "auto" : "none" }}
                >
                  <span
                    className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white ring-4 ring-page transition-all duration-700 ${TINTS[i % TINTS.length]} ${on ? "size-[60px] text-lg font-semibold shadow-[0_14px_30px_-10px_rgba(59,147,236,0.7)]" : "size-11 text-sm"}`}
                  >
                    {initialsOf(p.name)}
                  </span>
                  <span>
                    <span className={`block font-medium whitespace-nowrap transition-all duration-700 ${on ? "text-[19px]" : "text-[13.5px]"}`}>{p.name}</span>
                    <span className={`block whitespace-nowrap text-subtle ${on ? "text-[14px]" : "text-[11.5px]"}`}>
                      <span className="text-[#17a673]">★</span> {p.rating}.0 · {p.location}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Simple row (mobile) */}
          <div className="mt-6 flex gap-2 md:hidden">
            {TESTIMONIALS.map((p, i) => (
              <button
                key={p.name}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show review from ${p.name}`}
                className={`flex size-11 items-center justify-center rounded-full bg-gradient-to-br text-sm text-white transition-transform ${TINTS[i % TINTS.length]} ${i === idx ? "scale-110 ring-4 ring-sky-soft" : "opacity-60"}`}
              >
                {initialsOf(p.name)}
              </button>
            ))}
          </div>
        </div>

        <figure className="min-h-[220px] transition-[opacity,transform] duration-300" style={{ opacity: shown ? 1 : 0, transform: `translateY(${shown ? 0 : 12}px)` }}>
          <span aria-hidden className="block font-serif text-[72px] leading-none text-sky-ink">“</span>
          <blockquote className="-mt-4 font-serif text-[clamp(20px,2.1vw,28px)] leading-[1.5] text-[#1e2838] italic">{t.quote}</blockquote>
          <figcaption className="mt-7 flex flex-wrap items-center gap-3 text-[14px] text-subtle">
            <span className="font-semibold text-navy not-italic">{t.name}</span>
            <span className="size-1 rounded-full bg-[#c9d0db]" />
            {t.context}
          </figcaption>
          <div className="mt-8 flex gap-2">
            {TESTIMONIALS.map((p, i) => (
              <span key={p.name} className="h-1 rounded-full transition-all duration-500" style={{ width: i === idx ? 28 : 8, background: i === idx ? "#3b93ec" : "#d5dbe5" }} />
            ))}
          </div>
        </figure>
      </div>
    </div>
  );
}

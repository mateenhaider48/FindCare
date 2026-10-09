"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type TouchEvent } from "react";
import DoctorAvatar from "@/components/brand/DoctorAvatar";
import { site } from "@/lib/site";
import { DOCTORS } from "./data";

const n = DOCTORS.length;
const pad = (x: number) => String(x).padStart(2, "0");

export default function DoctorCarousel() {
  const [active, setActive] = useState(0);
  const lastInteract = useRef(0);
  const touchX = useRef(0);

  const shift = (dir: number, auto = false) => {
    if (!auto) lastInteract.current = Date.now();
    setActive((a) => (a + dir + n) % n);
  };

  useEffect(() => {
    const id = setInterval(() => {
      if (Date.now() - lastInteract.current > 9000) setActive((a) => (a + 1) % n);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  const onTouchStart = (e: TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: TouchEvent) => {
    const d = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(d) > 40) shift(d < 0 ? 1 : -1);
  };

  return (
    <>
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-end justify-between gap-7 px-[clamp(20px,4vw,48px)]">
        <div className="max-w-[640px]">
          <div className="font-landing-mono text-xs tracking-[0.06em] text-sky-ink">02 — THE DOCTORS</div>
          <h2 className="mt-5 text-[clamp(34px,4.4vw,58px)] leading-[1.04] font-semibold tracking-[-0.04em]">
            Meet our AI doctors.
          </h2>
          <p className="mt-[18px] text-[17px] leading-[1.6] text-pretty text-body">
            Every AI doctor is trained for one specialty — its questions, its red flags, its next steps.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-landing-mono text-[13px] text-body">
            {pad(active + 1)} / {pad(n)}
          </span>
          <button
            type="button"
            onClick={() => shift(-1)}
            aria-label="Previous doctor"
            className="size-[52px] cursor-pointer rounded-full border border-white bg-white text-lg text-navy transition-all duration-200 hover:border-navy hover:bg-navy hover:text-white"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label="Next doctor"
            className="size-[52px] cursor-pointer rounded-full border border-navy bg-navy text-lg text-white transition-all duration-200 hover:border-sky-ink hover:bg-sky-ink"
          >
            →
          </button>
        </div>
      </div>

      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative mt-14 h-[520px] touch-pan-y"
        style={{ touchAction: "pan-y" }}
      >
        {DOCTORS.map((d, i) => {
          let off = (((i - active) % n) + n) % n;
          if (off > n / 2) off -= n;
          const a = Math.abs(off);
          const c = Math.max(-3, Math.min(3, off));
          const ty = a === 0 ? 0 : a === 1 ? 22 : 44;
          const sc = a === 0 ? 1 : a === 1 ? 0.92 : 0.84;
          return (
            <div
              key={d.key}
              onClick={() => a > 0 && a <= 2 && shift(off)}
              aria-hidden={a !== 0}
              className="absolute top-0 left-1/2 w-[min(290px,74vw)] origin-top transition-[transform,opacity] duration-[800ms] ease-[cubic-bezier(.22,.8,.2,1)]"
              style={{
                transform: `translateX(calc(-50% + ${c * 104}%)) translateY(${ty}px) scale(${sc})`,
                opacity: a === 0 ? 1 : a === 1 ? 0.9 : a === 2 ? 0.6 : 0,
                zIndex: 10 - a,
                pointerEvents: a <= 2 ? "auto" : "none",
                cursor: a ? "pointer" : "default",
              }}
            >
              <div
                className="overflow-hidden rounded-[26px] border border-white bg-white p-1.5 transition-shadow duration-[800ms]"
                style={{ boxShadow: a === 0 ? "0 40px 80px -40px rgba(59,147,236,0.6)" : "0 20px 40px -30px rgba(11,20,36,0.25)" }}
              >
                <div className="relative h-[310px] overflow-hidden rounded-[21px] bg-[radial-gradient(120%_90%_at_50%_100%,#c3e1ff_0%,#e3f0ff_50%,#f3f8ff_100%)] pt-4">
                  <DoctorAvatar state={a === 0 ? "listening" : "idle"} label={`${d.name}, ${d.field}`} {...d.avatar} />
                  <span className="pointer-events-none absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-[11.5px] font-medium backdrop-blur">
                    <span className="size-1.5 rounded-full bg-[#17a673]" />
                    Online
                  </span>
                  <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-white/85 px-2.5 py-1 text-[11.5px] font-semibold text-[#b07800] backdrop-blur">
                    ★ 4.9
                  </span>
                </div>
                <div className="px-3.5 pt-3.5 pb-3">
                  <div className="text-[19px] font-semibold tracking-[-0.02em]">{d.name}</div>
                  <div className="text-[13px] font-medium text-sky-ink">{d.field}</div>
                  <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-[1.45] text-[#5a6476]">{d.desc}</p>
                  <Link
                    href={site.routes.signup}
                    tabIndex={a === 0 ? 0 : -1}
                    className="mt-3 flex items-center justify-between rounded-full bg-navy py-2 pr-2 pl-4 text-[14px] font-medium text-white transition-colors hover:bg-[#1b2d4f] hover:text-white"
                  >
                    Consult {d.name}
                    <span className="flex size-7 items-center justify-center rounded-full bg-sky-soft text-navy">→</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex justify-center gap-2">
        {DOCTORS.map((d, i) => (
          <button
            key={d.key}
            type="button"
            aria-label={`Go to ${d.name}`}
            onClick={() => {
              lastInteract.current = Date.now();
              setActive(i);
            }}
            className="h-1.5 cursor-pointer rounded-full border-none p-0 transition-all duration-[400ms]"
            style={{ width: i === active ? 28 : 6, background: i === active ? "#3b93ec" : "#c9d0db" }}
          />
        ))}
      </div>
    </>
  );
}

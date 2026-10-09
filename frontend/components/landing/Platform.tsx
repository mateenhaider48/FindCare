"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Check, MessageSquareText, Route, ShieldCheck, Stethoscope, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { text: string; kind: "you" | "ai" | "ok" | "flag" | "match" | "dim"; at: [number, number] };
type Step = { icon: LucideIcon; tag: string; title: string; body: string; caption: string; items: Item[] };

const STEPS: Step[] = [
  {
    icon: MessageSquareText,
    tag: "01",
    title: "Describe it in your own words",
    body: "No forms, no jargon. Tell FindCare what you feel, the way you would tell a friend.",
    caption: "Listening",
    items: [
      { text: "My chest feels tight when I run", kind: "you", at: [2, 10] },
      { text: "It's been about a week", kind: "you", at: [58, 4] },
      { text: "No pain when I rest", kind: "you", at: [64, 70] },
      { text: "Does it ease when you stop?", kind: "ai", at: [0, 78] },
    ],
  },
  {
    icon: ShieldCheck,
    tag: "02",
    title: "Red flags are checked first",
    body: "Before anything else, FindCare screens for signs of an emergency and tells you straight away if you need urgent care.",
    caption: "Safety check",
    items: [
      { text: "Pain spreading to arm or jaw", kind: "ok", at: [0, 12] },
      { text: "Fainting", kind: "ok", at: [66, 6] },
      { text: "Breathless at rest", kind: "ok", at: [68, 72] },
      { text: "Tightness on exertion", kind: "flag", at: [0, 80] },
    ],
  },
  {
    icon: Route,
    tag: "03",
    title: "Routed to the right specialist",
    body: "Your case goes to the AI agent for the relevant field, like cardiology, neurology or dermatology.",
    caption: "Matching",
    items: [
      { text: "Cardiology · 98%", kind: "match", at: [60, 8] },
      { text: "Pulmonology", kind: "dim", at: [0, 16] },
      { text: "Dermatology", kind: "dim", at: [2, 76] },
      { text: "Sports medicine", kind: "dim", at: [62, 80] },
    ],
  },
  {
    icon: Stethoscope,
    tag: "04",
    title: "Clear guidance and a next step",
    body: "Self-care, a GP visit, a specialist, or urgent care — with the reasons why, and a summary you can share.",
    caption: "Guidance",
    items: [
      { text: "Book an ECG within 72 hours", kind: "match", at: [56, 8] },
      { text: "Keep a log of episodes", kind: "ok", at: [0, 14] },
      { text: "Emergency care if pain spreads", kind: "flag", at: [0, 80] },
      { text: "Summary ready to share", kind: "ai", at: [60, 76] },
    ],
  },
];

const kindStyle: Record<Item["kind"], string> = {
  you: "rounded-[18px] rounded-br-md bg-navy text-white",
  ai: "rounded-[18px] rounded-bl-md bg-white text-navy shadow-[0_14px_30px_-18px_rgba(11,20,36,0.4)]",
  ok: "rounded-full bg-white/80 text-body",
  flag: "rounded-full bg-[#fff1df] text-[#a86200]",
  match: "rounded-full bg-sky-soft font-semibold text-navy shadow-[0_14px_30px_-14px_rgba(59,147,236,0.8)]",
  dim: "rounded-full bg-white/60 text-[#9aa3b2]",
};

function ItemChip({ item }: { item: Item }) {
  return (
    <span className={cn("inline-flex items-center gap-2 px-4 py-2.5 text-[14px] whitespace-nowrap", kindStyle[item.kind])}>
      {item.kind === "ok" && <Check className="size-4 text-[#17a673]" />}
      {item.kind === "flag" && <AlertTriangle className="size-4" />}
      {item.text}
    </span>
  );
}

/**
 * "What is FindCare". On large screens the section pins to the viewport and
 * scrolling steps through the four stages around a central circle.
 */
export default function Platform() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      if (span <= 0) return;
      const p = Math.min(1, Math.max(0, -r.top / span));
      setProgress(p);
      setActive(Math.min(STEPS.length - 1, Math.floor(p * STEPS.length)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="platform" ref={ref} className="relative scroll-mt-4 lg:h-[340vh]">
      <div className="mx-auto max-w-[1280px] px-[clamp(20px,4vw,48px)] py-[clamp(72px,9vw,120px)] lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:py-0">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <div className="font-landing-mono text-xs tracking-[0.06em] text-sky-ink">01 — WHAT IS FINDCARE</div>
            <h2 className="mt-5 text-[clamp(32px,3.6vw,48px)] leading-[1.06] font-semibold tracking-[-0.04em] text-balance">
              A first conversation with care, open to everyone.
            </h2>
            <p className="mt-5 max-w-[480px] text-[17px] leading-[1.65] text-pretty text-body">
              FindCare is a network of specialised AI agents, each built around one medical field. Here is what happens when you start.
            </p>

            <ol className="mt-8 flex flex-col gap-1">
              {STEPS.map((s, i) => {
                const on = i === active;
                const fill = Math.min(1, Math.max(0, progress * STEPS.length - i));
                return (
                  <li key={s.tag} className="flex gap-4 py-3">
                    <span className="relative mt-1 hidden h-10 w-[3px] shrink-0 overflow-hidden rounded-full bg-[#dfe5ee] lg:block">
                      <span className="absolute inset-x-0 top-0 rounded-full bg-sky-ink" style={{ height: `${fill * 100}%` }} />
                    </span>
                    <span className="font-landing-mono mt-1 text-xs text-sky-ink lg:hidden">{s.tag}</span>
                    <div>
                      <div className={cn("text-[17px] font-semibold tracking-[-0.015em] transition-colors", on ? "text-navy" : "lg:text-[#9aa3b2]")}>{s.title}</div>
                      <div className={cn("grid transition-all duration-500", on ? "mt-1 grid-rows-[1fr] opacity-100" : "max-lg:mt-1 max-lg:grid-rows-[1fr] lg:grid-rows-[0fr] lg:opacity-0")}>
                        <p className="overflow-hidden text-[14.5px] leading-[1.55] text-body">{s.body}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Circular stage: a glowing centre with the step's details floating around it */}
          <div className="relative mx-auto hidden aspect-square w-full max-w-[540px] lg:block">
            <div aria-hidden className="absolute inset-0 rounded-full bg-[radial-gradient(circle,#c3e1ff_0%,rgba(195,225,255,0.35)_45%,transparent_70%)]" />
            {[0, 16, 30].map((inset, i) => (
              <div
                key={inset}
                aria-hidden
                data-motion
                className={cn("absolute rounded-full border border-dashed", i === 0 ? "border-[#b9d6f5]" : "border-[#cfe3fa]")}
                style={{ inset: `${inset}%`, animation: `fcSpin ${60 + i * 25}s linear infinite ${i % 2 ? "reverse" : ""}` }}
              />
            ))}

            {/* Big faint step number */}
            <div aria-hidden className="absolute inset-0 flex items-center justify-center">
              <span key={active} className="text-[190px] leading-none font-semibold tracking-[-0.08em] text-white/45 transition-opacity">
                {STEPS[active].tag}
              </span>
            </div>

            {/* Centre disc */}
            <div className="absolute top-1/2 left-1/2 flex size-[132px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-white shadow-[0_0_0_14px_rgba(195,225,255,0.55),0_30px_60px_-24px_rgba(59,147,236,0.7)]">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.tag}
                    className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500"
                    style={{ opacity: i === active ? 1 : 0, transform: `scale(${i === active ? 1 : 0.7})` }}
                  >
                    <Icon className="size-9 text-sky-ink" />
                    <span className="mt-2 text-[12px] font-medium text-body">{s.caption}</span>
                  </div>
                );
              })}
            </div>

            {/* Floating items */}
            {STEPS.map((s, i) =>
              s.items.map((it, j) => (
                <div
                  key={s.tag + j}
                  aria-hidden={i !== active}
                  className="absolute transition-all duration-700 ease-[cubic-bezier(.22,.8,.2,1)]"
                  style={{
                    left: `${it.at[0]}%`,
                    top: `${it.at[1]}%`,
                    opacity: i === active ? 1 : 0,
                    transform: `translateY(${i === active ? 0 : (i < active ? -24 : 24)}px) scale(${i === active ? 1 : 0.92})`,
                    transitionDelay: i === active ? `${j * 80}ms` : "0ms",
                  }}
                >
                  <ItemChip item={it} />
                </div>
              )),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

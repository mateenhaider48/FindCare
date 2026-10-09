import { Activity, Brain, ClipboardCheck, HeartPulse, Lock, MessageCircle, Moon, Pill, ShieldCheck, Stethoscope, type LucideIcon } from "lucide-react";
import Reveal from "./Reveal";

const cards = [
  { title: "Understand your symptoms", body: "Describe what you feel; your AI doctor asks the right follow-ups.", pos: "lg:top-0 lg:left-1/2 lg:-translate-x-1/2" },
  { title: "Find the right specialty", body: "Routed to the specialist agent best suited to your concern.", pos: "lg:top-[30%] lg:left-0" },
  { title: "Spot red flags early", body: "Urgent warning signs are checked before anything else.", pos: "lg:top-[30%] lg:right-0" },
  { title: "Know your next step", body: "Self-care, a GP, a specialist or urgent care — with reasons.", pos: "lg:bottom-0 lg:left-[8%]" },
  { title: "Keep a shareable summary", body: "Every consultation ends with notes you can show your doctor.", pos: "lg:bottom-0 lg:right-[8%]" },
];

type Ring = { size: number; dur: number; reverse?: boolean; icons: LucideIcon[] };
const RINGS: Ring[] = [
  { size: 620, dur: 70, icons: [HeartPulse, Brain, Pill, Moon, Lock] },
  { size: 440, dur: 50, reverse: true, icons: [MessageCircle, ClipboardCheck, Activity] },
  { size: 270, dur: 34, icons: [ShieldCheck, Stethoscope] },
];

const tile =
  "flex size-12 items-center justify-center rounded-2xl border border-white bg-gradient-to-b from-white to-[#eaf4ff] text-sky-ink shadow-[0_14px_28px_-12px_rgba(59,147,236,0.65)]";

/** Glowing AI core in the middle of the orbit. */
function Core() {
  return (
    <div className="relative size-[120px]">
      {[0, 1.3].map((d) => (
        <span key={d} data-motion className="absolute inset-0 rounded-full border border-sky-ink/40" style={{ animation: `fcOrbRing 2.6s ease-out ${d}s infinite` }} />
      ))}
      <span
        data-motion
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle at 32% 28%, #ffffff 0%, #e8f4ff 18%, #c3e1ff 42%, #7fbcf5 72%, #3b93ec 100%)",
          boxShadow: "0 0 50px 10px rgba(195,225,255,0.9), inset -10px -14px 30px rgba(59,147,236,0.45), inset 8px 10px 22px rgba(255,255,255,0.9)",
          animation: "fcOrb 8s ease-in-out infinite",
        }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-[13px] font-semibold tracking-[0.04em] text-navy">AI</span>
    </div>
  );
}

export default function HowItHelps() {
  return (
    <section className="py-[clamp(80px,10vw,130px)]">
      <Reveal className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,48px)] text-center">
        <span className="inline-flex rounded-full bg-sky-soft px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.08em] text-navy">KEY ADVANTAGES</span>
        <h2 className="mt-4 text-[clamp(32px,4vw,50px)] font-semibold tracking-[-0.04em]">How FindCare helps</h2>
        <p className="mx-auto mt-3 max-w-[520px] text-[16px] leading-[1.6] text-body">One AI junior doctor, many ways to help — all in one conversation.</p>

        <div className="relative mt-12 lg:h-[680px]">
          {/* Rotating orbit (decorative) */}
          <div aria-hidden className="absolute inset-0 hidden items-center justify-center lg:flex">
            {RINGS.map((r) => (
              <div
                key={r.size}
                data-motion
                className="absolute rounded-full border-[1.5px] border-dashed border-[#a9cdf2]"
                style={{ width: r.size, height: r.size, animation: `fcSpin ${r.dur}s linear infinite${r.reverse ? " reverse" : ""}` }}
              >
                {r.icons.map((Icon, i) => {
                  const ang = (360 / r.icons.length) * i;
                  return (
                    <div key={i} className="absolute top-1/2 left-1/2" style={{ transform: `rotate(${ang}deg) translateY(-${r.size / 2}px)` }}>
                      <div style={{ transform: `rotate(${-ang}deg)` }}>
                        <div
                          data-motion
                          className={`${tile} -translate-x-1/2 -translate-y-1/2`}
                          style={{ animation: `fcSpin ${r.dur}s linear infinite${r.reverse ? "" : " reverse"}` }}
                        >
                          <Icon className="size-5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <Core />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:block">
            {cards.map((c) => (
              <div
                key={c.title}
                className={`relative z-10 rounded-[22px] border border-white bg-white/85 p-6 text-left backdrop-blur-md shadow-[0_30px_60px_-34px_rgba(11,20,36,0.35)] lg:absolute lg:w-[280px] lg:text-center ${c.pos}`}
              >
                <h3 className="text-[18px] font-semibold tracking-[-0.02em]">{c.title}</h3>
                <p className="mt-2 text-[14.5px] leading-[1.55] text-body">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

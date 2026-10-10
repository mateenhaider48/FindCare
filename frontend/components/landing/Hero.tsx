import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HeartPulse, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { site } from "@/lib/site";
import LandingNav from "./LandingNav";
import aiDoctor from "@/public/images/ai-doctor.png";

const glass =
  "rounded-[20px] border border-white/90 bg-white/75 shadow-[0_24px_50px_-26px_rgba(59,147,236,0.55)] backdrop-blur-xl";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Light-blue glow on the page background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 -left-40 size-[620px] rounded-full bg-sky-soft opacity-70 blur-[120px]" />
        <div className="absolute top-10 right-[-10%] size-[700px] rounded-full bg-sky-soft opacity-90 blur-[130px]" />
        
      </div>

      <LandingNav />

      <div className="relative z-10 mx-auto grid max-w-[1280px] items-center gap-6 px-[clamp(20px,4vw,48px)] pt-4 lg:grid-cols-[1.05fr_1fr]">
        {/* Text */}
        <div className="py-10 lg:py-16">
          <h1 className="text-[clamp(38px,4.6vw,64px)] leading-[1.04] font-semibold tracking-[-0.04em] text-balance text-navy">
            <span className="text-sky-ink">Understand your symptoms</span> with AI doctors
          </h1>
          <p className="mt-5 max-w-[500px] text-[clamp(16px,1.25vw,18px)] leading-[1.65] text-pretty text-body">
            Specialist AI agents that work like junior doctors. They listen, check for red flags, match you to the right specialty and guide
            your next step — at any hour.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={site.routes.signup}
              className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3.5 text-[15px] font-medium text-white shadow-[0_14px_30px_-14px_rgba(11,20,36,0.8)] transition-transform duration-200 hover:-translate-y-0.5 hover:text-white"
            >
              Start a consultation <ArrowRight className="size-4" />
            </Link>
            <a
              href="#doctors"
              className="inline-flex items-center gap-2 rounded-full border border-white bg-white/80 px-6 py-3.5 text-[15px] font-medium text-navy backdrop-blur transition-transform duration-200 hover:-translate-y-0.5 hover:text-navy"
            >
              Meet the AI doctors
            </a>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3 text-[13.5px] text-subtle">
            {["Red flags checked first", "Private by default", "Free to start"].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-sky-ink" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Robot with cards around it */}
        <div className="relative mx-auto h-[clamp(420px,46vw,600px)] w-full max-w-[560px]">
          <div aria-hidden className="absolute top-[10%] left-1/2 size-[78%] -translate-x-1/2 rounded-full bg-gradient-to-b from-sky-soft to-sky-soft/0" />
          <Image
            src={aiDoctor}
            alt="FindCare AI doctor holding a tablet"
            priority
            sizes="(min-width: 1024px) 560px, 90vw"
            className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 object-contain object-bottom"
          />

          <div data-motion className={`${glass} absolute top-[14%] left-0 w-[150px] p-3.5 max-sm:hidden`} style={{ animation: "fcBob 6s ease-in-out infinite" }}>
            <div className="flex items-center justify-between text-[12.5px] text-body">
              Heart rate <HeartPulse className="size-4 text-[#ff5c7a]" />
            </div>
            <div className="mt-1.5 text-[24px] font-semibold tracking-[-0.03em]">
              72 <span className="text-xs font-normal text-subtle">BPM</span>
            </div>
            <svg viewBox="0 0 100 24" className="mt-1 h-5 w-full" aria-hidden>
              <path d="M0 14h22l5-9 6 17 5-11 4 3h58" fill="none" stroke="#3b93ec" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>

          <div data-motion className={`${glass} absolute top-[6%] right-0 flex items-center gap-2 px-3.5 py-2.5 text-[13px] font-medium max-sm:hidden`} style={{ animation: "fcBob 7s ease-in-out -3s infinite" }}>
            <span className="size-2 rounded-full bg-[#17a673] shadow-[0_0_0_3px_rgba(23,166,115,0.2)]" />
            24/7 online
          </div>

          <div data-motion className={`${glass} absolute top-[48%] right-[-2%] flex w-[250px] items-center gap-3 p-3 max-sm:hidden`} style={{ animation: "fcBob 7s ease-in-out -2s infinite" }}>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-soft text-navy">
              <ShieldCheck className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-semibold">Red-flag check</div>
              <div className="text-[11.5px] text-subtle">Emergency signs screened first</div>
            </div>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy text-white">
              <Phone className="size-3.5" />
            </span>
          </div>

          <div data-motion className={`${glass} absolute bottom-[6%] left-[-8%] w-[210px] p-3.5 max-sm:hidden`} style={{ animation: "fcBob 8s ease-in-out -4s infinite" }}>
            <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.06em] text-sky-ink">
              <Sparkles className="size-3.5" /> SPECIALTY MATCH
            </div>
            <div className="mt-2 flex items-center justify-between rounded-xl bg-sky-soft px-3 py-2 text-[13.5px] font-medium text-navy">
              Cardiology <span>98%</span>
            </div>
            <div className="mt-1 flex items-center justify-between px-3 py-1.5 text-[12.5px] text-subtle">
              Pulmonology <span>41%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fade the glow into the page background, full width so there is no edge */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-page to-transparent" />
    </section>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const FAQS = [
  ["What is FindCare?", "FindCare is an AI junior doctor. It listens to your symptoms, asks follow-up questions, checks for red flags and gives first-level guidance, bringing in a specialist AI doctor when needed."],
  ["Are the doctors real people?", "No. Every doctor on FindCare is an AI agent built around one medical field. There are no human doctor accounts — every user is a patient."],
  ["Can FindCare diagnose me?", "FindCare gives guidance, not a diagnosis. It helps you understand what might be going on and what your next step should be, such as self-care, a GP visit or urgent care."],
  ["What happens in an emergency?", "Red flags are checked first. If anything you describe sounds urgent, FindCare tells you straight away to contact emergency services. It is not for emergencies."],
  ["Is my health information private?", "Your conversations are private and encrypted. You can view your consultation history and share a summary with your own doctor if you choose."],
  ["How much does it cost?", "You can start a consultation for free. We will share plans for extra features before anything changes."],
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="scroll-mt-4 py-[clamp(80px,10vw,130px)]">
      <div className="mx-auto grid max-w-[1180px] gap-12 px-[clamp(20px,4vw,48px)] lg:grid-cols-[380px_1fr]">
        <div>
          <h2 className="text-[clamp(32px,3.8vw,46px)] leading-[1.05] font-semibold tracking-[-0.04em]">Frequently asked questions</h2>
          <p className="mt-4 text-[15.5px] leading-[1.6] text-body">Quick answers about how FindCare works, safety and privacy.</p>

          <div className="mt-10 rounded-[26px] bg-sky-soft p-6 text-navy shadow-[0_30px_60px_-30px_rgba(59,147,236,0.8)]">
            <div className="flex items-center">
              {["A", "M", "K"].map((l, i) => (
                <span key={l} className={cn("flex size-10 items-center justify-center rounded-full border-2 border-sky-soft text-sm font-semibold", ["bg-[#ffb86b]", "bg-[#7fd4c1]", "bg-[#c3a6ff]"][i], i && "-ml-2.5")}>
                  {l}
                </span>
              ))}
              <span className="mx-2 text-navy/60">+</span>
              <span className="flex size-10 items-center justify-center rounded-full bg-white text-xs font-semibold text-navy">You</span>
            </div>
            <div className="mt-4 text-[19px] font-semibold">Still have questions?</div>
            <p className="mt-1 text-sm text-navy/70">Ask an AI doctor directly — it only takes a minute.</p>
            <Link
              href={site.routes.signup}
              className="mt-5 inline-flex items-center gap-3 rounded-full bg-[#0b1424] py-2 pr-2 pl-5 text-sm font-medium text-white shadow-[0_0_0_4px_rgba(255,255,255,0.6)] hover:text-white"
            >
              Talk to an AI doctor
              <span className="flex size-8 items-center justify-center rounded-full bg-white text-navy">
                <ArrowRight className="size-4" />
              </span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map(([q, a], i) => {
            const on = open === i;
            return (
              <div
                key={q}
                className={cn(
                  "rounded-[22px] border transition-all duration-300",
                  on ? "border-[#0b1424] bg-[#1c1f26] text-white shadow-[0_24px_40px_-20px_rgba(11,20,36,0.7)]" : "border-white bg-white shadow-[0_10px_30px_-24px_rgba(11,20,36,0.4)]",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(on ? -1 : i)}
                  aria-expanded={on}
                  className="flex w-full cursor-pointer items-center justify-between gap-6 px-6 py-5 text-left text-[clamp(16px,1.4vw,19px)] font-medium"
                >
                  {i + 1}. {q}
                  {on ? <Minus className="size-5 shrink-0" /> : <Plus className="size-5 shrink-0" />}
                </button>
                <div className={cn("grid transition-all duration-300", on ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <p className="overflow-hidden px-6 text-[15px] leading-[1.6] text-[#aab2c0]">
                    <span className="block pb-5">{a}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

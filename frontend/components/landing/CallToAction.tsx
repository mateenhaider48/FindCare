import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/lib/site";
import Reveal from "./Reveal";

export default function CallToAction() {
  return (
    <section className="px-[clamp(16px,3vw,40px)] pt-[clamp(48px,6vw,80px)]">
      <Reveal className="relative mx-auto max-w-[960px] overflow-hidden rounded-[32px] bg-[#070d1a] px-6 py-[clamp(48px,6vw,72px)] text-center text-white">
        {/* Light-blue glow from the top */}
        <div aria-hidden className="pointer-events-none absolute -top-[70%] left-1/2 h-[130%] w-[90%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,#c3e1ff_0%,rgba(130,190,250,0.75)_35%,rgba(59,147,236,0.25)_65%,transparent_100%)]" />

        <div className="relative">
          <h2 className="mx-auto max-w-[600px] text-[clamp(28px,3.6vw,44px)] leading-[1.08] font-semibold tracking-[-0.035em] text-balance">
            Ready to talk to an AI doctor?
          </h2>
          <p className="mx-auto mt-3 max-w-[440px] text-[15.5px] leading-[1.6] text-[#b8c6dc]">
            Tell us how you feel. In a few minutes you will know what matters and where to go next.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href={site.routes.signup}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[15px] font-medium text-navy transition-transform hover:-translate-y-0.5 hover:text-navy"
            >
              Start for free <ArrowRight className="size-4" />
            </Link>
            <a href="#doctors" className="inline-flex items-center rounded-full border border-white/25 px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-white/10 hover:text-white">
              Browse AI doctors
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

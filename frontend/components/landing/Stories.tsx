import Reveal from "./Reveal";
import Testimonials from "./Testimonials";

export default function Stories() {
  return (
    <section id="stories" className="scroll-mt-4 py-[clamp(80px,11vw,150px)]">
      <div className="mx-auto max-w-[1280px] px-[clamp(20px,4vw,48px)]">
        <Reveal>
          <div className="font-landing-mono text-xs tracking-[0.06em] text-sky-ink">04 — STORIES</div>
          <h2 className="mt-5 text-[clamp(34px,4.4vw,58px)] leading-[1.04] font-semibold tracking-[-0.04em]">
            Real people. <span className="text-[#8a93a3]">Better care experiences.</span>
          </h2>
          <div className="mt-6 flex items-center gap-3">
            <span className="h-1 w-10 rounded-full bg-sky-ink" />
            <h3 className="text-[20px] font-semibold tracking-[-0.02em]">Patient reviews</h3>
          </div>
        </Reveal>
        <Reveal>
          <Testimonials />
        </Reveal>
      </div>
    </section>
  );
}

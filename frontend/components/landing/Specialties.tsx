import Reveal from "./Reveal";
import SpecialtyMarquee from "./SpecialtyMarquee";

export default function Specialties() {
  return (
    <section id="specialties" className="overflow-hidden py-[clamp(80px,11vw,150px)]">
      <Reveal className="mx-auto max-w-[820px] px-[clamp(20px,4vw,48px)] text-center">
        <div className="font-landing-mono text-xs tracking-[0.06em] text-sky-ink">03 — SPECIALTIES</div>
        <h2 className="mt-5 text-[clamp(34px,4.4vw,58px)] leading-[1.04] font-semibold tracking-[-0.04em] text-balance">
          AI doctors across every specialty.
        </h2>
        <p className="mx-auto mt-[18px] max-w-[540px] text-[17px] leading-[1.6] text-body">
          From a skin concern to a second opinion on lab results — there&apos;s a specialist ready to listen.
        </p>
      </Reveal>
      <SpecialtyMarquee />
    </section>
  );
}

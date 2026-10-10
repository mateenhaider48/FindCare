const logos = [
  <span key="h" className="text-[22px] font-bold tracking-[-0.04em]">halcyon</span>,
  <span key="v" className="text-[17px] font-medium tracking-[0.18em]">VERTEX BIO</span>,
  <span key="m" className="text-xl font-light tracking-[-0.01em]">
    Meridian<span className="font-semibold">Cloud</span>
  </span>,
  <span key="a" className="font-landing-mono text-[17px] font-medium">arcflow_</span>,
  <span key="l" className="text-xl font-semibold tracking-[-0.02em]">◐ Lumen Health</span>,
  <span key="s" className="text-lg tracking-[0.04em]">
    SYNAPSE<span className="font-bold">AI</span>
  </span>,
  <span key="n" className="text-xl font-semibold tracking-[-0.03em] italic">Nordwell</span>,
  <span key="c" className="text-[17px] font-medium tracking-[0.12em]">CARDIA·LABS</span>,
];

/** Partner logos on an endless horizontal loop, under a labelled divider. */
export default function Partners() {
  return (
    <section aria-label="Technology partners" className="relative py-12">
      <div className="mx-auto flex max-w-[1180px] items-center gap-5 px-[clamp(20px,4vw,48px)]">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#cfd8e4]" />
        <span className="inline-flex items-center gap-2.5 rounded-full border border-white bg-white/70 py-1.5 pr-4 pl-1.5 text-[13px] text-body shadow-[0_8px_24px_-16px_rgba(59,147,236,0.7)] backdrop-blur">
          <span className="flex size-6 items-center justify-center rounded-full bg-sky-soft text-[11px] font-semibold text-navy">8+</span>
          Trusted partners in health &amp; technology
        </span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#cfd8e4]" />
      </div>

      <div className="relative mt-9 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div data-motion className="flex w-max items-center text-[#8e98a8]" style={{ animation: "fcMarquee 32s linear infinite" }}>
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center gap-[clamp(56px,7vw,104px)] pr-[clamp(56px,7vw,104px)] opacity-80 grayscale">
              {logos}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

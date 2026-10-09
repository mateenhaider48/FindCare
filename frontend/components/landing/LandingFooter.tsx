import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/lib/site";
import { Wordmark } from "./LandingNav";

const COLUMNS: { title: string; links: [string, string][] }[] = [
  {
    title: "Product",
    links: [
      ["How it works", "#platform"],
      ["AI doctors", "#doctors"],
      ["Specialties", "#specialties"],
      ["Start a consultation", site.routes.signup],
    ],
  },
  {
    title: "Resources",
    links: [
      ["FAQ", "#faq"],
      ["Patient stories", "#stories"],
      ["Health guides", "#"],
      ["Support", "#"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "#"],
      ["Careers", "#"],
      ["Contact", "mailto:hello@findcare.ai"],
      ["Partners", "#"],
    ],
  },
];

const SOCIALS = [
  { label: "X", d: "M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.2h1.7L7.4 4.7H5.58l11.09 14.5Z" },
  { label: "Instagram", d: "M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2ZM17 6a1.1 1.1 0 1 0 0 2.2A1.1 1.1 0 0 0 17 6ZM7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 1.8a3.7 3.7 0 0 0-3.7 3.7v9a3.7 3.7 0 0 0 3.7 3.7h9a3.7 3.7 0 0 0 3.7-3.7v-9a3.7 3.7 0 0 0-3.7-3.7h-9Z" },
  { label: "LinkedIn", d: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.6h.06c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.62 4.8 6.03V21h-4v-5.08c0-1.21-.02-2.77-1.7-2.77-1.7 0-1.95 1.32-1.95 2.68V21H9.5V9.75Z" },
  { label: "YouTube", d: "M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.3 5 12 5 12 5s-6.3 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.7 19 12 19 12 19s6.3 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" },
];

export default function LandingFooter() {
  return (
    <footer className="relative pt-[clamp(56px,7vw,96px)]">
      <div className="mx-auto max-w-[1160px] px-[clamp(16px,3vw,40px)]">
        <div className="relative overflow-hidden rounded-[30px] border border-white bg-white/80 p-[clamp(28px,4vw,48px)] shadow-[0_30px_70px_-50px_rgba(11,20,36,0.45)] backdrop-blur">
          <div aria-hidden className="pointer-events-none absolute -top-32 -right-24 size-[360px] rounded-full bg-sky-soft opacity-60 blur-[90px]" />
          <div className="relative grid gap-10 md:grid-cols-[1.2fr_2fr]">
            <div>
              <Wordmark />
              <p className="mt-4 max-w-[340px] text-[14.5px] leading-[1.65] text-[#5a6476]">
                An AI junior doctor that helps you understand your symptoms, reach the right specialty and know your next step.
              </p>
              <Link
                href={site.routes.signup}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy py-2 pr-2 pl-5 text-[14px] font-medium text-white hover:text-white"
              >
                Start a consultation
                <span className="flex size-7 items-center justify-center rounded-full bg-sky-soft text-navy">
                  <ArrowRight className="size-3.5" />
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {COLUMNS.map((c) => (
                <div key={c.title}>
                  <div className="text-[13px] font-semibold tracking-[0.04em] text-navy uppercase">{c.title}</div>
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {c.links.map(([label, href]) => (
                      <li key={label}>
                        <Link href={href} className="text-[14.5px] text-[#5a6476] transition-colors hover:text-sky-ink">
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#e8edf3] pt-6">
            <span className="text-[13.5px] text-subtle">Follow FindCare</span>
            <div className="flex gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex size-10 items-center justify-center rounded-full bg-page text-[#1e2838] transition-colors hover:bg-sky-soft"
                >
                  <svg viewBox="0 0 24 24" className="size-[17px]" fill="currentColor" aria-hidden>
                    <path d={s.d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Legal line, outside the card */}
        <div className="flex flex-wrap justify-between gap-x-8 gap-y-3 px-2 pt-7 pb-6 text-[13px] text-subtle">
          <span>© 2026 FindCare. Guidance, not diagnosis. Not for emergencies.</span>
          <div className="flex flex-wrap gap-6">
            {["Privacy policy", "Terms of service", "Medical disclaimer"].map((l) => (
              <a key={l} href="#" className="hover:text-navy">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Big wordmark, stretched edge to edge */}
      <svg aria-hidden viewBox="0 0 1000 200" preserveAspectRatio="none" className="block h-auto w-full select-none">
        <defs>
          <linearGradient id="fc-foot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c3e1ff" />
            <stop offset="1" stopColor="#c3e1ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <text x="4" y="178" textLength="990" lengthAdjust="spacingAndGlyphs" fill="url(#fc-foot)" fontSize="232" fontWeight="700">
          FindCare
        </text>
      </svg>
    </footer>
  );
}

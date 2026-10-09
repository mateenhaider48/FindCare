"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { site } from "@/lib/site";

const links = [
  { label: "Home", href: "#top" },
  { label: "How it works", href: "#platform" },
  { label: "AI Doctors", href: "#doctors" },
  { label: "Specialties", href: "#specialties" },
  { label: "Stories", href: "#stories" },
  { label: "FAQ", href: "#faq" },
];

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 text-[19px] font-semibold tracking-[-0.02em] text-navy ${className}`}>
      <span className="relative flex size-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#8cc8ff] to-sky-ink shadow-[0_8px_20px_-8px_rgba(59,147,236,0.8)]">
        <svg viewBox="0 0 24 24" className="size-4 text-white" fill="none" stroke="currentColor" strokeWidth={3.2} strokeLinecap="round" aria-hidden>
          <path d="M12 5v14M5 12h14" />
        </svg>
      </span>
      FindCare
    </span>
  );
}

/** Capsule navigation: logo left, white pill of links centred, sign-up right. */
export default function LandingNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="relative z-20 mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-[clamp(20px,4vw,48px)] py-5">
      <Link href="/" aria-label="FindCare home">
        <Wordmark />
      </Link>

      <nav aria-label="Main" className="hidden items-center gap-1 rounded-full border border-white/80 bg-white/75 p-1.5 shadow-[0_10px_30px_-14px_rgba(59,147,236,0.45)] backdrop-blur-md min-[960px]:flex">
        {links.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            className={`rounded-full px-4 py-2 text-[14.5px] transition-colors ${i === 0 ? "bg-navy font-medium text-white hover:text-white" : "text-body hover:bg-sky-soft/60 hover:text-navy"}`}
          >
            {l.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Link href={site.routes.login} className="hidden rounded-full px-4 py-2.5 text-[14.5px] font-medium text-navy hover:text-sky-ink sm:inline">
          Sign in
        </Link>
        <Link
          href={site.routes.signup}
          className="rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-white shadow-[0_10px_24px_-12px_rgba(11,20,36,0.8)] transition-colors hover:bg-[#1b2d4f] hover:text-white"
        >
          Sign up
        </Link>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex size-10 items-center justify-center rounded-full border border-white bg-white/80 text-navy min-[960px]:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav aria-label="Mobile" className="absolute inset-x-4 top-full z-30 flex flex-col rounded-3xl border border-[#e6ebf3] bg-white p-3 shadow-[0_24px_50px_-20px_rgba(11,20,36,0.35)] min-[960px]:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-[15px] text-navy hover:bg-sky-soft/60">
              {l.label}
            </a>
          ))}
          <Link href={site.routes.login} className="rounded-2xl px-4 py-3 text-[15px] font-medium text-sky-ink hover:bg-sky-soft/60">
            Sign in
          </Link>
        </nav>
      )}
    </header>
  );
}

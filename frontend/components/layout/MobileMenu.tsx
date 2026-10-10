"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/lib/site";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="grid size-10 place-items-center rounded-full text-ink hover:bg-mist"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open && (
        <div id="mobile-menu" className="absolute inset-x-0 top-16 border-b border-line bg-white px-4 pb-6 shadow-card">
          <nav className="flex flex-col py-2" aria-label="Mobile">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className="rounded-lg px-2 py-3 text-base font-medium text-slate hover:bg-mist hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="grid grid-cols-2 gap-3">
            <ButtonLink href={site.routes.login} variant="secondary" onClick={close}>
              Log in
            </ButtonLink>
            <ButtonLink href={site.routes.signup} onClick={close}>
              Get started
            </ButtonLink>
          </div>
        </div>
      )}
    </div>
  );
}

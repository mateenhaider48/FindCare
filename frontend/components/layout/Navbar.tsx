import Link from "next/link";
import Logo from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { site } from "@/lib/site";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-white/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-slate hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <ButtonLink href={site.routes.login} variant="ghost" size="sm">
            Log in
          </ButtonLink>
          <ButtonLink href={site.routes.signup} size="sm">
            Get started
          </ButtonLink>
        </div>
        <MobileMenu />
      </Container>
    </header>
  );
}

import Link from "next/link";
import Logo from "@/components/brand/Logo";
import Container from "@/components/ui/Container";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-line/60 bg-white">
      <Container className="flex flex-col gap-8 py-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <Logo />
          <p className="text-sm text-muted">
            FindCare gives guidance, not a diagnosis. In an emergency, call your local emergency number right away.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-3" aria-label="Footer">
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-slate hover:text-ink">
              {item.label}
            </Link>
          ))}
          <Link href={site.routes.login} className="text-sm text-slate hover:text-ink">
            Log in
          </Link>
        </nav>
      </Container>
      <Container className="border-t border-line/60 py-6 text-xs text-muted">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </Container>
    </footer>
  );
}

import Link from "next/link";
import { Wordmark } from "@/components/landing/LandingNav";

// Auth screens: one screen, no page scroll. The card sits on the same
// light-blue gradient as the landing banner.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-page font-landing text-navy">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 -left-40 size-[620px] rounded-full bg-sky-soft opacity-80 blur-[120px]" />
        <div className="absolute top-[20%] -right-48 size-[680px] rounded-full bg-sky-soft opacity-90 blur-[130px]" />
        <div className="absolute -bottom-56 left-[25%] size-[560px] rounded-full bg-sky-soft opacity-60 blur-[140px]" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-[clamp(16px,4vw,48px)] py-4">
        <Link href="/" aria-label="FindCare home">
          <Wordmark />
        </Link>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-4 pb-5">{children}</main>
    </div>
  );
}

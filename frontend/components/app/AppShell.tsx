"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { History, LayoutDashboard, LogOut, Settings, Stethoscope, Users } from "lucide-react";
import { signOut } from "@/lib/auth";
import Logo from "@/components/brand/Logo";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const items = [
  { label: "Dashboard", href: site.routes.dashboard, icon: LayoutDashboard },
  { label: "Consultation", href: site.routes.consultation, icon: Stethoscope },
  { label: "AI doctors", href: site.routes.doctors, icon: Users },
  { label: "History", href: site.routes.history, icon: History },
  { label: "Settings", href: site.routes.settings, icon: Settings },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const logout = () => {
    signOut();
    router.push("/login");
  };
  const active = (href: string) => path === href || path.startsWith(href + "/");
  return (
    <div className="flex min-h-screen bg-page">
      <aside className="sticky top-0 hidden h-screen print:hidden w-64 shrink-0 flex-col border-r border-line/70 bg-white p-5 lg:flex">
        <Logo />
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {items.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={active(href) ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                active(href) ? "bg-primary-soft text-primary" : "text-slate hover:bg-mist hover:text-ink",
              )}
            >
              <Icon className="size-4.5" />
              {label}
            </Link>
          ))}
        </nav>
        <button type="button" onClick={logout} className="mb-3 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate transition-colors hover:bg-danger-soft hover:text-danger">
          <LogOut className="size-4.5" />
          Log out
        </button>
        <p className="rounded-xl bg-warning-soft p-3 text-xs leading-relaxed text-warning">
          FindCare gives guidance only. For emergencies call your local emergency number.
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pb-16 lg:pb-0">
        <header className="flex items-center justify-between border-b border-line/70 bg-white px-4 py-3 print:hidden lg:hidden">
          <Logo />
          <button type="button" onClick={logout} aria-label="Log out" className="rounded-full p-2 text-slate hover:bg-mist">
            <LogOut className="size-5" />
          </button>
        </header>
        {children}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid print:hidden grid-cols-4 border-t border-line/70 bg-white lg:hidden">
        {items
          .filter((i) => i.href !== site.routes.settings)
          .map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn("flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium", active(href) ? "text-primary" : "text-muted")}
            >
              <Icon className="size-5" />
              {label.split(" ")[0]}
            </Link>
          ))}
      </nav>
    </div>
  );
}

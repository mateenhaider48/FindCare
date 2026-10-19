import AppShell from "@/components/app/AppShell";
import { requireUser } from "@/lib/session";

// Every app page needs a verified session, not just the cookie the proxy saw.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return <AppShell>{children}</AppShell>;
}

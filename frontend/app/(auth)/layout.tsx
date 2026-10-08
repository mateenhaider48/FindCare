import { ShieldCheck } from "lucide-react";
import DoctorAvatar from "@/components/brand/DoctorAvatar";
import Logo from "@/components/brand/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-gradient-to-br from-ink to-primary p-12 text-white lg:flex">
        <Logo className="text-white" />
        <div>
          <div className="mx-auto h-72 w-72 overflow-hidden rounded-full bg-white/10 pt-6">
            <DoctorAvatar hair="long" state="speaking" label="" />
          </div>
          <h2 className="mx-auto mt-10 max-w-sm text-center text-2xl font-bold">Your AI doctor is ready to listen.</h2>
          <p className="mx-auto mt-3 max-w-sm text-center text-sky">
            Describe how you feel and get matched to the right specialist in minutes.
          </p>
        </div>
        <p className="flex items-center gap-2 text-sm text-sky">
          <ShieldCheck className="size-4" />
          Your health information stays private.
        </p>
      </aside>
      <div className="flex flex-col px-4 py-8 sm:px-8">
        <Logo className="lg:hidden" />
        <main className="flex flex-1 items-center justify-center py-10">{children}</main>
      </div>
    </div>
  );
}

import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2 text-lg font-bold text-ink", className)}>
      <span className="grid size-8 place-items-center rounded-xl bg-primary text-white">
        <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" aria-hidden>
          <path d="M12 5v14M5 12h14" />
        </svg>
      </span>
      Find<span className="-ml-2 text-primary">Care</span>
    </Link>
  );
}

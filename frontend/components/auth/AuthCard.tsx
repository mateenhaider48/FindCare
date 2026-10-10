import Link from "next/link";
import { cn } from "@/lib/utils";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: { text: string; linkLabel: string; href: string };
  wide?: boolean;
};

export default function AuthCard({ title, subtitle, children, footer, wide }: AuthCardProps) {
  return (
    <div
      className={cn(
        // The page never scrolls; on very short screens only the card does.
        "max-h-full w-full overflow-y-auto [scrollbar-width:none] rounded-[28px] border border-white bg-white/80 p-[clamp(22px,2.6vw,32px)] shadow-[0_40px_80px_-40px_rgba(59,147,236,0.55)] backdrop-blur-xl",
        wide ? "max-w-[500px]" : "max-w-[420px]",
      )}
    >
      <h1 className="text-[26px] leading-tight font-semibold tracking-[-0.03em]">{title}</h1>
      <p className="mt-1.5 text-[14.5px] text-body">{subtitle}</p>
      <div className="mt-4">{children}</div>
      {footer && (
        <p className="mt-4 text-center text-[13.5px] text-body">
          {footer.text}{" "}
          <Link href={footer.href} className="font-semibold text-sky-ink hover:text-navy">
            {footer.linkLabel}
          </Link>
        </p>
      )}
    </div>
  );
}

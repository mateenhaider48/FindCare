import Link from "next/link";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: { text: string; linkLabel: string; href: string };
};

export default function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="w-full max-w-md">
      <h1 className="text-3xl font-bold tracking-tight text-ink">{title}</h1>
      <p className="mt-2 text-slate">{subtitle}</p>
      <div className="mt-8">{children}</div>
      {footer && (
        <p className="mt-8 text-center text-sm text-slate">
          {footer.text}{" "}
          <Link href={footer.href} className="font-semibold text-primary hover:text-primary-hover">
            {footer.linkLabel}
          </Link>
        </p>
      )}
    </div>
  );
}

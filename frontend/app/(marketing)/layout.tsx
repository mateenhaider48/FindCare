// The landing page renders its own header and footer (they are part of the page design).
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <main className="flex-1">{children}</main>;
}

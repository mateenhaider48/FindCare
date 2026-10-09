import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/app/PageHeader";
import Card from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import DoctorAvatar from "@/components/brand/DoctorAvatar";
import { DOCTORS } from "@/components/landing/data";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "AI doctors" };

export default function DoctorsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 p-4 sm:p-8">
      <PageHeader title="AI doctors" subtitle="Each specialist is an AI agent trained on its field. Pick one, or let triage choose for you." />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {DOCTORS.map((d) => (
          <Card key={d.key} className="flex flex-col overflow-hidden p-0">
            <div className="h-56 bg-gradient-to-b from-mist to-primary-soft">
              <DoctorAvatar {...d.avatar} state="listening" label={`${d.name}, ${d.field}`} />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs font-semibold tracking-wider text-primary">{d.role}</p>
              <h2 className="mt-1 text-lg font-bold text-ink">{d.name}</h2>
              <p className="mt-1.5 text-sm text-slate">{d.desc}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {d.tags.map((t) => (
                  <span key={t} className="rounded-full bg-mist px-2.5 py-1 text-xs text-slate">
                    {t}
                  </span>
                ))}
              </div>
              <ButtonLink href={`${site.routes.consultation}?doctor=${d.key}`} className="mt-5 self-start">
                Consult {d.name}
              </ButtonLink>
            </div>
          </Card>
        ))}
      </div>
      <p className="text-sm text-muted">
        Not sure who to pick?{" "}
        <Link href={site.routes.consultation} className="font-semibold text-primary hover:underline">
          Start a consultation
        </Link>
        .
      </p>
    </div>
  );
}

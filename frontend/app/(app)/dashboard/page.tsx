import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  CircleAlert,
  CircleCheck,
  CircleX,
  Clock,
  Stethoscope,
  UserRoundCheck,
  Users,
} from "lucide-react";
import PageHeader from "@/components/app/PageHeader";
import Card from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import HourlyChart from "@/components/dashboard/HourlyChart";
import {
  AGENTS,
  PATIENTS_BY_HOUR,
  STATUS,
  TODAY,
  type AgentStatus,
} from "@/lib/analytics";
import { HISTORY, URGENCY } from "@/lib/consultations";
import { SESSION_COOKIE } from "@/lib/auth";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

const STATUS_ICON: Record<AgentStatus, typeof CircleCheck> = {
  online: CircleCheck,
  degraded: CircleAlert,
  offline: CircleX,
};

export default async function DashboardPage() {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value ?? "";
  const name = decodeURIComponent(raw).split(" ")[0] || "there";
  const online = AGENTS.filter((a) => a.status === "online").length;
  const issues = AGENTS.filter((a) => a.issue);

  const stats = [
    {
      label: "Patients today",
      value: TODAY.patients,
      note: `+${TODAY.patientsDelta} vs yesterday`,
      icon: Users,
    },
    {
      label: "Consultations",
      value: TODAY.consultations,
      note: "Including follow-ups",
      icon: Stethoscope,
    },
    {
      label: "Sent to senior doctor",
      value: TODAY.escalated,
      note: `${((TODAY.escalated / TODAY.consultations) * 100).toFixed(1)}% of consultations`,
      icon: UserRoundCheck,
    },
    {
      label: "Avg. consultation",
      value: `${TODAY.avgMinutes} min`,
      note: "Start to summary",
      icon: Clock,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-8">
      <PageHeader
        title={`Welcome back, ${name}`}
        subtitle="Today at a glance: patients, doctor agents and anything that needs attention."
        action={
          <ButtonLink href={site.routes.consultation}>
            <Stethoscope className="size-4" />
            Start consultation
          </ButtonLink>
        }
      />

      {issues.length > 0 && (
        <div
          role="status"
          className="flex flex-wrap items-start gap-3 rounded-2xl border border-[#f3d3a4] bg-[#fff6e8] p-4 text-sm"
        >
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-[#c27400]" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-ink">
              {issues.length} doctor agent{issues.length > 1 ? "s" : ""} need
              {issues.length > 1 ? "" : "s"} attention
            </p>
            <ul className="mt-1 space-y-0.5 text-slate">
              {issues.map((a) => (
                <li key={a.key}>
                  <span className="font-medium text-ink">{a.name}</span> (
                  {a.field}): {a.issue}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Headline numbers */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, note, icon: Icon }) => (
          <Card key={label} className="p-5">
            <div className="flex items-center justify-between text-sm text-slate">
              {label}
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Icon className="size-4" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-ink">
              {value}
            </p>
            <p className="mt-1 text-xs text-muted">{note}</p>
          </Card>
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-ink">Patients per hour</h2>
                <p className="text-xs text-muted">
                  Consultations started today, 08:00–20:00
                </p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
                <ArrowUpRight className="size-3.5" />
                {TODAY.patientsDelta} more than yesterday
              </span>
            </div>
            <div className="mt-4">
              <HourlyChart data={PATIENTS_BY_HOUR} />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-ink">Recent consultations</h2>
              <Link
                href={site.routes.history}
                className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                View all <ArrowRight className="size-4" />
              </Link>
            </div>
            <ul className="mt-3 divide-y divide-line/60">
              {HISTORY.slice(0, 4).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`${site.routes.history}/${c.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 py-3 hover:text-primary"
                  >
                    <div>
                      <p className="font-medium text-ink">{c.concern}</p>
                      <p className="text-xs text-muted">
                        {c.doctor} · {c.field} · {c.date} · {c.start}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        URGENCY[c.urgency].className,
                      )}
                    >
                      {URGENCY[c.urgency].label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card className="flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-ink">Doctor agents</h2>
            <span className="text-xs text-muted">
              {online}/{AGENTS.length} online
            </span>
          </div>
          <ul className="mt-3 divide-y divide-line/60">
            {AGENTS.map((a) => {
              const s = STATUS[a.status];
              const Icon = STATUS_ICON[a.status];
              return (
                <li key={a.key} className="py-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">
                        {a.name}
                      </p>
                      <p className="text-xs text-muted">
                        {a.field} · {a.sessionsToday} today · {a.avgReply}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                        s.className,
                      )}
                    >
                      <Icon className="size-3.5" />
                      {s.label}
                    </span>
                  </div>
                  {a.issue && (
                    <p className="mt-1.5 rounded-lg bg-mist px-2.5 py-1.5 text-xs text-slate">
                      {a.issue}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}

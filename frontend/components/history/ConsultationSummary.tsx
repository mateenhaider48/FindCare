"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Download, Phone } from "lucide-react";
import { URGENCY, formatDate } from "@/lib/consultations";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useHistory } from "./useHistory";

const panel = "rounded-2xl border border-line/60 p-5";

/** Full summary of one consultation (matches the summary design). */
export default function ConsultationSummary({ id }: { id: string }) {
  const c = useHistory().find((x) => x.id === id);

  if (!c) {
    return (
      <div className="mx-auto w-full max-w-3xl p-8 text-center">
        <h1 className="text-2xl font-bold text-ink">Consultation not found</h1>
        <p className="mt-2 text-slate">It may have been saved in another browser.</p>
        <Link href={site.routes.history} className="mt-5 inline-block font-semibold text-primary hover:underline">
          Back to history
        </Link>
      </div>
    );
  }

  const first = c.doctor.replace(/^Dr\.\s*/, "").split(" ")[0];
  const reviewFirst = c.review?.by.replace(/^Dr\.\s*/, "").split(" ")[0];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 p-4 sm:p-8 print:max-w-none print:p-0">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">
            {formatDate(c.date)} · {c.start} to {c.end} · {c.doctor}, {c.field}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">Your consultation summary</h1>
        </div>
        <div className="flex gap-2 print:hidden">
          <Link href={site.routes.history} className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary-soft px-4 text-sm font-semibold text-ink hover:bg-primary-soft/70">
            <ArrowLeft className="size-4" />
            Back to history
          </Link>
          <button type="button" onClick={() => window.print()} className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover">
            <Download className="size-4" />
            Download PDF
          </button>
        </div>
      </div>

      {c.review ? (
        <section className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-[#f3d3a4] bg-[#fff6e8] p-5">
          <div className="max-w-xl">
            <p className="flex items-center gap-2 text-xs font-semibold text-[#a86200]">
              <span className="size-2 rounded-full bg-[#e08a1e]" />
              Needs review · sent to a senior doctor
            </p>
            <h2 className="mt-1.5 text-xl font-bold text-ink">{c.review.by} will review your case</h2>
            <p className="mt-1 text-sm text-slate">
              {c.review.role}. We&apos;ll call you on {c.review.phone} and send a message when he&apos;s done.
            </p>
          </div>
          <div className="rounded-2xl bg-white px-6 py-4 text-center">
            <p className="text-xs text-muted">Expected by</p>
            <p className="text-3xl font-bold text-ink tabular-nums">{c.review.expectedBy}</p>
            <p className="flex items-center justify-center gap-1 text-xs text-[#a86200]">
              <Clock className="size-3" />
              about {c.review.inMinutes} minutes
            </p>
          </div>
        </section>
      ) : (
        <section className={cn("flex items-center gap-3 rounded-2xl p-4", URGENCY[c.urgency].className)}>
          <span className={cn("size-2.5 rounded-full", URGENCY[c.urgency].dot)} />
          <p className="text-sm font-semibold">Outcome: {URGENCY[c.urgency].label}</p>
        </section>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <section className={cn(panel, "bg-mist")}>
            <h2 className="font-semibold text-ink">What you told us</h2>
            <ul className="mt-3 space-y-2 text-sm text-ink">
              {c.told.map((t) => (
                <li key={t}>{t}</li>
              ))}
              {c.negatives && <li className="text-muted">{c.negatives}</li>}
            </ul>
          </section>

          <section className={cn(panel, "bg-white")}>
            <h2 className="font-semibold text-ink">{c.doctor.replace(/ Khan$/, "")}&apos;s assessment</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate">{c.assessment}</p>
          </section>
        </div>

        <div className="space-y-5">
          <section className={cn(panel, "bg-white")}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-ink">Prescription</h2>
              <span className="text-xs text-muted">Rx {c.id.toUpperCase()}</span>
            </div>
            {c.prescription.length ? (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-muted">
                    <tr className="border-b border-line/60">
                      <th className="py-2 pr-3 font-medium">Medicine</th>
                      <th className="py-2 pr-3 font-medium">Dose</th>
                      <th className="py-2 pr-3 font-medium">How often</th>
                      <th className="py-2 font-medium">For</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.prescription.map((m) => (
                      <tr key={m.name} className="border-b border-line/40 align-top last:border-0">
                        <td className="py-3 pr-3 font-semibold text-ink">{m.name}</td>
                        <td className="py-3 pr-3 text-slate">{m.dose}</td>
                        <td className="py-3 pr-3 text-slate">{m.often}</td>
                        <td className="py-3 text-slate">{m.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate">No medicine prescribed.</p>
            )}
            {c.prescriptionNote && <p className="mt-3 rounded-xl bg-mist p-3 text-xs text-slate">{c.prescriptionNote}</p>}
          </section>

          <section className={cn(panel, "bg-mist")}>
            <h2 className="font-semibold text-ink">Advice and when to get help</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate">
              {c.advice.map((a) => (
                <li key={a}>{reviewFirst ? a.replace("the senior doctor", `Dr. ${reviewFirst}`) : a}</li>
              ))}
            </ul>
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-danger-soft p-3 text-sm text-danger">
              <Phone className="mt-0.5 size-4 shrink-0" />
              <span>
                <a href="tel:1122" className="font-bold underline">
                  Call 1122 right away
                </a>{" "}
                {c.emergency}
              </span>
            </p>
          </section>
        </div>
      </div>

      <p className="text-center text-xs text-muted">
        Guidance from {first === "Ayesha" ? "Dr. Ayesha, an AI junior doctor" : `${c.doctor}, an AI specialist`}. Not a diagnosis. In an emergency call 1122.
      </p>
    </div>
  );
}

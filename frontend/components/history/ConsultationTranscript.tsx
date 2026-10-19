"use client";

import Link from "next/link";
import { ArrowLeft, Download, Stethoscope } from "lucide-react";
import { formatDate } from "@/lib/consultations";
import type { Message } from "@/lib/api";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const timeOf = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

export default function ConsultationTranscript({
  title,
  date,
  messages,
}: {
  title: string;
  date: string | null;
  messages: Message[];
}) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 p-4 sm:p-8 print:max-w-none print:p-0">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          {date && <p className="text-sm text-muted">{formatDate(date.slice(0, 10))}</p>}
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">{title}</h1>
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

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-sm text-slate">
          This consultation has no messages yet.
        </div>
      ) : (
        <ul className="space-y-4">
          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <li key={m.id} className={cn("flex", isUser ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[80%]", isUser ? "items-end text-right" : "items-start")}>
                  <div className="mb-1 flex items-center gap-1.5 text-xs text-muted">
                    {!isUser && <Stethoscope className="size-3.5 text-primary" />}
                    <span>{isUser ? "You" : "AI doctor"}</span>
                    <span>· {timeOf(m.created_at)}</span>
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                      isUser ? "bg-primary text-white" : "bg-mist text-ink",
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-center text-xs text-muted">
        Guidance from an AI doctor. Not a diagnosis. In an emergency call 1122.
      </p>
    </div>
  );
}

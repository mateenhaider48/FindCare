"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, Search, X } from "lucide-react";
import { formatDate } from "@/lib/consultations";
import type { Conversation } from "@/lib/api";
import { site } from "@/lib/site";

const RANGES = [
  { key: "all", label: "All time", days: Infinity },
  { key: "7", label: "Last 7 days", days: 7 },
  { key: "30", label: "Last 30 days", days: 30 },
  { key: "90", label: "Last 3 months", days: 90 },
] as const;

const select =
  "h-10 rounded-xl border border-line bg-white px-3 text-sm text-ink focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-primary/30";

const dayStamp = (iso: string) => iso.slice(0, 10);
const timeOf = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

export default function HistoryList({ conversations }: { conversations: Conversation[] }) {
  const [q, setQ] = useState("");
  const [range, setRange] = useState<(typeof RANGES)[number]["key"]>("all");
  // Captured once at mount; the date filter is relative to when the page loaded.
  const [now] = useState(() => Date.now());

  const shown = useMemo(() => {
    const days = RANGES.find((r) => r.key === range)!.days;
    const term = q.trim().toLowerCase();
    return conversations.filter((c) => {
      const inRange = days === Infinity || now - new Date(c.created_at).getTime() <= days * 86_400_000;
      const matches = !term || (c.title ?? "").toLowerCase().includes(term);
      return inRange && matches;
    });
  }, [conversations, q, range, now]);

  const filtered = q.trim() !== "" || range !== "all";
  const reset = () => {
    setQ("");
    setRange("all");
  };

  return (
    <div className="space-y-5">
      {/* Filters, one row above the list */}
      <div className="rounded-2xl border border-line/70 bg-white p-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative min-w-[200px] flex-1">
            <span className="sr-only">Search consultations</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by title"
              className="h-10 w-full rounded-xl border border-line bg-white pr-3 pl-9 text-sm text-ink placeholder:text-muted focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-primary/30"
            />
          </label>
          <select aria-label="Date range" value={range} onChange={(e) => setRange(e.target.value as typeof range)} className={select}>
            {RANGES.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
          {filtered && (
            <button type="button" onClick={reset} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              <X className="size-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-muted">
        {shown.length} consultation{shown.length === 1 ? "" : "s"}
      </p>

      {conversations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-sm text-slate">
          No consultations yet.{" "}
          <Link href={site.routes.consultation} className="font-semibold text-primary hover:underline">
            Start your first consultation
          </Link>
        </div>
      ) : shown.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-sm text-slate">
          No consultations match these filters.{" "}
          <button type="button" onClick={reset} className="font-semibold text-primary hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="space-y-3">
          {shown.map((c) => {
            const date = dayStamp(c.created_at);
            return (
              <li key={c.id}>
                <Link
                  href={`${site.routes.history}/${c.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-line/70 bg-white p-4 transition-shadow hover:shadow-card sm:p-5"
                >
                  <div className="hidden w-16 shrink-0 text-center sm:block">
                    <div className="text-2xl leading-none font-bold text-ink">{formatDate(date, { day: "numeric" })}</div>
                    <div className="mt-1 text-xs text-muted uppercase">{formatDate(date, { month: "short" })}</div>
                  </div>
                  <div className="min-w-0 flex-1 sm:border-l sm:border-line/70 sm:pl-4">
                    <h2 className="font-semibold text-ink">{c.title || "Consultation"}</h2>
                    <p className="mt-0.5 text-xs text-muted">
                      <span className="sm:hidden">{formatDate(date, { day: "numeric", month: "short" })} · </span>
                      {timeOf(c.created_at)}
                    </p>
                  </div>
                  <ChevronRight className="size-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

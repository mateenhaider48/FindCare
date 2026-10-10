"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, Search, X } from "lucide-react";
import { URGENCY, formatDate, type Urgency } from "@/lib/consultations";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useHistory } from "./useHistory";

const RANGES = [
  { key: "all", label: "All time", days: Infinity },
  { key: "7", label: "Last 7 days", days: 7 },
  { key: "30", label: "Last 30 days", days: 30 },
  { key: "90", label: "Last 3 months", days: 90 },
] as const;

const select =
  "h-10 rounded-xl border border-line bg-white px-3 text-sm text-ink focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-primary/30";

export default function HistoryList() {
  const all = useHistory();
  const [q, setQ] = useState("");
  const [urgency, setUrgency] = useState<Urgency | "all">("all");
  const [field, setField] = useState("all");
  const [range, setRange] = useState<(typeof RANGES)[number]["key"]>("all");

  const fields = useMemo(() => [...new Set(all.map((c) => c.field))].sort(), [all]);
  const latest = all[0]?.date;

  const shown = useMemo(() => {
    const days = RANGES.find((r) => r.key === range)!.days;
    // Ranges count back from the newest record, so the mock data stays filterable.
    const ref = latest ? new Date(latest + "T00:00:00").getTime() : 0;
    const term = q.trim().toLowerCase();
    return all.filter(
      (c) =>
        (urgency === "all" || c.urgency === urgency) &&
        (field === "all" || c.field === field) &&
        (days === Infinity || ref - new Date(c.date + "T00:00:00").getTime() <= days * 86_400_000) &&
        (!term || [c.concern, c.doctor, c.field, ...c.told].some((t) => t.toLowerCase().includes(term))),
    );
  }, [all, q, urgency, field, range, latest]);

  const filtered = q || urgency !== "all" || field !== "all" || range !== "all";
  const reset = () => {
    setQ("");
    setUrgency("all");
    setField("all");
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
              placeholder="Search symptoms, doctor or specialty"
              className="h-10 w-full rounded-xl border border-line bg-white pr-3 pl-9 text-sm focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-primary/30"
            />
          </label>
          <select aria-label="Specialty" value={field} onChange={(e) => setField(e.target.value)} className={select}>
            <option value="all">All specialties</option>
            {fields.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <select aria-label="Date range" value={range} onChange={(e) => setRange(e.target.value as typeof range)} className={select}>
            {RANGES.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {(["all", ...Object.keys(URGENCY)] as (Urgency | "all")[]).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUrgency(u)}
              aria-pressed={urgency === u}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                urgency === u ? "border-ink bg-ink text-white" : "border-line text-slate hover:bg-mist",
              )}
            >
              {u !== "all" && <span className={cn("size-1.5 rounded-full", URGENCY[u].dot)} />}
              {u === "all" ? "All outcomes" : URGENCY[u].label}
            </button>
          ))}
          {filtered && (
            <button type="button" onClick={reset} className="ml-auto flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              <X className="size-3.5" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-muted">
        {shown.length} consultation{shown.length === 1 ? "" : "s"}
      </p>

      {shown.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-sm text-slate">
          No consultations match these filters.{" "}
          <button type="button" onClick={reset} className="font-semibold text-primary hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="space-y-3">
          {shown.map((c) => (
            <li key={c.id}>
              <Link
                href={`${site.routes.history}/${c.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-line/70 bg-white p-4 transition-shadow hover:shadow-card sm:p-5"
              >
                <div className="hidden w-16 shrink-0 text-center sm:block">
                  <div className="text-2xl leading-none font-bold text-ink">{formatDate(c.date, { day: "numeric" })}</div>
                  <div className="mt-1 text-xs text-muted uppercase">{formatDate(c.date, { month: "short" })}</div>
                </div>
                <div className="min-w-0 flex-1 sm:border-l sm:border-line/70 sm:pl-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-ink">{c.concern}</h2>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", URGENCY[c.urgency].className)}>{URGENCY[c.urgency].label}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    {c.doctor} · {c.field} · <span className="sm:hidden">{formatDate(c.date, { day: "numeric", month: "short" })} · </span>
                    {c.start}–{c.end}
                  </p>
                  <p className="mt-2 line-clamp-1 text-sm text-slate">{c.assessment}</p>
                </div>
                <ChevronRight className="size-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

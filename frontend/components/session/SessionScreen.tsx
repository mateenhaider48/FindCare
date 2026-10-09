"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CaseSensitive,
  Mic,
  MicOff,
  Pause,
  Phone,
  Play,
  Send,
} from "lucide-react";
import DoctorAvatar, {
  type DoctorAvatarProps,
  type DoctorAvatarState,
} from "@/components/brand/DoctorAvatar";
import { Wordmark } from "@/components/landing/LandingNav";
import { RED_FLAGS, REVIEW_FLAGS, saveLocal, type Consultation } from "@/lib/consultations";

const needsReview = (t: string) => [...RED_FLAGS, ...REVIEW_FLAGS].some((f) => t.toLowerCase().includes(f));
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export type SessionDoctor = {
  name: string;
  short: string;
  role: string;
  field: string;
  avatar: DoctorAvatarProps;
};

type Msg = { id: number; from: "doctor" | "patient"; text: string; at: number };
type Noted = { text: string; at: number };
type Triage = "assessing" | "routine" | "review";

// Scripted follow-ups until the AI backend is connected. **word** is highlighted.
const FOLLOW_UPS = [
  "I'm sorry you're feeling unwell. **When did it start**, and has anything made it **better or worse**?",
  "Thank you. Do you have any **other symptoms**, like a cough, runny nose, rash or **any swelling**?",
  "Do you have any **long-term conditions**, take regular medicines, or have any **allergies**?",
  "One last check: is anything making it **hard to breathe, swallow** or stay awake?",
];

const hhmm = (ms: number) =>
  new Date(ms).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
const localDate = (ms: number) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const mmss = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/** Turns "I've had a fever for three days" into "Fever for three days". */
function toSymptom(text: string) {
  const t = (text.trim().split(/(?<=[.!?])\s+/)[0] ?? text)
    .trim()
    .replace(
      /^(i('ve| have)( had)?|i am|i'm|i feel|it('s| is)|my|also|and|yes,?)\s+/i,
      "",
    )
    .replace(/[.!]+$/, "");
  const s = t.charAt(0).toUpperCase() + t.slice(1);
  return s;
}

function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") ? (
          <span key={i} className="text-primary">
            {part.slice(2, -2)}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

export default function SessionScreen({
  doctor,
  patient,
  opening,
  startedAt,
}: {
  doctor: SessionDoctor;
  patient: string;
  opening?: string;
  startedAt: number;
}) {
  const router = useRouter();
  const first = patient.split(" ")[0];
  const idRef = useRef(3);
  const [msgs, setMsgs] = useState<Msg[]>(() => [
    {
      id: 1,
      from: "doctor",
      text: `Assalam o alaikum ${first}, I'm ${doctor.short}, a **junior doctor agent**. What's **bothering you** today?`,
      at: startedAt,
    },
    ...(opening
      ? [
          {
            id: 2,
            from: "patient" as const,
            text: opening,
            at: startedAt + 20_000,
          },
          {
            id: 3,
            from: "doctor" as const,
            text: FOLLOW_UPS[0],
            at: startedAt + 40_000,
          },
        ]
      : []),
  ]);
  const [noted, setNoted] = useState<Noted[]>(() =>
    opening
      ? [
          {
            text: toSymptom(opening.replace(/\s*\(for .*\)$/, "")),
            at: startedAt + 20_000,
          },
        ]
      : [],
  );
  const [turn, setTurn] = useState(opening ? 1 : 0);
  const [state, setState] = useState<DoctorAvatarState>("speaking");
  const [triage, setTriage] = useState<Triage>(() =>
    opening && needsReview(opening)
      ? "review"
      : "assessing",
  );
  const [reviewAt, setReviewAt] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [input, setInput] = useState("");
  const [now, setNow] = useState(startedAt);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const tick = window.setInterval(() => setNow(Date.now()), 1000);
    const t = window.setTimeout(() => setState("listening"), 2400);
    const pending = timers.current;
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(t);
      pending.forEach(window.clearTimeout);
    };
  }, []);
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, state]);

  const later = (fn: () => void, ms: number) =>
    timers.current.push(window.setTimeout(fn, ms));

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || state === "thinking" || done || paused) return;
    const at = Date.now();
    setInput("");
    setMsgs((m) => [...m, { id: ++idRef.current, from: "patient", text, at }]);
    if (!/^(no|nope|none|nothing)\b/i.test(text))
      setNoted((n) => [...n, { text: toSymptom(text), at }]);
    const flagged =
      triage === "review" ||
      needsReview(text);
    if (flagged && triage !== "review") {
      setTriage("review");
      setReviewAt(at);
    }
    setState("thinking");
    const next = turn + 1;
    later(() => {
      const last = next >= FOLLOW_UPS.length;
      const reply = last
        ? flagged
          ? `Thank you, ${first}. Because of what you described, I'm **sending your case to a senior doctor** now. They'll review it and call you shortly. Your summary is ready.`
          : `Thank you, ${first}. This sounds **manageable at home** for now. Rest, drink fluids and watch how it changes. I've prepared your **summary**.`
        : FOLLOW_UPS[next];
      setMsgs((m) => [
        ...m,
        { id: ++idRef.current, from: "doctor", text: reply, at: Date.now() },
      ]);
      setTurn(next);
      setState("speaking");
      if (last) {
        setDone(true);
        if (!flagged) setTriage("routine");
      }
      later(
        () => setState(last ? "idle" : "listening"),
        Math.min(5000, 1200 + reply.length * 26),
      );
    }, 1600);
  };

  const end = () => {
    const at = Date.now();
    const id = `fc-${at.toString(36)}`;
    const review = triage === "review";
    const told = noted.map((n) => n.text);
    const record: Consultation = {
      id,
      date: localDate(startedAt),
      start: hhmm(startedAt),
      end: hhmm(at),
      doctor: doctor.name,
      field: doctor.field,
      concern: told[0] ?? "General consultation",
      urgency: review ? "review" : "self-care",
      told: told.length ? told : ["No symptoms were described in this session"],
      assessment: review
        ? "Some of what you described needs a senior doctor to look at it before treatment is decided. Your case has been sent for review."
        : "From what you described, this sounds like a mild, self-limiting problem that can be managed at home for now.",
      prescription: told.some((t) => /fever|pain|ache|throat/i.test(t))
        ? [
            {
              name: "Paracetamol 500 mg",
              dose: "2 tablets",
              often: "Every 6 hours if needed, max 8 a day",
              duration: "3 days",
            },
          ]
        : [],
      prescriptionNote: review
        ? "More medicine may be added after the senior doctor's review."
        : undefined,
      advice: [
        "Rest and drink plenty of fluids.",
        review
          ? "Keep your phone nearby so the senior doctor can reach you."
          : "See a GP if it lasts more than a week or gets worse.",
      ],
      emergency:
        "if breathing gets harder, you feel faint, or symptoms suddenly get much worse.",
      review: review
        ? {
            by: "Dr. Imran Shah",
            role: "Senior consultant, Margalla General Hospital",
            phone: "0300 ••• 4512",
            expectedBy: hhmm((reviewAt ?? at) + 16 * 60_000),
            inMinutes: 15,
          }
        : undefined,
    };
    saveLocal(record);
    router.push(`${site.routes.history}/${id}`);
  };

  const elapsed = Math.max(0, Math.floor((now - startedAt) / 1000));
  const caption = paused
    ? "Paused"
    : muted
      ? "Microphone muted"
      : state === "thinking"
        ? `${doctor.short} is thinking…`
        : state === "speaking"
          ? `${doctor.short} is speaking`
          : done
            ? "Session complete"
            : "Listening…";

  return (
    <div className="grid h-dvh gap-3 overflow-hidden bg-page p-3 lg:grid-cols-[270px_1fr_380px]">
      {/* Left: session details */}
      <aside className="hidden min-h-0 flex-col overflow-hidden rounded-3xl bg-white lg:flex">
        <div className="min-h-0 flex-1 overflow-y-auto p-5 [scrollbar-width:thin]">
          <Link href={site.routes.dashboard} aria-label="Back to dashboard">
            <Wordmark className="text-[17px]" />
          </Link>

          <div className="mt-6">
            <p className="flex items-center gap-2 text-xs font-medium text-primary">
              <span className="size-2 animate-pulse rounded-full bg-primary" />
              {done ? "Session ended" : "Session in progress"}
            </p>
            <p
              className="mt-1 text-[34px] leading-none font-bold tracking-[-0.03em] text-ink tabular-nums"
              suppressHydrationWarning
            >
              {mmss(elapsed)}
            </p>
            <p className="mt-1.5 text-xs text-muted" suppressHydrationWarning>
              {new Date(startedAt).toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              · started {hhmm(startedAt)}
            </p>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="size-12 shrink-0 overflow-hidden rounded-full bg-primary-soft">
              <DoctorAvatar
                {...doctor.avatar}
                framing="headshot"
                state="idle"
                animated={false}
                label=""
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">
                {doctor.name}
              </p>
              <p className="text-xs text-muted">{doctor.role}</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-mist p-3.5">
            <p className="text-[11px] font-medium text-muted">Patient</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                {patient
                  .split(" ")
                  .map((w) => w[0]?.toUpperCase())
                  .slice(0, 2)
                  .join("")}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink capitalize">
                  {patient}
                </p>
                <Link
                  href={site.routes.settings}
                  className="text-xs text-muted hover:text-primary"
                >
                  Add age &amp; details
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[11px] font-medium text-muted">Triage level</p>
            <div
              className={cn(
                "mt-2 rounded-2xl border p-3.5",
                triage === "review"
                  ? "border-[#f3d3a4] bg-[#fff6e8]"
                  : triage === "routine"
                    ? "border-success/30 bg-success-soft"
                    : "border-line bg-white",
              )}
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <span
                  className={cn(
                    "size-2 rounded-full",
                    triage === "review"
                      ? "bg-[#e08a1e]"
                      : triage === "routine"
                        ? "bg-success"
                        : "animate-pulse bg-primary",
                  )}
                />
                {triage === "review"
                  ? "Needs review"
                  : triage === "routine"
                    ? "Routine · self-care"
                    : "Assessing"}
              </p>
              <p className="mt-1 text-xs text-slate" suppressHydrationWarning>
                {triage === "review"
                  ? `Sent to a senior doctor${reviewAt ? ` at ${hhmm(reviewAt)}` : ""}`
                  : triage === "routine"
                    ? "No red flags found"
                    : "Checking for red flags"}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[11px] font-medium text-muted">
              Symptoms noted so far
            </p>
            {noted.length === 0 ? (
              <p className="mt-2 text-xs text-muted">
                Nothing yet. Describe how you feel.
              </p>
            ) : (
              <ul className="mt-2 space-y-1">
                {noted.map((s, i) => {
                  const fresh = i === noted.length - 1;
                  return (
                    <li
                      key={i}
                      className={cn(
                        "flex items-start justify-between gap-2 rounded-lg px-2 py-1.5 text-[13px]",
                        fresh
                          ? "bg-mist font-semibold text-ink"
                          : "text-primary",
                      )}
                    >
                      <span className="line-clamp-2">{s.text}</span>
                      <span
                        className={cn(
                          "shrink-0 text-[11px]",
                          fresh ? "text-primary" : "text-muted",
                        )}
                        suppressHydrationWarning
                      >
                        {fresh ? "New" : hhmm(s.at)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
        <div className="shrink-0 border-t border-line/60 p-4">
          <button
            type="button"
            onClick={end}
            className="w-full rounded-2xl border border-ink/80 py-3 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
          >
            End consultation
          </button>
        </div>
      </aside>

      {/* Centre: the doctor */}
      <section className="relative flex min-h-0 flex-col items-center overflow-hidden rounded-3xl max-lg:h-[46vh] max-lg:bg-white/60">
        <div className="flex w-full items-center justify-between gap-3 px-2 pt-1">
          <span className="rounded-full bg-white/80 px-3 py-1.5 text-xs text-slate">
            You&apos;re talking to an AI junior doctor
          </span>
          <a
            href="tel:1122"
            className="flex items-center gap-1.5 text-xs font-medium text-ink hover:text-danger"
          >
            <Phone className="size-3.5" />
            Emergency? Call <span className="font-bold text-danger">1122</span>
          </a>
        </div>

        <div className="relative flex w-full min-h-0 flex-1 items-end justify-center">
          <div
            aria-hidden
            className="absolute bottom-[8%] left-1/2 aspect-square h-[78%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#c3e1ff_0%,rgba(195,225,255,0.45)_45%,transparent_70%)]"
          />
          <div className="relative h-full w-full max-w-[460px]">
            <DoctorAvatar
              {...doctor.avatar}
              state={paused ? "idle" : state}
              animated={!paused}
              label={`${doctor.name}, ${doctor.field}`}
            />
            {state === "thinking" && (
              <div
                aria-hidden
                className="absolute top-[14%] right-[20%] flex flex-col items-start gap-1"
              >
                <span
                  data-motion
                  className="size-6 rounded-full bg-primary-soft"
                  style={{ animation: "fcBob 1.6s ease-in-out infinite" }}
                />
                <span
                  data-motion
                  className="ml-[-10px] size-3.5 rounded-full bg-primary-soft"
                  style={{ animation: "fcBob 1.6s ease-in-out -.4s infinite" }}
                />
                <span
                  data-motion
                  className="ml-[-18px] size-2 rounded-full bg-primary-soft"
                  style={{ animation: "fcBob 1.6s ease-in-out -.8s infinite" }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center pt-3 pb-2">
          <p className="text-lg font-bold text-ink">{doctor.name}</p>
          <p className="text-sm text-muted" aria-live="polite">
            {caption}
          </p>
          <div className="mt-4 flex items-center gap-5">
            <button
              type="button"
              onClick={() => inputRef.current?.focus()}
              aria-label="Type a message"
              className="flex size-11 items-center justify-center rounded-full bg-white text-slate shadow-sm hover:text-primary"
            >
              <CaseSensitive className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-pressed={muted}
              aria-label={muted ? "Unmute microphone" : "Mute microphone"}
              className={cn(
                "flex size-16 items-center justify-center rounded-full text-white shadow-[0_14px_30px_-10px_rgba(62,142,222,0.8)] transition-colors",
                muted ? "bg-slate" : "bg-primary hover:bg-primary-hover",
              )}
            >
              {muted ? (
                <MicOff className="size-6" />
              ) : (
                <Mic className="size-6" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              aria-label={paused ? "Resume consultation" : "Pause consultation"}
              className="flex size-11 items-center justify-center rounded-full bg-white text-slate shadow-sm hover:text-primary"
            >
              {paused ? (
                <Play className="size-4" />
              ) : (
                <Pause className="size-4" />
              )}
            </button>
          </div>
          <p className="mt-2.5 text-xs text-muted">
            Tap to mute or type in the chat
          </p>
        </div>
      </section>

      {/* Right: conversation */}
      <section className="flex min-h-0 flex-col rounded-3xl bg-white">
        <div className="flex items-center justify-between border-b border-line/60 px-5 py-4">
          <h2 className="font-semibold text-ink">Conversation</h2>
          <span className="text-xs text-muted">Saved to your record</span>
        </div>

        {triage === "review" && (
          <div
            role="alert"
            className="mx-4 mt-3 flex items-start gap-2 rounded-xl bg-[#fff6e8] p-3 text-xs text-[#8a5200]"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />A senior doctor
            will review your case. If it gets worse, call 1122 now.
          </div>
        )}

        <div
          className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 [scrollbar-width:thin]"
          aria-live="polite"
        >
          {msgs.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex flex-col",
                m.from === "patient" ? "items-end" : "items-start",
              )}
            >
              <p
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed",
                  m.from === "doctor"
                    ? "rounded-tl-sm bg-mist text-ink"
                    : "rounded-tr-sm bg-primary text-white",
                )}
              >
                {m.from === "doctor" ? <Rich text={m.text} /> : m.text}
              </p>
              <span
                className="mt-1 text-[11px] text-muted"
                suppressHydrationWarning
              >
                {m.from === "doctor" ? doctor.short : "You"} · {hhmm(m.at)}
              </span>
            </div>
          ))}
          {state === "thinking" && (
            <p
              className="flex w-fit gap-1 rounded-2xl rounded-tl-sm bg-mist px-4 py-4"
              aria-label={`${doctor.short} is thinking`}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-1.5 animate-pulse rounded-full bg-muted"
                  style={{ animationDelay: `${i * 160}ms` }}
                />
              ))}
            </p>
          )}
          {done && (
            <div className="rounded-2xl border border-primary/20 bg-primary-soft/50 p-4 text-sm">
              <p className="font-semibold text-ink">Your summary is ready</p>
              <p className="mt-1 text-xs text-slate">
                End the consultation to see your assessment, medicine and
                advice.
              </p>
              <button
                type="button"
                onClick={end}
                className="mt-3 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover"
              >
                End &amp; view summary
              </button>
            </div>
          )}
          <div ref={bottom} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border-t border-line/60 p-3"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={done || paused}
            placeholder={
              paused
                ? "Paused"
                : done
                  ? "Consultation finished"
                  : "Type a message…"
            }
            aria-label="Message"
            className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-mist/50 px-4 text-sm focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-primary/30 disabled:opacity-60"
          />
          <button
            type="submit"
            aria-label="Send"
            disabled={!input.trim() || state === "thinking" || done || paused}
            className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            <Send className="size-4" />
          </button>
        </form>
        <button
          type="button"
          onClick={end}
          className="mx-3 mb-3 rounded-xl border border-ink/70 py-2.5 text-sm font-semibold text-ink lg:hidden"
        >
          End consultation
        </button>
      </section>
    </div>
  );
}

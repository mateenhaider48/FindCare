"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertTriangle, ArrowRight, Mic, ShieldCheck } from "lucide-react";
import DoctorAvatar from "@/components/brand/DoctorAvatar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { DOCTORS } from "@/components/landing/data";
import { JUNIOR_DOCTOR, RED_FLAGS } from "@/lib/consultations";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const CHIPS = ["Fever", "Sore throat", "Headache", "Cough", "Chest tightness", "Skin rash", "Stomach pain", "Back pain", "Anxiety", "Dizziness"];
const DURATIONS = ["Today", "A few days", "A week or more", "Over a month"];

/**
 * Start of a consultation: the patient describes what is wrong, red flags are
 * checked as they type, then the live session opens with the junior doctor
 * (or the specialist they picked from the doctors page).
 */
export default function ConsultationStart({ doctorKey }: { doctorKey?: string }) {
  const router = useRouter();
  const specialist = DOCTORS.find((d) => d.key === doctorKey);
  const [text, setText] = useState("");
  const [duration, setDuration] = useState(DURATIONS[1]);
  const [severity, setSeverity] = useState(4);

  const flagged = RED_FLAGS.some((f) => text.toLowerCase().includes(f));
  const doctorName = specialist?.name ?? JUNIOR_DOCTOR.short;

  const addChip = (c: string) => setText((t) => (t ? `${t.trim()}, ${c.toLowerCase()}` : c));
  const start = (skipForm = false) => {
    const params = new URLSearchParams();
    if (specialist) params.set("doctor", specialist.key);
    if (!skipForm && text.trim()) params.set("q", `${text.trim()} (for ${duration.toLowerCase()}, severity ${severity}/10)`);
    router.push(`${site.routes.session}${params.size ? `?${params}` : ""}`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          start();
        }}
        className="space-y-5"
      >
        <Card className="space-y-5">
          <div>
            <label htmlFor="symptoms" className="mb-1.5 block text-sm font-medium text-ink">
              What is going on?
            </label>
            <textarea
              id="symptoms"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="e.g. I have had a fever and a sore throat for three days."
              className="w-full resize-none rounded-xl border border-line bg-white p-4 text-sm text-ink placeholder:text-muted focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-primary/30"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {CHIPS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => addChip(c)}
                  className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-slate transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary"
                >
                  + {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-ink">How long has it been happening?</p>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  aria-pressed={duration === d}
                  className={cn("rounded-full border px-4 py-2 text-sm font-medium transition-colors", duration === d ? "border-primary bg-primary text-white" : "border-line text-slate hover:bg-mist")}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="severity" className="mb-2 flex justify-between text-sm font-medium text-ink">
              <span>How severe is it?</span>
              <span className="text-primary">{severity} / 10</span>
            </label>
            <input id="severity" type="range" min={1} max={10} value={severity} onChange={(e) => setSeverity(+e.target.value)} className="w-full accent-primary" />
            <div className="flex justify-between text-xs text-muted">
              <span>Mild</span>
              <span>Unbearable</span>
            </div>
          </div>
        </Card>

        {flagged && (
          <div role="alert" className="flex gap-3 rounded-2xl border border-danger/30 bg-danger-soft p-4 text-sm text-danger">
            <AlertTriangle className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="font-semibold">This may be an emergency.</p>
              <p className="mt-0.5">
                Please call <a href="tel:1122" className="font-semibold underline">1122</a> or go to the nearest emergency room now. FindCare cannot help with emergencies.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" size="lg" disabled={text.trim().length < 3}>
            {flagged ? "Continue anyway" : `Start with ${doctorName}`}
            <ArrowRight className="size-4" />
          </Button>
          <Button type="button" size="lg" variant="secondary" onClick={() => start(true)}>
            <Mic className="size-4" />
            Just talk instead
          </Button>
        </div>
      </form>

      <Card className="flex flex-col items-center self-start text-center">
        <div className="h-52 w-full overflow-hidden rounded-2xl bg-[radial-gradient(120%_90%_at_50%_100%,#c3e1ff_0%,#e3f0ff_55%,#f3f8ff_100%)] pt-4">
          <DoctorAvatar {...(specialist?.avatar ?? JUNIOR_DOCTOR.avatar)} state="listening" label={doctorName} />
        </div>
        <p className="mt-4 font-semibold text-ink">{specialist?.name ?? JUNIOR_DOCTOR.name}</p>
        <p className="text-xs text-muted">{specialist ? `${specialist.field} · AI specialist` : JUNIOR_DOCTOR.role}</p>
        <p className="mt-4 flex items-start gap-2 rounded-xl bg-mist p-3 text-left text-xs leading-relaxed text-slate">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
          Red flags are checked first. If anything sounds urgent, a senior doctor reviews your case.
        </p>
      </Card>
    </div>
  );
}

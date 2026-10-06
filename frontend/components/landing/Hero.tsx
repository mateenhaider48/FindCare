import { ArrowRight, ShieldCheck } from "lucide-react";
import DoctorAvatar from "@/components/brand/DoctorAvatar";
import { ButtonLink } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { site } from "@/lib/site";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-mist to-white">
      <Container className="grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="size-3.5" />
            AI-powered triage with specialist AI doctors
          </p>
          <h1 className="mt-5 text-4xl leading-tight font-extrabold tracking-tight text-ink sm:text-5xl">
            Know which doctor to see <span className="text-primary">before you go.</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate">
            Tell FindCare how you feel in your own words. It checks for warning signs, works out which specialty fits
            your symptoms, and connects you with the right AI doctor.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={site.routes.triage} size="lg">
              Check my symptoms
              <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/#ai-doctors" variant="secondary" size="lg">
              Meet the AI doctors
            </ButtonLink>
          </div>
          <p className="mt-4 text-xs text-muted">Free to start · Takes about 2 minutes · Not for emergencies</p>
        </div>

        <ChatPreview />
      </Container>
    </section>
  );
}

function ChatPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-6 rounded-[2.5rem] bg-sky/30 blur-2xl" aria-hidden />
      <div className="relative rounded-[1.75rem] border border-line bg-white p-5 shadow-card">
        <div className="flex items-center gap-3 border-b border-line/60 pb-4">
          <div className="size-12 shrink-0 overflow-hidden rounded-full bg-mist">
            <DoctorAvatar state="speaking" framing="head" label="" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">FindCare assistant</p>
            <p className="flex items-center gap-1.5 text-xs text-success">
              <span className="size-1.5 rounded-full bg-success" /> Online
            </p>
          </div>
        </div>

        <div className="space-y-3 py-5 text-sm">
          <Bubble from="patient">I&apos;ve had a headache and blurry vision since this morning.</Bubble>
          <Bubble from="assistant">
            Thanks for telling me. Do you also have numbness, weakness on one side, or trouble speaking?
          </Bubble>
          <Bubble from="patient">No, just the headache and the blurry vision.</Bubble>
        </div>

        <div className="rounded-2xl bg-mist p-4">
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">Suggested specialty</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="font-semibold text-ink">Neurology</p>
            <span className="rounded-full bg-warning-soft px-2.5 py-1 text-xs font-semibold text-warning">
              See a doctor today
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bubble({ from, children }: { from: "patient" | "assistant"; children: React.ReactNode }) {
  const patient = from === "patient";
  return (
    <div className={patient ? "flex justify-end" : "flex justify-start"}>
      <p
        className={
          patient
            ? "max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-white"
            : "max-w-[85%] rounded-2xl rounded-bl-md bg-mist px-4 py-2.5 text-ink"
        }
      >
        {children}
      </p>
    </div>
  );
}

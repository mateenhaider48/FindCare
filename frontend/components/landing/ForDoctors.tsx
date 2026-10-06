import { CalendarCheck, ClipboardList, Inbox } from "lucide-react";
import DoctorAvatar from "@/components/brand/DoctorAvatar";
import { ButtonLink } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { site } from "@/lib/site";

const points = [
  { icon: ClipboardList, text: "Patients arrive with a structured symptom summary and triage level." },
  { icon: Inbox, text: "Only see cases that match your specialty." },
  { icon: CalendarCheck, text: "Manage appointments and follow-ups from one dashboard." },
];

export default function ForDoctors() {
  return (
    <section id="for-doctors" className="scroll-mt-20 py-20">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div className="order-2 mx-auto grid w-full max-w-md grid-cols-2 gap-4 lg:order-1">
          <div className="h-56 overflow-hidden rounded-card bg-mist pt-4">
            <DoctorAvatar hair="short" beard state="idle" label="" />
          </div>
          <div className="mt-10 h-56 overflow-hidden rounded-card bg-primary-soft pt-4">
            <DoctorAvatar hair="hijab" glasses={false} state="listening" label="" />
          </div>
        </div>
        <div className="order-1 max-w-xl lg:order-2">
          <p className="text-sm font-semibold text-primary">For doctors</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Spend your time on care, not intake.
          </h2>
          <ul className="mt-8 space-y-5">
            {points.map((p) => (
              <li key={p.text} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                  <p.icon className="size-5" />
                </span>
                <p className="pt-2 text-slate">{p.text}</p>
              </li>
            ))}
          </ul>
          <ButtonLink href={`${site.routes.signup}?role=doctor`} className="mt-8">
            Join as a doctor
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

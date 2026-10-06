import { Clock, MessagesSquare, Stethoscope } from "lucide-react";
import DoctorAvatar from "@/components/brand/DoctorAvatar";
import { ButtonLink } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { site } from "@/lib/site";

const points = [
  { icon: Stethoscope, text: "A specialist AI doctor for every field, from cardiology to dermatology." },
  { icon: MessagesSquare, text: "Talk in your own words. Your AI doctor asks the right follow-up questions." },
  { icon: Clock, text: "Available any time, so you get guidance as soon as you need it." },
];

export default function AiDoctors() {
  return (
    <section id="ai-doctors" className="scroll-mt-20 py-20">
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
          <p className="text-sm font-semibold text-primary">Meet your AI doctors</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            A specialist for you, ready when you are.
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
          <ButtonLink href={site.routes.triage} className="mt-8">
            Talk to an AI doctor
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

import { MessageSquareText, ShieldAlert, Stethoscope } from "lucide-react";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import SectionHeading from "./SectionHeading";

const steps = [
  {
    icon: MessageSquareText,
    title: "Describe your symptoms",
    body: "Chat in plain language. The assistant asks short follow-up questions so nothing important is missed.",
  },
  {
    icon: ShieldAlert,
    title: "Warning signs checked first",
    body: "Every conversation is screened for red flags. If something looks urgent, you're told to get help right away.",
  },
  {
    icon: Stethoscope,
    title: "Matched to the right specialist",
    body: "Your symptoms are mapped to a specialty, and you can continue with the matching AI doctor in one tap.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-20">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="From “something feels wrong” to the right doctor"
          description="Three steps, a couple of minutes, and you know where to go next."
        />
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title}>
              <Card className="h-full">
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
                    <step.icon className="size-5" />
                  </span>
                  <span className="text-sm font-semibold text-sky">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{step.body}</p>
              </Card>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

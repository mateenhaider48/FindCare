import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { site } from "@/lib/site";

export default function CallToAction() {
  return (
    <section className="pb-20">
      <Container>
        <div className="rounded-[2rem] bg-ink px-6 py-14 text-center sm:px-12">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Not sure who to see?</h2>
          <p className="mx-auto mt-4 max-w-xl text-sky">
            Start a free symptom check now. If anything sounds urgent, we&apos;ll tell you straight away.
          </p>
          <ButtonLink href={site.routes.triage} size="lg" className="mt-8">
            Check my symptoms
            <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

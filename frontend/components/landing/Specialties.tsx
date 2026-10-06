import Container from "@/components/ui/Container";
import SectionHeading from "./SectionHeading";

// Mirrors the specialist agents in agents/app/specialists.
const specialties = [
  "Allergy & Immunology",
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "ENT",
  "Gastroenterology",
  "Gynecology",
  "Hematology",
  "Hepatology",
  "Infectious Disease",
  "Nephrology",
  "Neurology",
  "Neurosurgery",
  "Oncology",
  "Ophthalmology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Pulmonology",
  "Rheumatology",
  "Urology",
  "Vascular Surgery",
];

export default function Specialties() {
  return (
    <section id="specialties" className="scroll-mt-20 bg-mist py-20">
      <Container>
        <SectionHeading
          eyebrow="Specialties"
          title={`${specialties.length} specialties, one starting point`}
          description="Each specialty has its own assessment, so the questions you're asked fit what you're going through."
        />
        <ul className="mt-12 flex flex-wrap justify-center gap-3">
          {specialties.map((name) => (
            <li
              key={name}
              className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-slate"
            >
              {name}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

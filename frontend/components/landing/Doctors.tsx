import DoctorCarousel from "./DoctorCarousel";
import Reveal from "./Reveal";

export default function Doctors() {
  return (
    <section id="doctors" className="overflow-hidden pt-[clamp(80px,10vw,140px)] pb-[clamp(80px,9vw,120px)]">
      <Reveal>
        <DoctorCarousel />
      </Reveal>
    </section>
  );
}

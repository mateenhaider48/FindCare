import CallToAction from "@/components/landing/CallToAction";
import Doctors from "@/components/landing/Doctors";
import Faq from "@/components/landing/Faq";
import Hero from "@/components/landing/Hero";
import HowItHelps from "@/components/landing/HowItHelps";
import LandingFooter from "@/components/landing/LandingFooter";
import Partners from "@/components/landing/Partners";
import Platform from "@/components/landing/Platform";
import Specialties from "@/components/landing/Specialties";
import Stories from "@/components/landing/Stories";

export default function LandingPage() {
  // overflow-x-clip (not hidden) so the sticky "What is FindCare" section can pin.
  return (
    <div className="overflow-x-clip bg-page font-landing text-navy">
      <Hero />
      <Partners />
      <Platform />
      <HowItHelps />
      <Doctors />
      <Specialties />
      <Stories />
      <Faq />
      <CallToAction />
      <LandingFooter />
    </div>
  );
}

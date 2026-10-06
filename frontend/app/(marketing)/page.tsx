import CallToAction from "@/components/landing/CallToAction";
import AiDoctors from "@/components/landing/AiDoctors";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Specialties from "@/components/landing/Specialties";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Specialties />
      <AiDoctors />
      <CallToAction />
    </>
  );
}

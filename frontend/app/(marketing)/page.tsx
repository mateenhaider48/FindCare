import CallToAction from "@/components/landing/CallToAction";
import ForDoctors from "@/components/landing/ForDoctors";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Specialties from "@/components/landing/Specialties";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Specialties />
      <ForDoctors />
      <CallToAction />
    </>
  );
}

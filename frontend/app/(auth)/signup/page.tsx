import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import SignupForm from "@/components/auth/SignupForm";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <AuthCard
      wide
      title="Create your account"
      subtitle="Free to start. Get guidance from an AI doctor in minutes."
      footer={{ text: "Already have an account?", linkLabel: "Log in", href: site.routes.login }}
    >
      <SignupForm />
    </AuthCard>
  );
}

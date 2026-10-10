import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a link to reset it."
      footer={{ text: "Remembered it?", linkLabel: "Back to log in", href: site.routes.login }}
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}

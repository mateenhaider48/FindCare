import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to continue talking with your AI doctor."
      footer={{ text: "New to FindCare?", linkLabel: "Create an account", href: site.routes.signup }}
    >
      <LoginForm />
    </AuthCard>
  );
}

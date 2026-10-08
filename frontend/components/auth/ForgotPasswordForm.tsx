"use client";

import { MailCheck } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ForgotPasswordForm() {
  // UI only: no email is sent until auth is implemented.
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-card border border-line bg-mist p-6 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-success-soft text-success">
          <MailCheck className="size-6" />
        </span>
        <p className="mt-4 font-semibold text-ink">Check your email</p>
        <p className="mt-1 text-sm text-slate">If an account exists for that address, a reset link is on its way.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="space-y-5"
    >
      <Input label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
      <Button type="submit" size="lg" className="w-full">
        Send reset link
      </Button>
    </form>
  );
}

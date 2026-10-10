"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { nextPath, signIn } from "@/lib/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import GoogleButton from "./GoogleButton";
import PasswordInput from "./PasswordInput";

export default function SignupForm() {
  const router = useRouter();
  // Dummy auth: creating an account just signs you in for now.
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn(String(new FormData(e.currentTarget).get("name") ?? "Patient"));
    router.push(nextPath());
  };
  return (
    <>
      <GoogleButton />
      <form onSubmit={submit} className="space-y-3.5">
        <div className="grid gap-3.5 sm:grid-cols-2">
          <Input
            label="Full name"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <PasswordInput
            label="Password"
            name="password"
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            minLength={8}
            required
          />
          <PasswordInput
            label="Confirm"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Repeat it"
            minLength={8}
            required
          />
        </div>
        <label className="flex items-start gap-3 text-[13px] text-slate">
          <input
            type="checkbox"
            name="terms"
            required
            className="mt-0.5 size-4 rounded border-line accent-primary"
          />
          <span>
            I agree to the{" "}
            <Link
              href="#"
              className="font-medium text-sky-ink hover:text-navy"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="font-medium text-sky-ink hover:text-navy"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        <Button type="submit" size="md" className="w-full bg-navy hover:bg-[#1b2d4f]">
          Create account
        </Button>
      </form>
    </>
  );
}

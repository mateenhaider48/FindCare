"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import GoogleButton from "./GoogleButton";
import PasswordInput from "./PasswordInput";

export default function SignupForm() {
  // UI only: submit is wired up when auth is implemented.
  return (
    <>
      <GoogleButton />
      <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
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
        <PasswordInput
          label="Password"
          name="password"
          autoComplete="new-password"
          placeholder="Create a password"
          minLength={8}
          required
        />
        <PasswordInput
          label="Confirm password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Repeat your password"
          minLength={8}
          required
        />
        <label className="flex items-start gap-3 text-sm text-slate">
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
              className="font-medium text-primary hover:text-primary-hover"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="font-medium text-primary hover:text-primary-hover"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        <Button type="submit" size="lg" className="w-full">
          Create account
        </Button>
      </form>
    </>
  );
}

"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { site } from "@/lib/site";
import GoogleButton from "./GoogleButton";
import PasswordInput from "./PasswordInput";

export default function LoginForm() {
  // UI only: submit is wired up when auth is implemented.
  return (
    <>
      <GoogleButton />
      <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
        <div>
          <PasswordInput
            label="Password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            required
          />
          <div className="mt-2 text-right">
            <Link
              href={site.routes.forgotPassword}
              className="text-sm font-medium text-primary hover:text-primary-hover"
            >
              Forgot password?
            </Link>
          </div>
        </div>
        <Button type="submit" size="lg" className="w-full">
          Log in
        </Button>
      </form>
    </>
  );
}

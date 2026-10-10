"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { site } from "@/lib/site";
import { nextPath, signIn } from "@/lib/auth";
import GoogleButton from "./GoogleButton";
import PasswordInput from "./PasswordInput";

export default function LoginForm() {
  const router = useRouter();
  // Dummy auth: any email/password signs you in until real auth is connected.
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "");
    signIn(email.split("@")[0] || "Patient");
    router.push(nextPath());
  };
  return (
    <>
      <GoogleButton />
      <form onSubmit={submit} className="space-y-3.5">
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
          <div className="mt-1.5 text-right">
            <Link
              href={site.routes.forgotPassword}
              className="text-[13px] font-medium text-sky-ink hover:text-navy"
            >
              Forgot password?
            </Link>
          </div>
        </div>
        <Button type="submit" size="md" className="w-full bg-navy hover:bg-[#1b2d4f]">
          Log in
        </Button>
      </form>
    </>
  );
}

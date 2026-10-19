"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { site } from "@/lib/site";
import { nextPath } from "@/lib/auth";
import { authErrorMessage, createSession } from "@/lib/auth-client";
import { getFirebaseAuth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import GoogleButton from "./GoogleButton";
import PasswordInput from "./PasswordInput";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      await createSession(user);
      router.replace(nextPath());
      router.refresh();
    } catch (err) {
      setError(authErrorMessage(err, "Login failed. Please try again."));
      setLoading(false);
    }
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
        <Button type="submit" size="md" disabled={loading} className="w-full bg-navy hover:bg-[#1b2d4f]">
          {loading ? "Logging in..." : "Log in"}
        </Button>
      </form>
      {error && (
        <p role="alert" className="mt-2 text-sm text-center text-red-600">
          {error}
        </p>
      )}
    </>
  );
}

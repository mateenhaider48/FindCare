"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { nextPath } from "@/lib/auth";
import { authErrorMessage, createSession } from "@/lib/auth-client";
import { getFirebaseAuth } from "@/lib/firebase";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import GoogleButton from "./GoogleButton";
import PasswordInput from "./PasswordInput";

export default function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
      // Set the name before the session is created so the ID token carries it.
      await updateProfile(user, { displayName: name });
      await createSession(user);
      router.replace(nextPath());
      router.refresh();
    } catch (err) {
      setError(authErrorMessage(err, "Failed to create an account. Please try again."));
      setLoading(false);
    }
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
            <Link href="#" className="font-medium text-sky-ink hover:text-navy">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="#" className="font-medium text-sky-ink hover:text-navy">
              Privacy Policy
            </Link>
            .
          </span>
          
        </label>
        <Button
          type="submit"
          size="md"
          disabled={loading}
          className="w-full bg-navy hover:bg-[#1b2d4f]"
        >
          {loading? "Creating account..." : "Create account"}
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

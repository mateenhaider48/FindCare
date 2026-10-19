"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { nextPath } from "@/lib/auth";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import GoogleButton from "./GoogleButton";
import PasswordInput from "./PasswordInput";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
export default function SignupForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    // Form reference ko await se pehle capture karo.
    const form = e.currentTarget;
    const formData = new FormData(form);

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
      // Firebase account create karega.
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Firebase profile mein user ka naam save karo.
      await updateProfile(credential.user, {
        displayName: name,
      });
      const idToken = await credential.user.getIdToken(true);
       const response = await fetch(
        `${API_URL}/api/auth/session`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "SESSION_CREATION_FAILED");
      }


      router.push("/dashboard");
    
    } catch (error: unknown) {
    
      const errorCode =
        typeof error === "object" && error !== null && "code" in error
          ? String(error.code)
          : "";

      switch (errorCode) {
        case "auth/email-already-in-use":
          setError("This email is already registered. Please log in instead.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/weak-password":
          setError("Please choose a stronger password.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please check your connection.");
          break;
        default:
          setError("Failed to create an account. Please try again.");
      }
    } finally {
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

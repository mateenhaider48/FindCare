"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { site } from "@/lib/site";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import GoogleButton from "./GoogleButton";
import PasswordInput from "./PasswordInput";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";



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

    try {
      setLoading(true);

      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const idToken = await credential.user.getIdToken(true);

      const response = await fetch(`${API_URL}/api/auth/session`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to complete sign-in. Please try again.");
        return;
      }

      router.replace("/dashboard");
    } catch (error: unknown) {
      const errorCode =
        typeof error === "object" && error !== null && "code" in error
          ? String(error.code)
          : "";

      switch (errorCode) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          setError("Incorrect email or password.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Check your internet connection.");
          break;
        default:
          setError("Login failed. Please try again.");
      }
    } finally {
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
        <Button type="submit" size="md" className="w-full bg-navy hover:bg-[#1b2d4f]">
          Log in
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

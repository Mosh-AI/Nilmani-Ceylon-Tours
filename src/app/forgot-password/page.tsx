"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await authClient.forgetPassword({
      email,
      redirectTo: "/reset-password",
    });

    setLoading(false);

    if (result.error) {
      setError(result.error.message ?? "Something went wrong. Please try again.");
      return;
    }

    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAF9] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <p className="font-serif text-2xl font-light tracking-widest text-[#1C1209]">
              Nilmani Ceylon Tours
            </p>
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h1 className="mb-1 text-xl font-semibold text-gray-900">
            Reset your password
          </h1>
          <p className="mb-6 text-sm text-gray-500">
            Enter your email and we&apos;ll send a reset link.
          </p>

          {sent ? (
            <div className="flex items-start gap-2.5 rounded-lg bg-green-50 p-4 text-sm text-green-800">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
              <div>
                <p className="font-semibold">Check your inbox</p>
                <p className="mt-1">
                  We sent a password reset link to <strong>{email}</strong>. It
                  expires in 1 hour.
                </p>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 flex items-start gap-2.5 rounded-lg bg-red-50 p-3 text-sm text-red-800">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[#1C1209] py-3 text-sm font-semibold tracking-wide text-[#C9A84C] transition hover:bg-[#2E1E0A] disabled:opacity-60"
                >
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
              </form>
            </>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            Remember your password?{" "}
            <Link href="/login" className="font-medium text-[#C9A84C] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 10) {
      setError("Password must be at least 10 characters.");
      setLoading(false);
      return;
    }

    const result = await signUp.email({ name, email, password });

    if (result.error) {
      setError(result.error.message ?? "Registration failed. Please try again.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 2000);
  }

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]";

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
            Create account
          </h1>
          <p className="mb-6 text-sm text-gray-500">
            Track your bookings and manage your trips in one place.
          </p>

          {success && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg bg-green-50 p-3 text-sm text-green-800">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              Account created! Redirecting to your dashboard…
            </div>
          )}

          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg bg-red-50 p-3 text-sm text-red-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 10 characters"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Strength: {password.length < 10 ? "Too short" : password.length < 14 ? "Good" : "Strong"}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full rounded-full bg-[#1C1209] py-3 text-sm font-semibold tracking-wide text-[#C9A84C] transition hover:bg-[#2E1E0A] disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#C9A84C] hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          By registering you agree to our{" "}
          <Link href="/terms" className="hover:underline">Terms</Link> and{" "}
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}

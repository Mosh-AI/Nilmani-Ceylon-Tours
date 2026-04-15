"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn.email({ email, password });

    if (result.error) {
      setError(result.error.message ?? "Invalid email or password.");
      setLoading(false);
      return;
    }

    // Redirect: admin → /admin, users → /dashboard
    const params = new URLSearchParams(window.location.search);
    const callbackUrl = params.get("callbackUrl") ?? "/dashboard";
    router.push(callbackUrl);
    router.refresh();
  }

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAF9] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <p className="font-serif text-2xl font-light tracking-widest text-[#1C1209]">
              Nilmani Ceylon Tours
            </p>
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h1 className="mb-1 text-xl font-semibold text-gray-900">Sign in</h1>
          <p className="mb-6 text-sm text-gray-500">
            Access your bookings and trip details.
          </p>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg bg-red-50 p-3 text-sm text-red-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#C9A84C] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#1C1209] py-3 text-sm font-semibold tracking-wide text-[#C9A84C] transition hover:bg-[#2E1E0A] disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-[#C9A84C] hover:underline">
              Create one
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          <Link href="/" className="hover:underline">
            ← Back to homepage
          </Link>
        </p>
      </div>
    </div>
  );
}

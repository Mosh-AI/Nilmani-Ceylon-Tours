"use client";

import { useState } from "react";
import { StatusBadge } from "@/app/admin/_components/StatusBadge";
import { Search, CalendarCheck } from "lucide-react";
import Link from "next/link";

type TrackResult = {
  referenceCode: string;
  guestName: string;
  startDate: string;
  guests: number;
  status: string;
  totalPrice: number | null;
  specialRequests: string | null;
};

export default function TrackPage() {
  const [ref, setRef] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const res = await fetch(
      `/api/bookings/track?ref=${encodeURIComponent(ref.trim().toUpperCase())}&email=${encodeURIComponent(email.trim().toLowerCase())}`
    );
    const data = await res.json();
    setLoading(false);

    if (!res.ok || !data.booking) {
      setError("No booking found. Please check your reference code and email address.");
      return;
    }

    setResult(data.booking);
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] px-4 py-16">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 text-center">
          <Link href="/" className="font-serif text-xl font-light tracking-widest text-[#1C1209]">
            Nilmani Ceylon Tours
          </Link>
          <h1 className="mt-4 font-serif text-3xl font-light text-[#1C1209]">
            Track Your Booking
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your booking reference and email to see the latest status.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Booking Reference
              </label>
              <input
                type="text"
                required
                value={ref}
                onChange={(e) => setRef(e.target.value.toUpperCase())}
                placeholder="NCT-20260415-XXXXX"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 font-mono text-sm uppercase focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="The email you used when booking"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1C1209] py-3 text-sm font-semibold text-[#C9A84C] transition hover:bg-[#2E1E0A] disabled:opacity-60"
            >
              <Search className="h-4 w-4" />
              {loading ? "Searching…" : "Track Booking"}
            </button>
          </form>

          {result && (
            <div className="mt-6 rounded-xl border border-gray-100 bg-[#FAFAF9] p-5">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs text-gray-500">
                  {result.referenceCode}
                </p>
                <StatusBadge status={result.status} />
              </div>
              <p className="mt-2 font-medium text-gray-900">
                Hello, {result.guestName}
              </p>
              <dl className="mt-3 space-y-1.5 text-sm">
                {[
                  ["Start Date", result.startDate],
                  ["Guests", result.guests],
                  ...(result.totalPrice ? [["Quoted Price", `$${result.totalPrice} USD`]] : []),
                  ...(result.specialRequests ? [["Special Requests", result.specialRequests]] : []),
                ].map(([label, value]) => (
                  <div key={String(label)} className="flex justify-between gap-2">
                    <dt className="text-gray-500">{label}</dt>
                    <dd className="font-medium text-gray-900">{String(value)}</dd>
                  </div>
                ))}
              </dl>
              <a
                href="https://wa.me/94787829952"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block w-full rounded-lg bg-[#25D366]/10 px-4 py-2.5 text-center text-sm font-medium text-[#128C7E] hover:bg-[#25D366]/20"
              >
                Questions? WhatsApp Roshan
              </a>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Have an account?{" "}
          <Link href="/login" className="text-[#C9A84C] hover:underline">
            Sign in
          </Link>{" "}
          to manage your bookings.
        </p>
      </div>
    </div>
  );
}

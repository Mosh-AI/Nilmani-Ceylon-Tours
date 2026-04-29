"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const CONSENT_KEY = "nct_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 z-50 w-[calc(100vw-2rem)] max-w-xs rounded-2xl border border-[rgba(201,168,76,0.25)] bg-white px-5 py-4 shadow-2xl"
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[#C9A84C]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
            <path d="M12 8v4m0 4h.01" />
          </svg>
        </span>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#1C1209]">Cookie Notice</p>
      </div>
      <p className="text-xs leading-relaxed text-gray-500">
        We use cookies to improve your experience. See our{" "}
        <Link href="/privacy" className="text-[#C9A84C] hover:underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={accept}
          className="flex-1 rounded-full bg-[#1C1209] py-2 text-xs font-semibold text-[#C9A84C] transition hover:bg-[#2E1E0A]"
        >
          Accept
        </button>
        <button
          onClick={decline}
          className="flex-1 rounded-full border border-gray-200 py-2 text-xs font-medium text-gray-500 transition hover:bg-gray-50"
        >
          Decline
        </button>
      </div>
    </div>
  );
}

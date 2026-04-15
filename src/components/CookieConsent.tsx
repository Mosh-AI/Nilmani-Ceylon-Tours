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
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white px-4 py-4 shadow-lg sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-sm sm:rounded-xl sm:border"
    >
      <p className="text-sm leading-relaxed text-gray-700">
        We use cookies to improve your experience and analyse site usage. See
        our{" "}
        <Link href="/privacy" className="text-[#C9A84C] underline-offset-2 hover:underline">
          Privacy Policy
        </Link>{" "}
        for details.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={accept}
          className="flex-1 rounded-full bg-[#1C1209] py-2 text-xs font-semibold text-[#C9A84C] hover:bg-[#2E1E0A]"
        >
          Accept
        </button>
        <button
          onClick={decline}
          className="flex-1 rounded-full border border-gray-200 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
        >
          Decline
        </button>
      </div>
    </div>
  );
}

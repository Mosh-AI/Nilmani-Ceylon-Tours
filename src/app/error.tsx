"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-bg px-6">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-brand-border bg-brand-surface">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-gold"
            aria-hidden
          >
            <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>

        <h1 className="font-serif text-3xl font-semibold text-brand-text sm:text-4xl">
          Something Went Wrong
        </h1>

        <p className="mt-4 text-base leading-relaxed text-brand-muted">
          We apologize for the inconvenience. An unexpected error has occurred.
          Please try again or return to the homepage.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="btn-gold inline-flex items-center rounded-full px-8 py-3 text-sm font-semibold tracking-luxury"
          >
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="btn-outline-gold inline-flex items-center rounded-full px-8 py-3 text-sm font-semibold tracking-luxury"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

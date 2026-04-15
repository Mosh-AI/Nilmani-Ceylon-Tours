"use client";

import { useEffect } from "react";
import Link from "next/link";

function TripAdvisorOwl({ className, size = 56 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle cx="30" cy="30" r="30" fill="#00AA6C" />
      <circle cx="21" cy="28" r="8" fill="white" />
      <circle cx="39" cy="28" r="8" fill="white" />
      <circle cx="21" cy="28" r="5" fill="#00AA6C" />
      <circle cx="39" cy="28" r="5" fill="#00AA6C" />
      <circle cx="21" cy="28" r="2.5" fill="black" />
      <circle cx="39" cy="28" r="2.5" fill="black" />
      <circle cx="22" cy="27" r="1" fill="white" />
      <circle cx="40" cy="27" r="1" fill="white" />
      <path
        d="M24 38 Q30 43 36 38"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M15 22 Q18 17 21 20"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M45 22 Q42 17 39 20"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M26 20 Q30 16 34 20"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
      />
    </svg>
  );
}

const taCards = [
  {
    quote:
      "An absolutely unforgettable journey through Sri Lanka. Our chauffeur was incredibly knowledgeable, professional, and made every moment feel special. The itinerary was perfectly curated — from Sigiriya to the southern coast.",
    name: "James",
    meta: "UK · March 2024",
    initial: "J",
    delay: "",
  },
  {
    quote:
      "Nilmani Ceylon Tours exceeded every expectation. The luxury vehicle was immaculate, and our driver went above and beyond to ensure our comfort. A truly premium experience from start to finish.",
    name: "Anita",
    meta: "Germany · February 2024",
    initial: "A",
    delay: "delay-200",
  },
  {
    quote:
      "We felt completely at ease throughout our entire Sri Lanka tour. The attention to detail, the hidden gems we discovered, and the warmth of the service made this the best holiday we have ever taken.",
    name: "Sophie",
    meta: "Australia · January 2024",
    initial: "S",
    delay: "delay-300",
  },
];

export function TripadvisorSection() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.08 }
    );

    document
      .querySelectorAll("#tripadvisor-block .reveal")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="tripadvisor-block"
      className="relative overflow-hidden py-24 md:py-32"
      style={{
        background:
          "linear-gradient(180deg, var(--brand-bg) 0%, var(--brand-surface) 40%, var(--brand-surface) 70%, var(--brand-bg) 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(201,168,76,0.04) 0%, transparent 60%)",
        }}
      />
      <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 opacity-5">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M180 10 Q120 60 100 120 Q80 60 20 10"
            stroke="#C9A84C"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M180 10 Q140 80 130 150"
            stroke="#C9A84C"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M20 10 Q60 80 70 150"
            stroke="#C9A84C"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-8">
        <div className="reveal mb-16 text-center">
          <p
            className="mb-4 text-xs uppercase tracking-[0.25em] text-gold"
          >
            Traveler Reviews
          </p>
          <h2
            className="mb-4 font-serif text-4xl font-light text-brand-text md:text-5xl"
          >
            Trusted by Travelers{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Worldwide
            </span>
          </h2>
          <div className="gold-divider mx-auto mb-6" />
          <p
            className="mx-auto max-w-md text-sm text-brand-muted"
          >
            Our guests share their experiences — unfiltered, authentic, and from
            the heart.
          </p>
        </div>

        <div className="reveal mb-16 flex justify-center delay-100">
          <div
            className="flex flex-col items-center gap-5 rounded-2xl border border-gold/20 bg-white px-5 py-5 shadow-lg sm:flex-row sm:px-8 sm:py-6"
          >
            <TripAdvisorOwl size={56} />
            <div className="text-center sm:text-left">
              <p
                className="mb-1 text-xs uppercase tracking-[0.2em] text-gold"
              >
                Rated on Tripadvisor
              </p>
              <p
                className="mb-2 font-serif text-xl font-light text-brand-text"
              >
                Rated Excellent on Tripadvisor
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-gold" />
                  ))}
                </div>
                <span
                  className="text-xs text-brand-faint"
                >
                  Based on real traveler reviews
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {taCards.map((c) => (
            <div key={c.name} className={`reveal group ${c.delay}`}>
              <div
                className="h-full cursor-default rounded-2xl border border-brand-border bg-white p-7 shadow-md transition-all duration-500"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-gold" />
                    ))}
                  </div>
                  <TripAdvisorOwl size={24} />
                </div>
                <div
                  className="mb-3 font-serif text-5xl leading-none text-gold/30"
                >
                  &ldquo;
                </div>
                <p
                  className="mb-6 text-sm leading-relaxed text-brand-muted"
                >
                  {c.quote}
                </p>
                <div
                  className="mb-4 h-px bg-brand-border"
                />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-brand-text">
                      {c.name}
                    </p>
                    <p
                      className="text-xs text-brand-faint"
                    >
                      {c.meta}
                    </p>
                  </div>
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 text-xs font-semibold text-gold"
                  >
                    {c.initial}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal mb-20 flex flex-col items-center justify-center gap-4 delay-200 sm:flex-row">
          <Link
            href="https://www.tripadvisor.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm"
          >
            <TripAdvisorOwl size={20} />
            <span>View All Reviews on Tripadvisor</span>
          </Link>
          <Link
            href="https://www.tripadvisor.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm"
          >
            <Star className="h-4 w-4 text-gold" />
            Leave a Review
          </Link>
        </div>

        <div className="reveal delay-300">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {(
              [
                {
                  label: "Verified Tour Operator",
                  path: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 10c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.249-8.25-3.286z",
                },
                {
                  label: "Private Chauffeur Service",
                  path: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12",
                },
                {
                  label: "Luxury Travel Experience",
                  path: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z",
                },
                {
                  label: "Top Rated on Tripadvisor",
                  paths: [
                    "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z",
                    "M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z",
                  ],
                },
              ] as const
            ).map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-3 rounded-xl border border-brand-border bg-white px-4 py-6 text-center transition-all duration-300"
              >
                <div className="text-gold">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="mx-auto h-6 w-6"
                    aria-hidden
                  >
                    {"paths" in item
                      ? item.paths.map((d, i) => (
                          <path
                            key={i}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d={d}
                          />
                        ))
                      : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d={item.path}
                          />
                        )}
                  </svg>
                </div>
                <p
                  className="text-xs font-medium tracking-wide text-brand-muted"
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="reveal mt-16 flex flex-col items-center justify-center gap-3 border-t border-brand-border pt-8 delay-400 sm:flex-row"
        >
          <TripAdvisorOwl size={28} />
          <p
            className="text-center text-xs text-brand-faint"
          >
            See why travelers trust us on Tripadvisor — read our reviews and
            share your experience.
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Testimonial {
  guestName: string;
  country: string;
  text: string;
  photoUrl: string;
  rating: number;
}

const TRUNCATE_LENGTH = 200;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={i < rating ? "0" : "1.5"}
          className={i < rating ? "text-gold" : "text-brand-border"}
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function QuoteIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="currentColor"
      className="text-gold/20"
      aria-hidden="true"
    >
      <path d="M10 8C6.686 8 4 10.686 4 14v10h10V14H7c0-1.654 1.346-3 3-3V8zm18 0c-3.314 0-6 2.686-6 6v10h10V14h-7c0-1.654 1.346-3 3-3V8z" />
    </svg>
  );
}

function TestimonialCard({
  testimonial,
  delay,
}: {
  testimonial: Testimonial;
  delay: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = testimonial.text.length > TRUNCATE_LENGTH;
  const displayText =
    isLong && !expanded
      ? testimonial.text.slice(0, TRUNCATE_LENGTH).trimEnd() + "…"
      : testimonial.text;

  return (
    <article
      className={`testimonial-card reveal group relative flex flex-col overflow-hidden rounded-2xl p-6 sm:p-7 ${delay}`}
    >
      {/* Large decorative quote mark — top-right */}
      <div className="pointer-events-none absolute right-5 top-4 select-none">
        <QuoteIcon />
      </div>

      {/* Avatar + meta */}
      <header className="mb-5 flex items-center gap-4">
        <div className="relative size-14 shrink-0">
          <Image
            src={testimonial.photoUrl}
            alt={testimonial.guestName}
            fill
            className="rounded-full object-cover ring-2 ring-gold/30 ring-offset-2 ring-offset-white transition-all duration-300 group-hover:ring-gold/60"
            sizes="56px"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate font-serif text-base font-medium text-brand-text">
            {testimonial.guestName}
          </p>
          <div className="mt-0.5 flex items-center gap-1.5">
            {/* Country flag dot */}
            <span
              className="inline-block size-1.5 shrink-0 rounded-full bg-gold/60"
              aria-hidden="true"
            />
            <p className="truncate text-xs tracking-wide text-gold">
              {testimonial.country}
            </p>
          </div>
        </div>
      </header>

      {/* Stars */}
      <div className="mb-4">
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Gold micro-divider */}
      <div className="mb-4 h-px w-8 bg-gradient-to-r from-gold/60 to-transparent" />

      {/* Quote body */}
      <blockquote className="flex-1">
        <p className="text-sm italic leading-relaxed text-brand-muted">
          &ldquo;{displayText}&rdquo;
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-3 text-xs font-semibold tracking-wide text-gold underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-expanded={expanded}
          >
            {expanded ? "Read less" : "Read more"}
          </button>
        )}
      </blockquote>
    </article>
  );
}

export function GuestTestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
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
      .querySelectorAll("#guest-stories .reveal")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Stagger delays cycle through 0–400 ms across all 8 cards
  const delayClasses = [
    "delay-0",
    "delay-100",
    "delay-200",
    "delay-300",
    "delay-0",
    "delay-100",
    "delay-200",
    "delay-300",
  ];

  return (
    <section
      id="guest-stories"
      className="bg-brand-bg px-6 py-24 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section header */}
        <div className="mb-16 text-center">
          <div className="reveal mb-4 flex items-center justify-center gap-3">
            <div className="gold-divider" />
            <span className="text-xs font-medium uppercase tracking-luxury text-gold">
              Guest Stories
            </span>
            <div className="gold-divider" />
          </div>
          <h2 className="reveal font-serif text-4xl leading-tight font-light text-brand-text delay-100 md:text-5xl lg:text-6xl">
            Words from
            <br />
            <span className="text-gold-gradient italic">Our Guests</span>
          </h2>
          <p className="reveal mx-auto mt-6 max-w-xl text-sm leading-relaxed text-brand-muted delay-200 md:text-base">
            Real experiences, real voices — from travellers who trusted us with
            their most treasured journeys.
          </p>
        </div>

        {/* Masonry-style responsive grid */}
        {/*
          Mobile  : 1 col
          Tablet  : 2 cols
          Desktop : 4 cols
          Column-based masonry via CSS columns so long cards don't force all
          rows to expand — each column flows independently.
        */}
        <div
          className="columns-1 gap-5 sm:columns-2 lg:columns-4"
          style={{ columnFill: "balance" }}
        >
          {testimonials.map((t, i) => (
            <div key={t.guestName} className="mb-5 break-inside-avoid">
              <TestimonialCard
                testimonial={t}
                delay={delayClasses[i % delayClasses.length]}
              />
            </div>
          ))}
        </div>

        {/* Bottom trust signals */}
        <div className="reveal mt-14 flex flex-col items-center gap-4 delay-300 sm:flex-row sm:justify-center">
          {/* Aggregate rating pill */}
          <div className="flex items-center gap-2 rounded-full border border-brand-border bg-white px-5 py-2.5 shadow-sm">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="shrink-0 text-gold"
              aria-hidden="true"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="font-serif text-sm font-medium text-brand-text">
              4.9 / 5
            </span>
            <span className="text-xs text-brand-faint">
              across 300+ journeys
            </span>
          </div>

          {/* Divider dot */}
          <span
            className="hidden size-1 rounded-full bg-brand-border sm:inline-block"
            aria-hidden="true"
          />

          {/* TripAdvisor-style badge placeholder */}
          <div className="flex items-center gap-2 rounded-full border border-brand-border bg-white px-5 py-2.5 shadow-sm">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="shrink-0 text-gold"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs text-brand-muted">
              100% satisfaction guaranteed
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

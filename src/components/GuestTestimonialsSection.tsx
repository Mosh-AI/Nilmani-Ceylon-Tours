"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Testimonial {
  guestName: string;
  country: string;
  text: string;
  photoUrl: string;
  rating: number;
}

const TRUNCATE_LENGTH = 200;

// ---------------------------------------------------------------------------
// Responsive cards-visible counts
// ---------------------------------------------------------------------------
// We read this at runtime so the slider math is always correct.
function getVisibleCount(): number {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 640) return 2;
  return 1;
}

// ---------------------------------------------------------------------------
// Sub-components (unchanged from original)
// ---------------------------------------------------------------------------

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
  isCenter,
}: {
  testimonial: Testimonial;
  isCenter: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = testimonial.text.length > TRUNCATE_LENGTH;
  const displayText =
    isLong && !expanded
      ? testimonial.text.slice(0, TRUNCATE_LENGTH).trimEnd() + "…"
      : testimonial.text;

  return (
    <article
      className="testimonial-card group relative flex h-full flex-col overflow-hidden rounded-2xl p-6 sm:p-7"
      style={
        isCenter
          ? {
              boxShadow:
                "0 0 0 1px rgba(201,168,76,0.35), 0 8px 32px rgba(201,168,76,0.18)",
            }
          : undefined
      }
    >
      {/* Decorative quote mark */}
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

// ---------------------------------------------------------------------------
// Arrow button
// ---------------------------------------------------------------------------

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous testimonials" : "Next testimonials"}
      /*
       * Base: circle, transparent bg, gold border, gold chevron
       * Hover: gold fill, white chevron
       * Disabled: opacity-30, no pointer events
       */
      className={[
        "group/arrow flex size-11 shrink-0 items-center justify-center rounded-full border border-gold/70 bg-transparent",
        "transition-all duration-200",
        "hover:bg-gold hover:border-gold hover:shadow-[0_4px_16px_rgba(201,168,76,0.3)]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        disabled ? "pointer-events-none opacity-30" : "cursor-pointer",
      ].join(" ")}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gold transition-colors duration-200 group-hover/arrow:text-white"
        aria-hidden="true"
      >
        {direction === "prev" ? (
          <polyline points="15 18 9 12 15 6" />
        ) : (
          <polyline points="9 6 15 12 9 18" />
        )}
      </svg>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Dot indicators
// ---------------------------------------------------------------------------

function DotIndicators({
  total,
  current,
  onDotClick,
}: {
  total: number;
  current: number;
  onDotClick: (i: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Testimonial slides">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === current}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => onDotClick(i)}
          className={[
            "h-2 rounded-full border transition-all duration-300 ease-in-out",
            i === current
              ? // Active: filled gold, pill shape (wider)
                "w-6 border-gold bg-gold"
              : // Inactive: transparent with gold border
                "w-2 border-gold/60 bg-transparent hover:border-gold hover:bg-gold/20",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------

export function GuestTestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  // ---------------------------------------------------------------------------
  // Slider state
  // ---------------------------------------------------------------------------
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  // Gap between cards in pixels — must match the gap CSS variable below
  const GAP = 20; // px

  // Max index: last position where we still fill all visible slots
  const maxIndex = Math.max(0, testimonials.length - visibleCount);

  // ---------------------------------------------------------------------------
  // Responsive visible count — update on resize
  // ---------------------------------------------------------------------------
  useEffect(() => {
    function update() {
      const count = getVisibleCount();
      setVisibleCount(count);
      // Clamp current index after resize
      setCurrentIndex((prev) => Math.min(prev, Math.max(0, testimonials.length - count)));
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [testimonials.length]);

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------
  const prev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((i) => Math.min(maxIndex, i + 1));
  }, [maxIndex]);

  // ---------------------------------------------------------------------------
  // Touch / swipe handlers
  // ---------------------------------------------------------------------------
  const touchStartX = useRef<number | null>(null);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    // Require at least 40px swipe to trigger navigation
    if (Math.abs(delta) >= 40) {
      if (delta > 0) next();
      else prev();
    }
    touchStartX.current = null;
  }

  // ---------------------------------------------------------------------------
  // Keyboard navigation on the track
  // ---------------------------------------------------------------------------
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  }

  // ---------------------------------------------------------------------------
  // Reveal observer (section header only — cards don't individually animate)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.08 }
    );
    document
      .querySelectorAll("#guest-stories .reveal")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ---------------------------------------------------------------------------
  // TranslateX formula
  //
  // Each card occupies: (trackWidth - gap*(visibleCount-1)) / visibleCount  pixels
  // Moving by 1 index shifts by exactly: cardWidth + gap
  //
  // We express this with CSS calc() so it responds to any container width:
  //
  //   translateX = -currentIndex * (100% / visibleCount + GAP / visibleCount... )
  //
  // Simpler with a CSS custom property on the track:
  //   --card-w = calc((100% - GAP * (visibleCount-1)px) / visibleCount)
  //   translateX(-currentIndex * (var(--card-w) + GAP px))
  //
  // We encode this as a single calc() inline string below.
  // ---------------------------------------------------------------------------

  const translateX = `calc(${currentIndex} * (-1 * ((100% - ${GAP * (visibleCount - 1)}px) / ${visibleCount} + ${GAP}px)))`;

  // Center card index within the visible window (0-based from track start)
  // For visibleCount=3 → center is slot 1 → absolute index = currentIndex + 1
  // For visibleCount=2 → center slot 0 (left card highlighted)
  // For visibleCount=1 → only card highlighted
  const centerAbsoluteIndex =
    visibleCount === 1 ? currentIndex : currentIndex + Math.floor(visibleCount / 2);

  return (
    <section
      id="guest-stories"
      className="bg-brand-bg px-6 py-24 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">

        {/* ------------------------------------------------------------------ */}
        {/* Section header (unchanged) */}
        {/* ------------------------------------------------------------------ */}
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

        {/* ------------------------------------------------------------------ */}
        {/* Slider — arrows + track                                             */}
        {/* ------------------------------------------------------------------ */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* Prev arrow — sits outside the track on the left */}
          <ArrowButton direction="prev" onClick={prev} disabled={currentIndex === 0} />

          {/*
           * Track wrapper — overflow:hidden clips cards outside the viewport.
           * flex-1 so it fills remaining width between the two arrows.
           */}
          <div
            className="min-w-0 flex-1 overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="region"
            aria-label="Testimonials slider"
          >
            {/*
             * Inner rail — a flex row of ALL cards.
             * Width is set so exactly `visibleCount` cards fit at any time.
             * transform: translateX slides it left/right.
             *
             * Card width formula (inline style):
             *   Each card = (100% - gap*(n-1)) / n  where 100% = rail width = track width
             *   But rail itself is flex, so we give each card a fixed % width based on
             *   how many cards are visible, accounting for gaps.
             *
             * We use CSS custom properties via style prop:
             *   --visible: visibleCount
             *   --gap: GAP px
             *   Card width = calc((100% - var(--gap) * (var(--visible) - 1)) / var(--visible))
             */}
            <div
              className="flex"
              style={{
                gap: `${GAP}px`,
                transform: `translateX(${translateX})`,
                transition: "transform 500ms ease-in-out",
                // Prevent layout shift from transition affecting surrounding elements
                willChange: "transform",
              }}
              aria-live="polite"
            >
              {testimonials.map((t, i) => (
                <div
                  key={t.guestName}
                  aria-hidden={i < currentIndex || i >= currentIndex + visibleCount}
                  style={{
                    // Each card takes exactly 1/visibleCount of the track width minus gaps
                    flex: `0 0 calc((100% - ${GAP * (visibleCount - 1)}px) / ${visibleCount})`,
                    minWidth: 0,
                  }}
                >
                  <TestimonialCard
                    testimonial={t}
                    isCenter={i === centerAbsoluteIndex}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Next arrow — sits outside the track on the right */}
          <ArrowButton direction="next" onClick={next} disabled={currentIndex === maxIndex} />
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Dot indicators                                                      */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-8">
          <DotIndicators
            total={maxIndex + 1}
            current={currentIndex}
            onDotClick={setCurrentIndex}
          />
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Trust strip (unchanged)                                             */}
        {/* ------------------------------------------------------------------ */}
        <div className="reveal mt-10 flex flex-col items-center gap-4 delay-300 sm:flex-row sm:justify-center">
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
            <span className="text-xs text-brand-faint">across 300+ journeys</span>
          </div>

          <span
            className="hidden size-1 rounded-full bg-brand-border sm:inline-block"
            aria-hidden="true"
          />

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

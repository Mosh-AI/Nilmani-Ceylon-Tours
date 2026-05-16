"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const SLIDE_MS = 7000;

const slides = [
  {
    src: "/images/slider-ella-bridge.jpg",
    alt: "Blue passenger train crossing the iconic Nine Arch Bridge through misty emerald jungle in Ella, Sri Lanka",
    captionTop: "HIGHLAND RAILWAY",
    captionBottom: "Ella, Hill Country",
    gradient:
      "linear-gradient(135deg, rgba(28,18,9,0.65) 0%, rgba(28,18,9,0.15) 60%, rgba(28,18,9,0.05) 100%)",
  },
  {
    src: "/images/slider-beach.jpg",
    alt: "Aerial drone view of pristine turquoise ocean meeting golden sand beach with palm trees, Sri Lanka coastline",
    captionTop: "PRISTINE SHORES",
    captionBottom: "Southern Coastline",
    gradient:
      "linear-gradient(to top, rgba(28,18,9,0.72) 0%, rgba(28,18,9,0.30) 45%, rgba(28,18,9,0.08) 100%)",
  },
  {
    src: "/images/slider-sigiriya.jpg",
    alt: "Ancient stone pathway through ruins leading to Sigiriya Lion Rock Fortress under vivid blue sky, Sri Lanka",
    captionTop: "ANCIENT MAJESTY",
    captionBottom: "Sigiriya Rock Fortress",
    gradient:
      "linear-gradient(160deg, rgba(28,18,9,0.10) 0%, rgba(28,18,9,0.20) 40%, rgba(28,18,9,0.62) 100%)",
  },
  {
    src: "/images/slider-waterfall.jpg",
    alt: "Adventurer standing with arms raised in triumph before a massive cascading waterfall in lush Sri Lanka jungle",
    captionTop: "WILD DISCOVERY",
    captionBottom: "Sri Lanka's Hidden Cascades",
    gradient:
      "linear-gradient(to bottom, rgba(28,18,9,0.48) 0%, rgba(28,18,9,0.15) 42%, rgba(28,18,9,0.55) 100%)",
  },
];

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  const goTo = useCallback((index: number) => {
    setActiveSlide(index);
    setProgressKey((k) => k + 1);
  }, []);

  const goNext = useCallback(() => {
    goTo((activeSlide + 1) % slides.length);
  }, [activeSlide, goTo]);

  const goPrev = useCallback(() => {
    goTo((activeSlide - 1 + slides.length) % slides.length);
  }, [activeSlide, goTo]);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
      setProgressKey((k) => k + 1);
    }, SLIDE_MS);
    return () => clearInterval(t);
  }, []);

  const current = slides[activeSlide];

  return (
    <section
      style={{ minHeight: "100svh" }}
      className="relative flex min-h-screen flex-col overflow-hidden"
    >
      {/* ── Background slides ── */}
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className="absolute inset-0 h-full w-full transition-opacity duration-[900ms] ease-in-out"
            style={{
              opacity: i === activeSlide ? 1 : 0,
              zIndex: i === activeSlide ? 2 : 0,
            }}
            aria-hidden={i !== activeSlide}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover"
              sizes="100vw"
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
            />
            {/* Per-slide directional gradient — tuned per image brightness */}
            <div
              className="absolute inset-0"
              style={{ background: slide.gradient }}
            />
          </div>
        ))}
        {/* Base overlay — ensures headline text is always legible */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/45 via-black/20 to-black/55" />
      </div>

      {/* Spacer — keeps the section full height between slides and stats bar */}
      <div className="relative z-20 flex-1" />

      {/* ── Slide caption — bottom-left, fades in on each slide change ── */}
      <div
        key={`caption-${activeSlide}`}
        className="animate-in fade-in duration-700 absolute bottom-[242px] left-8 z-30 md:bottom-[137px] md:left-12 lg:bottom-[132px] lg:left-16"
      >
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.26em] text-gold">
          {current.captionTop}
        </p>
        <p
          className="font-serif text-xl font-light italic text-white/90 sm:text-2xl"
          style={{ textShadow: "0 1px 16px rgba(28,18,9,0.7)" }}
        >
          {current.captionBottom}
        </p>
      </div>

      {/* ── Prev arrow ── */}
      <button
        type="button"
        onClick={goPrev}
        aria-label="Previous slide"
        className="group absolute top-1/2 left-4 z-30 flex h-11 w-11 cursor-pointer -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition-all duration-300 hover:border-gold hover:bg-gold/80 lg:left-8"
      >
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          className="h-4 w-4"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* ── Next arrow ── */}
      <button
        type="button"
        onClick={goNext}
        aria-label="Next slide"
        className="group absolute top-1/2 right-4 z-30 flex h-11 w-11 cursor-pointer -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition-all duration-300 hover:border-gold hover:bg-gold/80 lg:right-8"
      >
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          className="h-4 w-4"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* ── Dot indicators — right side, vertical ── */}
      <div className="absolute right-6 bottom-[242px] z-30 flex flex-col gap-2 md:bottom-[137px] lg:bottom-[132px] lg:right-12">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="group relative flex h-11 w-11 cursor-pointer items-center justify-center focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          >
            <span
              className={`block rounded-full transition-all duration-500 ${
                i === activeSlide
                  ? "h-7 w-2.5 bg-gold"
                  : "h-2.5 w-2.5 bg-white/60 group-hover:bg-white"
              }`}
            />
          </button>
        ))}
      </div>

      {/* ── Stats bar with progress indicator ── */}
      <div className="relative z-20 mt-auto w-full border-t border-brand-border bg-white/95 backdrop-blur-xl">
        <div className="h-[2px] w-full bg-black/10">
          <div
            key={progressKey}
            className="h-full origin-left bg-gold animate-hero-progress"
          />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-2 divide-x divide-brand-border md:grid-cols-4">
            {[
              { value: "500+", label: "Happy Travelers" },
              { value: "15+", label: "Curated Tours" },
              {
                value: (
                  <span className="inline-flex items-baseline gap-1">
                    5
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="none"
                      className="inline-block translate-y-[2px]"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </span>
                ),
                label: "Rated Experience",
              },
              { value: "24/7", label: "Concierge Support" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="px-6 py-6 text-center md:px-10 md:text-left"
              >
                <p className="mb-1 font-serif text-xl font-medium text-gold sm:text-2xl md:text-3xl">
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-wide text-brand-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const SLIDE_MS = 5000;

const slides = [
  {
    src: "/images/sigiriya-hero.jpg",
    alt: "Sigiriya Lion Rock fortress with lush green gardens and pathways leading to the ancient rock, Sri Lanka",
    captionTop: "Ancient Majesty",
    captionBottom: "Sigiriya",
  },
  {
    src: "https://images.unsplash.com/photo-1648905742802-95668285192a?w=1920&q=85",
    alt: "Nine Arch Bridge in Ella Sri Lanka surrounded by lush green tea plantations, misty mountains, blue sky",
    captionTop: "Scenic Highlands",
    captionBottom: "Ella",
  },
{
    src: "https://images.unsplash.com/photo-1701916106564-77bfb662cc7e?w=1920&q=85",
    alt: "Tea plantation workers in Nuwara Eliya Sri Lanka, green rolling hills, misty mountain backdrop, morning light",
    captionTop: "Misty Tea Country",
    captionBottom: "Ella Highlands",
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
            <div className="relative h-full w-full">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                sizes="100vw"
                priority={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          </div>
        ))}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/25 to-black/60" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </div>

      <div className="absolute bottom-32 left-6 z-30 flex items-center gap-3 lg:bottom-28 lg:left-12">
        <div className="gold-divider" />
        <div>
          <p className="text-xs font-medium uppercase tracking-luxury text-gold">
            {current.captionTop}
          </p>
          <p className="text-sm font-light tracking-wide text-white/80">
            {current.captionBottom}
          </p>
        </div>
      </div>

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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      <div className="absolute right-6 bottom-28 z-30 flex flex-col gap-2 lg:right-12">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="relative flex h-11 w-11 cursor-pointer items-center justify-center group focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          >
            <span
              className={`block rounded-full transition-all duration-500 ${
                i === activeSlide
                  ? "h-6 w-2.5 bg-gold"
                  : "h-2.5 w-2.5 bg-white/60 group-hover:bg-white"
              }`}
            />
          </button>
        ))}
      </div>

      <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pt-36 pb-0 lg:px-12">
        <div className="flex max-w-3xl flex-1 flex-col justify-center">
          <div className="mb-8 flex items-center gap-3">
            <div className="gold-divider" />
            <span className="text-xs font-medium uppercase tracking-luxury text-gold">
              Premium Sri Lanka Travel
            </span>
          </div>
          <h1 className="mb-8 font-serif text-4xl leading-[1.0] font-light tracking-tight text-white sm:text-5xl md:text-7xl lg:text-[84px]">
            Experience
            <br />
            <span className="text-gold-gradient italic">Sri Lanka</span> in
            <br />
            Elegance
          </h1>
          <p className="mb-10 max-w-xl text-base font-light leading-relaxed text-white/80 sm:text-lg md:text-xl">
            Tailored luxury journeys through ancient temples, misty highlands,
            pristine beaches, and untamed wildlife. Every detail, perfected for
            you.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/booking"
              className="btn-gold inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold tracking-luxury"
            >
              <span>Book Your Tour</span>
            </Link>
            <Link
              href="/#destinations"
              className="btn-outline-gold inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold tracking-luxury"
            >
              Explore Destinations
            </Link>
          </div>
        </div>

        <div
          className="absolute top-1/2 right-12 hidden w-72 -translate-y-1/2 rounded-2xl border bg-white/95 p-6 shadow-2xl backdrop-blur-xl lg:block"
          style={{ borderColor: "var(--brand-border-gold)" }}
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-luxury text-gold">
            Quick Inquiry
          </p>
          <div className="mb-4 flex flex-col gap-3">
            <div className="flex items-center gap-3 rounded-xl bg-brand-surface px-4 py-3">
              <span className="text-gold"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block"><path d="M12 2l2.09 6.26L20 12l-5.91 3.74L12 22l-2.09-6.26L4 12l5.91-3.74L12 2z" /></svg></span>
              <div>
                <p className="text-xs text-brand-faint">Tour Type</p>
                <p className="text-sm font-medium text-brand-text">
                  Luxury Getaway
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-brand-surface px-4 py-3">
              <span className="text-gold"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block"><path d="M12 2l10 10-10 10L2 12 12 2z" /><path d="M12 6l6 6-6 6-6-6 6-6z" /></svg></span>
              <div>
                <p className="text-xs text-brand-faint">Duration</p>
                <p className="text-sm font-medium text-brand-text">
                  7–14 Days
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-brand-surface px-4 py-3">
              <span className="text-gold"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block"><path d="M12 2l7 4v8l-7 4-7-4V6l7-4z" /><path d="M12 8v8" /><path d="M8.5 10l7 0" /></svg></span>
              <div>
                <p className="text-xs text-brand-faint">Includes</p>
                <p className="text-sm font-medium text-brand-text">
                  Private Chauffeur
                </p>
              </div>
            </div>
          </div>
          <Link
            href="/booking"
            className="btn-gold flex w-full items-center justify-center rounded-full py-3 text-xs font-semibold tracking-luxury"
          >
            <span>Request a Quote</span>
          </Link>
        </div>
      </div>

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
                { value: <span className="inline-flex items-baseline gap-1">5<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="inline-block translate-y-[2px]"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg></span>, label: "Rated Experience" },
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

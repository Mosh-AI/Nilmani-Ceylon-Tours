"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

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

      {/* Location caption — centered floating pill */}
      <div className="absolute bottom-28 left-1/2 z-30 -translate-x-1/2 lg:bottom-24">
        <div
          className="flex items-center gap-4 rounded-full px-6 py-3"
          style={{
            background: "rgba(13, 9, 5, 0.45)",
            border: "1px solid rgba(201, 168, 76, 0.25)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold/70" />
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
              {current.captionTop}
            </p>
            <p className="mt-0.5 text-sm font-light tracking-wide text-white/85">
              {current.captionBottom}
            </p>
          </div>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold/70" />
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

      <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pt-36 pb-0 lg:px-12" />

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

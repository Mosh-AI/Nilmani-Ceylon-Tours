"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import { tours, TOUR_CATEGORIES, type TourCategory } from "@/data/tours";

type FilterCategory = "All" | TourCategory;

const FILTER_OPTIONS: FilterCategory[] = ["All", ...TOUR_CATEGORIES];

function TourCard({ tour, index }: { tour: (typeof tours)[number]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        "reveal group flex flex-col overflow-hidden rounded-2xl border border-brand-border bg-white shadow-sm transition-all duration-500",
        "hover:-translate-y-1 hover:shadow-lg hover:border-gold/30"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Link
        href={`/tours/${tour.slug}`}
        className="relative block h-56 overflow-hidden sm:h-64"
      >
        <Image
          src={tour.heroImage}
          alt={tour.heroAlt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Category badge */}
        <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-luxury text-gold backdrop-blur-sm">
          {tour.category}
        </span>

        {/* Price badge */}
        <span className="absolute bottom-4 right-4 rounded-full bg-black/60 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
          {tour.price}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-4 text-xs text-brand-muted">
          <span className="inline-flex items-center gap-1">
            <Clock size={13} className="text-gold" />
            {tour.duration}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} className="text-gold" />
            {tour.durationDays} destinations
          </span>
        </div>

        <h3 className="mb-2 font-serif text-xl font-light text-brand-text lg:text-2xl">
          {tour.title}
        </h3>

        <p className="mb-1 text-xs text-gold">{tour.subtitle}</p>

        <p className="mb-6 mt-2 flex-1 text-sm leading-relaxed text-brand-muted">
          {tour.description}
        </p>

        <Link
          href={`/tours/${tour.slug}`}
          className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-luxury text-gold transition-all duration-300 hover:gap-3"
        >
          View Details
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function ToursPage() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("All");

  useEffect(() => {
    document.documentElement.classList.add("js-ready");
    return () => {
      document.documentElement.classList.remove("js-ready");
    };
  }, []);

  const filteredTours =
    activeFilter === "All"
      ? tours
      : tours.filter((t) => t.category === activeFilter);

  return (
    <main className="min-h-screen bg-brand-bg">
      <Header />

      {/* Hero banner */}
      <section className="relative flex h-72 items-end overflow-hidden bg-brand-surface sm:h-80 lg:h-96">
        <Image
          src="/images/sigiriya-hero.jpg"
          alt="Panoramic view of Sri Lanka landscapes"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-12 lg:px-12">
          <div className="mb-4 flex items-center gap-3">
            <div className="gold-divider" />
            <span className="text-xs font-medium uppercase tracking-luxury text-gold">
              Curated Experiences
            </span>
          </div>
          <h1 className="font-serif text-3xl leading-tight font-light text-white sm:text-4xl lg:text-5xl">
            Our Signature{" "}
            <span className="text-gold-gradient italic">Tours</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm font-light leading-relaxed text-white/80 sm:text-base">
            Handcrafted itineraries that showcase the very best of Sri Lanka
            &mdash; from ancient kingdoms to pristine coastlines.
          </p>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
        {/* Category filters */}
        <div className="mb-12 flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={cn(
                "rounded-full border px-5 py-2 text-xs font-medium tracking-wide transition-all duration-300",
                activeFilter === cat
                  ? "border-gold bg-gold text-white"
                  : "border-brand-border bg-white text-brand-muted hover:border-gold/40 hover:text-gold"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tour grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTours.map((tour, i) => (
            <TourCard key={tour.slug} tour={tour} index={i} />
          ))}
        </div>

        {filteredTours.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-brand-muted">
              No tours found in this category. Try a different filter.
            </p>
          </div>
        )}
      </section>

      {/* CTA strip */}
      <section className="bg-brand-surface px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-serif text-2xl font-light text-brand-text sm:text-3xl lg:text-4xl">
            Don&rsquo;t See What You&rsquo;re Looking For?
          </h2>
          <p className="mb-8 text-sm leading-relaxed text-brand-muted sm:text-base">
            Every journey is unique. We craft bespoke itineraries tailored to
            your interests, pace, and budget. Tell us your dream Sri Lanka
            experience and we will make it happen.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/booking"
              className="btn-gold inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold tracking-luxury"
            >
              Request Custom Tour
            </Link>
            <a
              href="https://wa.me/94787829952"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold tracking-luxury"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

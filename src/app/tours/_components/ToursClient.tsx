"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Shape coming from the database
export type DbTourCard = {
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  category: string | null;
  duration: number;        // integer days
  price: number;           // integer USD
  heroImage: string | null;
};

function formatPrice(usd: number) {
  return `$${usd.toLocaleString("en-US")}`;
}

function formatDuration(days: number) {
  const nights = days - 1;
  return `${days} Day${days !== 1 ? "s" : ""} / ${nights} Night${nights !== 1 ? "s" : ""}`;
}

function TourCard({ tour, index }: { tour: DbTourCard; index: number }) {
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

  const heroSrc = tour.heroImage ?? "/images/sigiriya-hero.jpg";

  return (
    <div
      ref={cardRef}
      className={cn(
        "reveal group flex flex-col overflow-hidden rounded-2xl border border-brand-border bg-white shadow-sm transition-all duration-500",
        "hover:-translate-y-1 hover:shadow-lg hover:border-gold/30"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Link href={`/tours/${tour.slug}`} className="relative block h-56 overflow-hidden sm:h-64">
        <Image
          src={heroSrc}
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {tour.category && (
          <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-luxury text-gold backdrop-blur-sm">
            {tour.category}
          </span>
        )}
        <span className="absolute bottom-4 right-4 rounded-full bg-black/60 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
          {formatPrice(tour.price)}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-4 text-xs text-brand-muted">
          <span className="inline-flex items-center gap-1">
            <Clock size={13} className="text-gold" />
            {formatDuration(tour.duration)}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} className="text-gold" />
            {tour.duration} stops
          </span>
        </div>

        <h3 className="mb-2 font-serif text-xl font-light text-brand-text lg:text-2xl">
          {tour.title}
        </h3>
        {tour.subtitle && (
          <p className="mb-1 text-xs text-gold">{tour.subtitle}</p>
        )}
        <p className="mb-6 mt-2 flex-1 text-sm leading-relaxed text-brand-muted line-clamp-3">
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

export function ToursClient({ tours }: { tours: DbTourCard[] }) {
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    document.documentElement.classList.add("js-ready");
    return () => document.documentElement.classList.remove("js-ready");
  }, []);

  // Build filter list from actual active tours only
  const filterOptions = [
    "All",
    ...Array.from(new Set(tours.map((t) => t.category).filter(Boolean) as string[])).sort(),
  ];

  const filtered =
    activeFilter === "All" ? tours : tours.filter((t) => t.category === activeFilter);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
      {/* Category filters */}
      <div className="mb-12 flex flex-wrap gap-2">
        {filterOptions.map((cat) => (
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

      {/* Grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tour, i) => (
          <TourCard key={tour.slug} tour={tour} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-brand-muted">No tours found in this category.</p>
        </div>
      )}
    </section>
  );
}

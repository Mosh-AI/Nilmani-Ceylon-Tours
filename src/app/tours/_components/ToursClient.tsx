"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tour } from "@/data/tours";

type FilterCategory = "All" | string;

function TourCard({ tour, index }: { tour: Tour; index: number }) {
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
        <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-luxury text-gold backdrop-blur-sm">
          {tour.category}
        </span>
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

export function ToursClient({ tours }: { tours: Tour[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("All");

  useEffect(() => {
    document.documentElement.classList.add("js-ready");
    return () => {
      document.documentElement.classList.remove("js-ready");
    };
  }, []);

  // Derive filter options from available tours only
  const filterOptions: FilterCategory[] = [
    "All",
    ...Array.from(new Set(tours.map((t) => t.category))).sort(),
  ];

  const filteredTours =
    activeFilter === "All"
      ? tours
      : tours.filter((t) => t.category === activeFilter);

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
  );
}

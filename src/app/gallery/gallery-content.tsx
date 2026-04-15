"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Lightbox } from "@/components/Lightbox";
import {
  galleryImages,
  GALLERY_CATEGORIES,
  type GalleryCategory,
  type GalleryImage,
} from "@/data/gallery";

type FilterCategory = "All" | GalleryCategory;

const ALL_FILTERS: readonly FilterCategory[] = [
  "All",
  ...GALLERY_CATEGORIES,
] as const;

export function GalleryContent() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const filteredImages =
    activeFilter === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeFilter);

  // Scroll-reveal observer
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    const cards = galleryRef.current?.querySelectorAll(".gallery-card");
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [filteredImages]);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const goToPrevious = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? filteredImages.length - 1 : prev - 1;
    });
  }, [filteredImages.length]);

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === filteredImages.length - 1 ? 0 : prev + 1;
    });
  }, [filteredImages.length]);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-brand-bg pt-20">
        {/* Hero section */}
        <section className="relative overflow-hidden bg-brand-surface px-6 py-20 lg:px-12 lg:py-28">
          <div className="noise-overlay" />
          <div className="relative mx-auto max-w-7xl text-center">
            <div className="mb-6 flex items-center justify-center gap-3">
              <div className="gold-divider" />
              <Camera className="h-4 w-4 text-gold" aria-hidden />
              <span className="text-xs font-medium uppercase tracking-luxury text-gold">
                Visual Journey
              </span>
              <Camera className="h-4 w-4 text-gold" aria-hidden />
              <div className="gold-divider" />
            </div>
            <h1 className="font-serif text-4xl font-semibold text-brand-text sm:text-5xl lg:text-6xl">
              Photo Gallery
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-brand-muted sm:text-lg">
              Discover the breathtaking beauty of Sri Lanka through our
              collection of photographs — from ancient ruins and misty highlands
              to golden beaches and vibrant wildlife.
            </p>
            <div className="mx-auto mt-6 flex items-center justify-center gap-2">
              <div className="gold-divider" />
              <div className="h-1.5 w-1.5 rounded-full bg-gold" />
              <div className="gold-divider" />
            </div>
          </div>
        </section>

        {/* Filter buttons */}
        <section className="sticky top-20 z-30 border-b border-brand-border bg-brand-bg/95 px-6 backdrop-blur-lg lg:px-12">
          <div className="scrollbar-hide mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto py-4">
            {ALL_FILTERS.map((filter) => {
              const isActive = filter === activeFilter;
              const count =
                filter === "All"
                  ? galleryImages.length
                  : galleryImages.filter((img) => img.category === filter)
                      .length;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
                    isActive
                      ? "btn-gold shadow-sm"
                      : "border border-brand-border text-brand-muted hover:border-gold/40 hover:text-brand-text",
                  )}
                  aria-pressed={isActive}
                >
                  {filter}
                  <span
                    className={cn(
                      "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs",
                      isActive
                        ? "bg-black/10 text-brand-text"
                        : "bg-brand-surface text-brand-muted",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Gallery masonry grid */}
        <section className="px-6 py-12 lg:px-12 lg:py-16" ref={galleryRef}>
          <div className="mx-auto max-w-7xl">
            {filteredImages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Camera className="mb-4 h-12 w-12 text-brand-faint" />
                <p className="font-serif text-xl text-brand-muted">
                  No photos in this category yet.
                </p>
              </div>
            ) : (
              <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 lg:gap-6">
                {filteredImages.map((image, index) => (
                  <GalleryCard
                    key={image.id}
                    image={image}
                    index={index}
                    onClick={() => openLightbox(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={filteredImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrevious={goToPrevious}
          onNext={goToNext}
        />
      )}
    </>
  );
}

interface GalleryCardProps {
  image: GalleryImage;
  index: number;
  onClick: () => void;
}

function GalleryCard({ image, index, onClick }: GalleryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "gallery-card reveal group relative mb-4 block w-full overflow-hidden rounded-xl lg:mb-6",
        "cursor-pointer border border-transparent transition-all duration-500",
        "hover:border-brand-border-gold hover:shadow-lg",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
      )}
      style={{ transitionDelay: `${(index % 6) * 80}ms` }}
      aria-label={`View photo: ${image.alt}`}
    >
      <div className="relative">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className={cn(
            "w-full object-cover transition-transform duration-500",
            "group-hover:scale-[1.02]",
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading={index < 6 ? "eager" : "lazy"}
        />

        {/* Hover overlay */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-start justify-end p-4",
            "bg-gradient-to-t from-black/60 via-black/10 to-transparent",
            "opacity-0 transition-opacity duration-300",
            "group-hover:opacity-100 group-focus-visible:opacity-100",
          )}
        >
          <span
            className={cn(
              "mb-2 inline-flex items-center rounded-full px-3 py-1",
              "bg-gold/90 text-xs font-semibold tracking-wide text-brand-text",
            )}
          >
            {image.category}
          </span>
          <p className="line-clamp-2 text-left text-sm leading-snug text-white/90">
            {image.alt}
          </p>
        </div>
      </div>
    </button>
  );
}

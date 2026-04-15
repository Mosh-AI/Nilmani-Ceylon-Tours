"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Clock,
  MapPin,
  Users,
  Mountain,
  Check,
  X,
  ChevronDown,
  ArrowRight,
  MessageCircle,
  Calendar,
  Phone,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import { getTourBySlug, getRelatedTours, tours } from "@/data/tours";
import type { Tour, ItineraryDay, FAQ } from "@/data/tours";

/* ── Accordion Item ── */
function AccordionItem({
  title,
  children,
  defaultOpen = false,
  index,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  index: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(
    defaultOpen ? undefined : 0
  );

  useEffect(() => {
    if (!contentRef.current) return;
    if (open) {
      setHeight(contentRef.current.scrollHeight);
      const timeout = setTimeout(() => setHeight(undefined), 350);
      return () => clearTimeout(timeout);
    } else {
      setHeight(contentRef.current.scrollHeight);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setHeight(0));
      });
    }
  }, [open]);

  return (
    <div className="border-b border-brand-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3">
          <span className="font-serif text-lg font-light text-gold">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-sm font-medium text-brand-text sm:text-base">
            {title}
          </span>
        </span>
        <ChevronDown
          size={18}
          className={cn(
            "shrink-0 text-brand-muted transition-transform duration-300",
            open && "rotate-180 text-gold"
          )}
        />
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-[height] duration-350 ease-in-out"
        style={{ height: height !== undefined ? `${height}px` : "auto" }}
      >
        <div className="pb-5">{children}</div>
      </div>
    </div>
  );
}

/* ── Itinerary Day Card ── */
function ItineraryCard({ day, defaultOpen }: { day: ItineraryDay; defaultOpen: boolean }) {
  return (
    <AccordionItem
      title={`Day ${day.day}: ${day.title}`}
      defaultOpen={defaultOpen}
      index={day.day - 1}
    >
      <p className="mb-4 text-sm leading-relaxed text-brand-muted">
        {day.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {day.highlights.map((h) => (
          <span
            key={h}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-surface px-3 py-1 text-xs text-brand-muted"
          >
            <span className="h-1 w-1 rounded-full bg-gold" />
            {h}
          </span>
        ))}
      </div>
    </AccordionItem>
  );
}

/* ── FAQ Item ── */
function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  return (
    <AccordionItem title={faq.question} index={index}>
      <p className="text-sm leading-relaxed text-brand-muted">{faq.answer}</p>
    </AccordionItem>
  );
}

/* ── Related Tour Card ── */
function RelatedTourCard({ tour }: { tour: Tour }) {
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-brand-border bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:border-gold/30"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={tour.heroImage}
          alt={tour.heroAlt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-luxury text-gold backdrop-blur-sm">
          {tour.category}
        </span>
      </div>
      <div className="p-5">
        <p className="mb-1 text-xs text-brand-muted">{tour.duration}</p>
        <h4 className="mb-2 font-serif text-lg font-light text-brand-text">
          {tour.title}
        </h4>
        <p className="text-sm font-semibold text-gold">{tour.price}</p>
      </div>
    </Link>
  );
}

/* ── Gallery Strip ── */
function GalleryStrip({
  images,
}: {
  images: { src: string; alt: string }[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.6;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scroll("left")}
        className="absolute top-1/2 left-2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-gold/80 hover:border-gold"
        aria-label="Scroll gallery left"
      >
        <ChevronDown size={16} className="-rotate-90" />
      </button>
      <button
        type="button"
        onClick={() => scroll("right")}
        className="absolute top-1/2 right-2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-gold/80 hover:border-gold"
        aria-label="Scroll gallery right"
      >
        <ChevronDown size={16} className="rotate-90" />
      </button>
      <div
        ref={scrollRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto"
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="relative h-48 w-72 shrink-0 snap-start overflow-hidden rounded-xl sm:h-56 sm:w-80 lg:h-64 lg:w-96"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 288px, (max-width: 1024px) 320px, 384px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function TourDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const tour = getTourBySlug(slug);
  const relatedTours = getRelatedTours(slug, 3);

  useEffect(() => {
    document.documentElement.classList.add("js-ready");
    return () => {
      document.documentElement.classList.remove("js-ready");
    };
  }, []);

  if (!tour) {
    return (
      <main className="min-h-screen bg-brand-bg">
        <Header />
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6">
          <h1 className="mb-4 font-serif text-3xl font-light text-brand-text">
            Tour Not Found
          </h1>
          <p className="mb-8 text-brand-muted">
            The tour you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/tours"
            className="btn-gold rounded-full px-8 py-3 text-sm font-semibold tracking-luxury"
          >
            Browse All Tours
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-bg">
      <Header />

      {/* ── Hero ── */}
      <section className="relative flex h-80 items-end overflow-hidden sm:h-96 lg:h-[28rem]">
        <Image
          src={tour.heroImage}
          alt={tour.heroAlt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-10 lg:px-12 lg:pb-14">
          <div className="mb-3 flex items-center gap-3">
            <div className="gold-divider" />
            <span className="text-xs font-medium uppercase tracking-luxury text-gold">
              {tour.category} Tour
            </span>
          </div>
          <h1 className="mb-3 font-serif text-3xl leading-tight font-light text-white sm:text-4xl lg:text-5xl">
            {tour.title}
          </h1>
          <p className="mb-4 max-w-2xl text-sm font-light text-white/80 sm:text-base">
            {tour.subtitle}
          </p>

          {/* Price badge */}
          <div className="inline-flex items-center gap-3 rounded-full bg-white/95 px-5 py-2.5 shadow-lg backdrop-blur-sm">
            <span className="font-serif text-xl font-medium text-gold">
              {tour.price}
            </span>
            <span className="text-xs text-brand-muted">
              {tour.priceNote}
            </span>
          </div>
        </div>
      </section>

      {/* ── Breadcrumb ── */}
      <div className="border-b border-brand-border bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-3 lg:px-12">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-brand-muted">
            <Link href="/" className="transition-colors hover:text-gold">
              Home
            </Link>
            <span>/</span>
            <Link href="/tours" className="transition-colors hover:text-gold">
              Tours
            </Link>
            <span>/</span>
            <span className="text-brand-text">{tour.title}</span>
          </nav>
        </div>
      </div>

      {/* ── Overview Stats ── */}
      <section className="border-b border-brand-border bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-brand-border sm:grid-cols-4">
          {[
            { icon: Clock, label: "Duration", value: tour.duration },
            { icon: Mountain, label: "Difficulty", value: tour.difficulty },
            { icon: Users, label: "Group Size", value: tour.groupSize },
            { icon: MapPin, label: "Destinations", value: `${tour.durationDays} stops` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="px-4 py-5 text-center sm:px-6 sm:py-6">
              <Icon size={20} className="mx-auto mb-2 text-gold" />
              <p className="text-xs text-brand-faint">{label}</p>
              <p className="mt-1 text-sm font-medium text-brand-text">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-3 lg:gap-12">
          {/* ── Main Content (2/3) ── */}
          <div className="lg:col-span-2">
            {/* About */}
            <div className="mb-16">
              <div className="mb-4 flex items-center gap-3">
                <div className="gold-divider" />
                <span className="text-xs font-medium uppercase tracking-luxury text-gold">
                  About This Tour
                </span>
              </div>
              <p className="text-sm leading-relaxed text-brand-muted sm:text-base">
                {tour.longDescription}
              </p>
            </div>

            {/* Highlights */}
            <div className="mb-16">
              <h2 className="mb-6 font-serif text-2xl font-light text-brand-text lg:text-3xl">
                Tour Highlights
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {tour.highlights.map((h) => (
                  <div key={h} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/10">
                      <Check size={12} className="text-gold" />
                    </span>
                    <span className="text-sm text-brand-muted">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            <div className="mb-16">
              <h2 className="mb-6 font-serif text-2xl font-light text-brand-text lg:text-3xl">
                Photo Gallery
              </h2>
              <GalleryStrip images={tour.galleryImages} />
            </div>

            {/* Itinerary */}
            <div className="mb-16">
              <h2 className="mb-6 font-serif text-2xl font-light text-brand-text lg:text-3xl">
                Day-by-Day Itinerary
              </h2>
              <div>
                {tour.itinerary.map((day) => (
                  <ItineraryCard
                    key={day.day}
                    day={day}
                    defaultOpen={day.day === 1}
                  />
                ))}
              </div>
            </div>

            {/* Includes / Excludes */}
            <div className="mb-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <h3 className="mb-4 font-serif text-xl font-light text-brand-text">
                  What&rsquo;s Included
                </h3>
                <ul className="space-y-2.5">
                  {tour.included.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-brand-muted"
                    >
                      <Check
                        size={15}
                        className="mt-0.5 shrink-0 text-green-600"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-4 font-serif text-xl font-light text-brand-text">
                  What&rsquo;s Not Included
                </h3>
                <ul className="space-y-2.5">
                  {tour.notIncluded.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-brand-muted"
                    >
                      <X
                        size={15}
                        className="mt-0.5 shrink-0 text-red-400"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="mb-6 font-serif text-2xl font-light text-brand-text lg:text-3xl">
                Frequently Asked Questions
              </h2>
              <div>
                {tour.faqs.map((faq, i) => (
                  <FAQItem key={faq.question} faq={faq} index={i} />
                ))}
              </div>
            </div>
          </div>

          {/* ── Sidebar (1/3) ── */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Booking card */}
              <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
                <p className="mb-1 text-xs font-medium uppercase tracking-luxury text-gold">
                  Book This Tour
                </p>
                <p className="mb-1 font-serif text-2xl font-light text-brand-text">
                  {tour.price}
                </p>
                <p className="mb-6 text-xs text-brand-muted">
                  {tour.priceNote}
                </p>

                <div className="mb-4 space-y-3">
                  <div className="flex items-center gap-3 rounded-xl bg-brand-surface px-4 py-3">
                    <Calendar size={16} className="text-gold" />
                    <div>
                      <p className="text-xs text-brand-faint">Duration</p>
                      <p className="text-sm font-medium text-brand-text">
                        {tour.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-brand-surface px-4 py-3">
                    <Users size={16} className="text-gold" />
                    <div>
                      <p className="text-xs text-brand-faint">Group Size</p>
                      <p className="text-sm font-medium text-brand-text">
                        {tour.groupSize}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-brand-surface px-4 py-3">
                    <Mountain size={16} className="text-gold" />
                    <div>
                      <p className="text-xs text-brand-faint">Difficulty</p>
                      <p className="text-sm font-medium text-brand-text">
                        {tour.difficulty}
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/booking"
                  className="btn-gold flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold tracking-luxury"
                >
                  <Calendar size={15} />
                  Book This Tour
                </Link>

                <a
                  href="https://wa.me/94787829952"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-gold mt-3 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold tracking-luxury"
                >
                  <MessageCircle size={15} />
                  Chat on WhatsApp
                </a>
              </div>

              {/* Contact card */}
              <div className="rounded-2xl border border-brand-border bg-brand-surface p-6">
                <p className="mb-3 text-xs font-medium uppercase tracking-luxury text-gold">
                  Need Help?
                </p>
                <p className="mb-4 text-sm text-brand-muted">
                  Our travel specialists are ready to customize this tour to
                  your preferences.
                </p>
                <a
                  href="tel:+94787829952"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gold transition-colors hover:text-gold/80"
                >
                  <Phone size={14} />
                  +94 78 782 9952
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Related Tours ── */}
      {relatedTours.length > 0 && (
        <section className="border-t border-brand-border bg-brand-surface px-6 py-16 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div className="gold-divider" />
                  <span className="text-xs font-medium uppercase tracking-luxury text-gold">
                    More Tours
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-light text-brand-text lg:text-3xl">
                  You Might Also Like
                </h2>
              </div>
              <Link
                href="/tours"
                className="hidden items-center gap-2 text-xs font-medium uppercase tracking-luxury text-gold transition-all duration-300 hover:gap-3 sm:inline-flex"
              >
                View All Tours
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTours.map((t) => (
                <RelatedTourCard key={t.slug} tour={t} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const services = [
  {
    number: "01",
    badge: "Most Popular",
    title: "Private Chauffeur Tours",
    description:
      "Travel in absolute comfort with a dedicated, English-speaking chauffeur who knows every scenic road, hidden gem, and cultural landmark across Sri Lanka.",
    image:
      "https://images.unsplash.com/photo-1659898170356-2548029008a6?w=1200&q=85",
    imageAlt:
      "Luxury black vehicle on a winding mountain road through lush green tea plantations in Sri Lanka, misty morning light",
  },
  {
    number: "02",
    badge: "Premium",
    title: "Luxury Getaways",
    description:
      "Curated stays at handpicked boutique hotels and heritage villas. From oceanfront retreats to highland sanctuaries — only the finest for our guests.",
    image:
      "https://images.unsplash.com/photo-1618823888675-343fbc6a9030?w=1200&q=85",
    imageAlt:
      "Infinity pool overlooking the Indian Ocean at a luxury resort in Sri Lanka, golden sunset, calm waters",
  },
  {
    number: "03",
    badge: "Bespoke",
    title: "Custom Travel Plans",
    description:
      "Your journey, your way. We design entirely bespoke itineraries — whether a romantic honeymoon, a family adventure, or a solo cultural immersion.",
    image:
      "https://images.unsplash.com/photo-1704433724798-ab63b0f86d09?w=1200&q=85",
    imageAlt:
      "Colorful fishing boats on a pristine Sri Lankan beach, bright clear sky, turquoise water, palm trees",
  },
];

const delayClasses = ["delay-100", "delay-200", "delay-300"];

export default function ServicesSection() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      className="bg-brand-bg px-6 py-24 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="reveal">
            <div className="mb-4 flex items-center gap-3">
              <div className="gold-divider" />
              <span className="text-xs font-medium uppercase tracking-luxury text-gold">
                Our Services
              </span>
            </div>
            <h2 className="font-serif text-4xl leading-tight font-light text-brand-text md:text-5xl lg:text-6xl">
              Crafted for the
              <br />
              <span className="text-gold-gradient italic">Discerning</span>{" "}
              Traveler
            </h2>
          </div>
          <p className="reveal max-w-sm text-base leading-relaxed text-brand-muted delay-200 md:text-lg">
            Three ways to experience Sri Lanka at its finest — each tailored to
            your definition of luxury.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={service.number}
              className={`reveal group overflow-hidden rounded-3xl border border-brand-border bg-brand-surface transition-all duration-500 hover:border-[rgba(201,168,76,0.35)] ${delayClasses[index]}`}
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-transparent to-transparent" />
                <span className="absolute top-4 right-4 rounded-full border border-brand-border bg-white/90 px-3 py-1 text-xs font-medium tracking-wide text-gold backdrop-blur-sm">
                  {service.badge}
                </span>
              </div>
              <div className="p-5 sm:p-8">
                <span className="mb-4 block font-serif text-4xl leading-none font-light text-gold/40">
                  {service.number}
                </span>
                <h3 className="mb-4 font-serif text-2xl leading-snug font-light text-brand-text">
                  {service.title}
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-brand-muted">
                  {service.description}
                </p>
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-luxury text-gold transition-all duration-300 hover:gap-3"
                >
                  Enquire Now
                  <span className="text-base">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

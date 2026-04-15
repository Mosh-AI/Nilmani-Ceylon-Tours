"use client";

import { useEffect } from "react";

const testimonials = [
  {
    quote:
      "Nilmani Ceylon Tours exceeded every expectation. Our chauffeur Roshan was exceptional — knowledgeable, warm, and incredibly professional. The hotels they selected were breathtaking. I've traveled to 40 countries and this was genuinely one of the finest experiences.",
    name: "Charlotte Whitmore",
    place: "London, UK",
    tour: "Luxury Cultural Circuit",
    delay: "delay-0",
  },
  {
    quote:
      "Our honeymoon in Sri Lanka was perfect in every way. The team crafted a completely bespoke itinerary — from Galle Fort sunsets to Ella mountain mornings. Every detail was handled with care.",
    name: "Hiroshi Tanaka",
    place: "Tokyo, Japan",
    tour: "Honeymoon Package",
    delay: "delay-100",
  },
  {
    quote:
      "Traveling with three children can be challenging, but Nilmani made it effortless. The itinerary balanced adventure with comfort perfectly. Our kids still talk about the elephant safari and the train through the tea country.",
    name: "Sophie & Marc Laurent",
    place: "Paris, France",
    tour: "Family Adventure Tour",
    delay: "delay-200",
  },
  {
    quote:
      "I came to Sri Lanka seeking peace and rejuvenation. What I found was beyond words. The team arranged an Ayurvedic retreat in Kandy that changed my perspective on travel entirely.",
    name: "Aisha Al-Rashid",
    place: "Dubai, UAE",
    tour: "Private Wellness Retreat",
    delay: "delay-300",
  },
];

export function GuestTestimonialsSection() {
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

    document
      .querySelectorAll("#guest-stories .reveal")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="guest-stories"
      className="bg-brand-surface px-6 py-24 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
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
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className={`testimonial-card reveal flex flex-col rounded-2xl p-5 sm:p-7 ${t.delay}`}
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-gold">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="inline-block"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  </span>
                ))}
              </div>
              <blockquote className="mb-6 flex-1 text-sm italic leading-relaxed text-brand-muted">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="border-t border-brand-border pt-5">
                <p className="text-sm font-medium text-brand-text">{t.name}</p>
                <p className="mt-0.5 text-xs tracking-wide text-gold">
                  {t.place}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-brand-faint">
                  {t.tour}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

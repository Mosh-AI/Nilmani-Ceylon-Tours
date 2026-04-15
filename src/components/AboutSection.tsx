"use client";

import { useEffect } from "react";

export function AboutSection() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );

    document
      .querySelectorAll("#about .reveal, #about .reveal-left")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="bg-brand-bg px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="reveal-left">
            <div className="mb-6 flex items-center gap-3">
              <div className="gold-divider" />
              <span className="text-xs font-medium uppercase tracking-luxury text-gold">
                Why Choose Us
              </span>
            </div>
            <h2 className="mb-8 font-serif text-4xl leading-tight font-light text-brand-text md:text-5xl lg:text-6xl">
              The Nilmani
              <br />
              <span className="text-gold-gradient italic">Difference</span>
            </h2>
            <p className="mb-12 text-base leading-relaxed text-brand-muted lg:text-lg">
              We don&apos;t just plan trips — we craft memories that last a
              lifetime. Our commitment to excellence, local knowledge, and
              genuine care sets us apart from every other travel service in Sri
              Lanka.
            </p>
            <div className="mb-12 grid grid-cols-2 gap-6">
              {(
                [
                  { value: "500+", label: "Satisfied Guests" },
                  { value: "100%", label: "Custom Itineraries" },
                  { value: "4.9", label: "Average Rating" },
                  { value: "5+", label: "Years Experience" },
                ] as const
              ).map((s) => (
                <div key={s.label} className="border-l-2 border-gold/30 pl-5">
                  <p className="mb-1 font-serif text-3xl font-medium text-gold">
                    {s.value}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-brand-muted">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {[
                {
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.09 6.26L20 12l-5.91 3.74L12 22l-2.09-6.26L4 12l5.91-3.74L12 2z" /></svg>,
                  title: "Personalized Service",
                  text: "Every itinerary is crafted around your preferences, pace, and passions. No cookie-cutter tours — ever.",
                  d: "delay-100",
                },
                {
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l10 10-10 10L2 12 12 2z" /><path d="M12 6l6 6-6 6-6-6 6-6z" /></svg>,
                  title: "Expert Local Guides",
                  text: "Our guides are born storytellers with deep roots in Sri Lankan culture, history, and nature.",
                  d: "delay-200",
                },
                {
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l7 4v8l-7 4-7-4V6l7-4z" /><path d="M12 8v8" /><path d="M8.5 10h7" /></svg>,
                  title: "Unrivaled Comfort",
                  text: "From air-conditioned luxury vehicles to handpicked boutique accommodations — comfort is non-negotiable.",
                  d: "delay-300",
                },
                {
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5z" /><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5z" /></svg>,
                  title: "24/7 Concierge Support",
                  text: "We are always reachable. Whether a last-minute change or a spontaneous detour — we handle it all.",
                  d: "delay-400",
                },
              ].map((card) => (
              <div
                key={card.title}
                className={`reveal cursor-default rounded-2xl border border-brand-border bg-brand-surface p-4 sm:p-6 transition-all duration-500 hover:border-[rgba(201,168,76,0.35)] ${card.d}`}
              >
                <span className="mb-4 block text-gold">{card.icon}</span>
                <h3 className="mb-3 font-serif text-lg font-light text-brand-text">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-brand-muted">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

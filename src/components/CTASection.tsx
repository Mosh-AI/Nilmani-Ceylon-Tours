"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export function CTASection() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    document
      .querySelectorAll("#cta-journey .reveal")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="cta-journey"
      className="bg-brand-surface px-6 py-24 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative flex min-h-[380px] items-center overflow-hidden rounded-3xl md:min-h-[480px]">
          <Image
            src="/images/beach-cta.jpg"
            alt="Sri Lankan beach with palm trees, golden sand, waves, and a boat on the shore"
            fill
            className="object-cover bg-brand-surface"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/30" />
          <div className="noise-overlay" />

          <div className="relative z-10 max-w-2xl px-8 py-16 md:px-16">
            <div className="reveal mb-6 flex items-center gap-3">
              <div className="gold-divider" />
              <span className="text-xs font-medium uppercase tracking-luxury text-gold">
                Start Your Journey
              </span>
            </div>
            <h2 className="reveal mb-6 font-serif text-4xl leading-tight font-light text-white delay-100 md:text-5xl lg:text-6xl">
              Your Dream
              <br />
              <span className="text-gold-gradient italic">Sri Lanka</span>
              <br />
              Awaits
            </h2>
            <p className="reveal mb-10 max-w-md text-base leading-relaxed text-white/70 delay-200 md:text-lg">
              Let us design an unforgettable journey tailored entirely to you.
              Contact us today and we&apos;ll craft your perfect Sri Lankan
              adventure.
            </p>
            <div className="reveal flex flex-col gap-4 delay-300 sm:flex-row">
              <Link
                href="/booking"
                className="btn-gold inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold tracking-luxury"
              >
                <span>Book Your Tour</span>
              </Link>
              <a
                href="https://wa.me/94787829952?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20a%20tour."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold tracking-luxury"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Logo } from "./Logo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Booking", href: "/booking" },
  { label: "Contact", href: "/contact" },
] as const;

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    const raf = window.requestAnimationFrame(() => {
      handleScroll();
    });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.cancelAnimationFrame(raf);
    };
  }, [handleScroll]);

  useEffect(() => {
    document.documentElement.classList.add("js-ready");
    return () => {
      document.documentElement.classList.remove("js-ready");
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-brand-border bg-white/95 shadow-sm backdrop-blur-xl"
    >
      <div className="relative z-50 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex h-20 items-center justify-between">
          <Logo size="md" />

          <nav
            className="hidden items-center gap-10 md:flex"
            aria-label="Main navigation"
          >
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative text-sm font-medium tracking-wide transition-colors duration-300 focus-visible:text-gold ${
                  index === 0
                    ? "text-gold"
                    : "text-brand-muted hover:text-brand-text"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-300 ${
                    index === 0 ? "w-full" : "w-0 group-hover:w-full group-focus-within:w-full"
                  }`}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/booking"
              className="btn-gold hidden rounded-full px-6 py-2.5 text-xs font-semibold tracking-luxury md:inline-flex"
            >
              <span>Book Now</span>
            </Link>
            <button
              type="button"
              className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full focus-visible:ring-2 focus-visible:ring-gold focus:outline-none md:hidden"
              onClick={() => setIsMobileMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span
                className={`block h-px w-6 bg-brand-text transition-all duration-300 ${
                  isMobileMenuOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-6 bg-brand-text transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-px w-6 bg-brand-text transition-all duration-300 ${
                  isMobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`mobile-menu fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-white/98 backdrop-blur-xl transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        {navLinks.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-serif text-2xl text-brand-text transition-colors duration-300 hover:text-gold focus-visible:text-gold focus-visible:outline-none sm:text-3xl"
            style={{ transitionDelay: `${i * 60}ms` }}
            onClick={() => setIsMobileMenuOpen(false)}
            tabIndex={isMobileMenuOpen ? 0 : -1}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/booking"
          className="btn-gold mt-4 rounded-full px-10 py-3.5 text-sm font-semibold tracking-luxury"
          onClick={() => setIsMobileMenuOpen(false)}
          tabIndex={isMobileMenuOpen ? 0 : -1}
        >
          <span>Book Your Tour</span>
        </Link>
        <div className="mt-8 flex items-center gap-2">
          <div className="gold-divider" />
          <span className="text-xs uppercase tracking-luxury text-brand-faint">
            Est. 2024
          </span>
          <div className="gold-divider" />
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState, useEffect } from "react";

interface Section {
  readonly id: string;
  readonly num: string;
  readonly title: string;
}

interface Props {
  sections: readonly Section[];
}

export function PrivacyTOC({ sections }: Props) {
  const [activeId, setActiveId] = useState<string>(sections[0].id);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  // Wire up scroll reveal for .reveal / .reveal-left elements
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.08 }
    );

    document
      .querySelectorAll(".reveal, .reveal-left")
      .forEach((el) => revealObserver.observe(el));

    return () => revealObserver.disconnect();
  }, []);

  return (
    <div className="sticky top-28">
      <p className="mb-4 text-xs font-semibold uppercase tracking-luxury text-brand-faint">
        Contents
      </p>
      <nav aria-label="Privacy policy sections">
        <ol className="space-y-0.5">
          {sections.map(({ id, num, title }) => {
            const isActive = activeId === id;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById(id)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    setActiveId(id);
                  }}
                  className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-all duration-200 ${
                    isActive
                      ? "font-semibold text-gold"
                      : "text-brand-muted hover:bg-brand-surface hover:text-brand-text"
                  }`}
                  style={isActive ? { backgroundColor: "rgba(201,168,76,0.08)" } : undefined}
                >
                  <span
                    className={`shrink-0 font-serif text-base font-light tabular-nums ${
                      isActive ? "text-gold" : "text-brand-faint"
                    }`}
                  >
                    {num}
                  </span>
                  <span className="leading-snug">{title}</span>
                  {isActive && (
                    <span
                      className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                      aria-hidden="true"
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

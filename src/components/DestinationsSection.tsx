"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SRI_LANKA_DISTRICTS } from "./sri-lanka-map-data";

gsap.registerPlugin(ScrollTrigger);

/* ── Types ── */

interface Destination {
  name: string;
  subtitle: string;
  description: string;
  image: string;
  alt: string;
  mapX: number;
  mapY: number;
}

/* ── Data ── */

const destinations: Destination[] = [
  {
    name: "Sigiriya",
    subtitle: "Ancient Fortress",
    description:
      "Ancient rock fortress rising above the jungle — a UNESCO World Heritage masterpiece with frescoes of celestial maidens and water gardens at its base.",
    image: "/images/sigiriya.jpg",
    alt: "Sigiriya Lion Rock fortress rising above lush green gardens",
    mapX: 231,
    mapY: 403,
  },
  {
    name: "Kandy",
    subtitle: "Temple City",
    description:
      "Home to the sacred Temple of the Tooth Relic and the grand Esala Perahera festival — Sri Lanka's cultural and spiritual heartland in the misty hills.",
    image: "/images/slider-waterfall.jpg",
    alt: "Lush waterfall in the misty hills near Kandy Sri Lanka",
    mapX: 196,
    mapY: 514,
  },
  {
    name: "Nuwara Eliya",
    subtitle: "Tea Country",
    description:
      "Cool climate, rolling emerald estates, and the timeless craft of Ceylon tea amid misty mountains. A hill station that feels like colonial England reimagined in green.",
    image:
      "https://images.unsplash.com/photo-1701916106564-77bfb662cc7e?w=1200&q=85",
    alt: "Tea plantation workers in Nuwara Eliya Sri Lanka, green rolling hills",
    mapX: 212,
    mapY: 572,
  },
  {
    name: "Ella",
    subtitle: "Highland Escape",
    description:
      "Mist-wrapped hills, the iconic Nine Arch Bridge, and some of the island's most scenic train journeys cutting through terraced tea country.",
    image: "/images/ella.jpg",
    alt: "Blue train crossing the Nine Arch Bridge in Ella, Sri Lanka",
    mapX: 287,
    mapY: 587,
  },
  {
    name: "Yala",
    subtitle: "Wild Safari",
    description:
      "Sri Lanka's premier wildlife sanctuary — home to the world's highest density of wild leopards alongside elephants, sloth bears, and rare birds.",
    image: "/images/yala.jpg",
    alt: "Scenic lake in Yala National Park Sri Lanka",
    mapX: 344,
    mapY: 720,
  },
  {
    name: "Galle",
    subtitle: "Coastal Heritage",
    description:
      "Dutch colonial ramparts meeting the Indian Ocean. Cobblestone lanes wind past boutique hotels, art galleries, and a centuries-old lighthouse at the southern tip.",
    image: "/images/galle.jpg",
    alt: "Galle Fort lighthouse with palm trees on the southern coast of Sri Lanka",
    mapX: 120,
    mapY: 735,
  },
  {
    name: "Anuradhapura",
    subtitle: "Ancient Kingdom",
    description:
      "A UNESCO-listed ancient capital with towering white dagobas, sacred Bo trees over 2,300 years old, and vast stone temple complexes spanning millennia of civilization.",
    image: "/images/sigiriya-hero.jpg",
    alt: "Ancient rock fortress site in Sri Lanka surrounded by lush jungle",
    mapX: 165,
    mapY: 335,
  },
  {
    name: "Trincomalee",
    subtitle: "Coastal Paradise",
    description:
      "Crystal-clear bays with powder-white beaches, whale watching off Swami Rock, and some of the finest coral diving in the Indian Ocean.",
    image: "/images/slider-beach.jpg",
    alt: "Crystal clear turquoise ocean and golden sand beach in Sri Lanka",
    mapX: 306,
    mapY: 284,
  },
  {
    name: "Bentota",
    subtitle: "Beach Bliss",
    description:
      "Golden beaches lapped by the Indian Ocean, a tranquil river lagoon rich with wildlife, and lush boutique resorts on Sri Lanka's sun-soaked southwest coast.",
    image: "/images/beach-cta.jpg",
    alt: "Golden beach at sunset in Bentota Sri Lanka with calm ocean waters",
    mapX: 86,
    mapY: 677,
  },
];

/* Routes: index pairs connecting destinations */
const ROUTES: [number, number][] = [
  [6, 0],
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [7, 5],
  [5, 8],
];

/* ── Component ── */

export function DestinationsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);
  const pinRefs = useRef<(SVGGElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const selectDestination = useCallback(
    (index: number) => {
      if (index === activeIndex) return;

      /* Scale prev pin back */
      const prevPin = pinRefs.current[activeIndex];
      if (prevPin) {
        gsap.to(prevPin, { scale: 1, duration: 0.25, ease: "power2.out", transformOrigin: "center center" });
      }

      /* Elastic bounce on new pin */
      const nextPin = pinRefs.current[index];
      if (nextPin) {
        gsap.fromTo(
          nextPin,
          { scale: 1 },
          { scale: 1.2, duration: 0.5, ease: "elastic.out(1, 0.4)", transformOrigin: "center center" }
        );
      }

      /* Animate detail card out then in */
      if (detailRef.current) {
        gsap.fromTo(
          detailRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }
        );
      }

      setActiveIndex(index);
    },
    [activeIndex]
  );

  useEffect(() => {
    if (hasAnimated.current) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      hasAnimated.current = true;
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
        onComplete: () => { hasAnimated.current = true; },
      });

      /* 1. Section headers */
      tl.fromTo(
        ".dest-header-eyebrow",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }
      ).fromTo(
        ".dest-header-title",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.35"
      ).fromTo(
        ".dest-header-cta",
        { opacity: 0, x: 16 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" },
        "-=0.4"
      );

      /* 2. Districts (random stagger) */
      tl.fromTo(
        ".map-district",
        { opacity: 0 },
        { opacity: 1, duration: 0.6, stagger: { each: 0.012, from: "random" }, ease: "power2.out" },
        "-=0.2"
      );

      /* 3. Pin groups */
      tl.fromTo(
        ".map-pin-group",
        { opacity: 0, scale: 0.4 },
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: "back.out(1.7)", transformOrigin: "center center" },
        "-=0.3"
      );

      /* 4. Pin labels */
      tl.fromTo(
        ".map-pin-label",
        { opacity: 0 },
        { opacity: 1, duration: 0.4, stagger: 0.06, ease: "power2.out" },
        "-=0.2"
      );

      /* 5. Routes */
      tl.fromTo(
        ".map-route",
        { opacity: 0 },
        { opacity: 0.2, duration: 0.5, stagger: 0.05, ease: "power2.out" },
        "-=0.3"
      );

      /* 6. List items */
      tl.fromTo(
        ".dest-list-item",
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.45, stagger: 0.06, ease: "power3.out" },
        "-=0.4"
      );

      /* 7. Detail card */
      tl.fromTo(
        ".dest-detail-card",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
        "-=0.3"
      );

      /* Idle pulse on pins */
      pinRefs.current.forEach((pin, i) => {
        if (!pin) return;
        const ripple = pin.querySelector(".map-pin-ripple");
        if (!ripple) return;
        gsap.to(ripple, {
          scale: 2.2,
          opacity: 0,
          duration: 1.8,
          repeat: -1,
          delay: i * 0.35,
          ease: "power2.out",
          transformOrigin: "center center",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const active = destinations[activeIndex];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-28 bg-[#FAFAF9] overflow-hidden"
      aria-label="Destinations"
    >
      {/* Subtle background texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 35%, #C9A84C 0%, transparent 60%), radial-gradient(circle at 75% 70%, #C9A84C 0%, transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Zone 1: Section Header ── */}
        <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="dest-header-eyebrow flex items-center gap-3 mb-4">
              <div className="gold-divider h-px w-8" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A84C]">
                Your Tour, Your Way
              </span>
            </div>
            <h2 className="dest-header-title font-serif text-4xl font-light leading-tight text-[#1C1209] sm:text-5xl lg:text-6xl">
              Create Your
              <br />
              <em className="text-gold-gradient not-italic">Own Tour</em>
            </h2>
          </div>
          <div className="dest-header-cta shrink-0">
            <Link
              href="/tours/customize"
              className="btn-outline-gold inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm tracking-wide transition-all duration-300 hover:gap-3"
            >
              Customize Your Tour
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── Zone 2: Map + List ── */}
        <div className="grid items-start gap-8 lg:grid-cols-5">

          {/* LEFT — SVG Map */}
          <div className="lg:col-span-3">
            <div className="relative">
              {/* Subtle glow behind map */}
              <div
                className="pointer-events-none absolute inset-0 -z-10 opacity-30 blur-3xl"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 60%, #C9A84C22 0%, transparent 70%)",
                }}
              />
              <svg
                viewBox="0 0 450 793"
                className="w-full max-w-[420px] lg:max-w-full mx-auto h-auto drop-shadow-sm"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Interactive map of Sri Lanka showing destinations"
              >
                {/* District paths */}
                {SRI_LANKA_DISTRICTS.map((d, i) => (
                  <path
                    key={i}
                    d={d}
                    className="map-district"
                    fill="#F5F0E8"
                    stroke="#C9A84C"
                    strokeWidth="0.8"
                    strokeLinejoin="round"
                  />
                ))}

                {/* Route lines */}
                {ROUTES.map(([fromIdx, toIdx], ri) => {
                  const from = destinations[fromIdx];
                  const to = destinations[toIdx];
                  return (
                    <line
                      key={ri}
                      className="map-route"
                      x1={from.mapX}
                      y1={from.mapY}
                      x2={to.mapX}
                      y2={to.mapY}
                      stroke="#C9A84C"
                      strokeWidth="1.2"
                      strokeDasharray="4 5"
                      opacity="0.2"
                    />
                  );
                })}

                {/* Destination pins */}
                {destinations.map((dest, i) => {
                  const isActive = i === activeIndex;
                  return (
                    <g
                      key={i}
                      ref={(el) => { pinRefs.current[i] = el; }}
                      className="map-pin-group"
                      transform={`translate(${dest.mapX}, ${dest.mapY})`}
                      role="button"
                      tabIndex={0}
                      aria-label={`Select ${dest.name}`}
                      aria-pressed={isActive}
                      style={{ cursor: "pointer" }}
                      onClick={() => selectDestination(i)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          selectDestination(i);
                        }
                      }}
                    >
                      {/* Glow radial behind active pin */}
                      {isActive && (
                        <circle
                          r="18"
                          fill="url(#pin-glow)"
                          opacity="0.35"
                        />
                      )}

                      {/* Ripple circle */}
                      <circle
                        className="map-pin-ripple"
                        r={isActive ? 10 : 7}
                        fill="none"
                        stroke="#C9A84C"
                        strokeWidth="1.2"
                        opacity={isActive ? 0.5 : 0.3}
                      />

                      {/* Pin body */}
                      <circle
                        r={isActive ? 8 : 5.5}
                        fill={isActive ? "#C9A84C" : "#A8891A"}
                        stroke="#FAFAF9"
                        strokeWidth={isActive ? 1.5 : 1}
                        style={{ transition: "r 0.3s ease, fill 0.3s ease" }}
                      />

                      {/* White center dot */}
                      <circle r="2.5" fill="#FAFAF9" opacity={isActive ? 1 : 0.7} />

                      {/* Number label above */}
                      <text
                        className="map-pin-label"
                        y={-16}
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="600"
                        fill="#C9A84C"
                        fontFamily="Montserrat, sans-serif"
                        style={{ userSelect: "none" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </text>

                      {/* Name label below */}
                      <text
                        className="map-pin-label"
                        y={24}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight={isActive ? "600" : "400"}
                        fill={isActive ? "#C9A84C" : "#1C1209"}
                        fillOpacity={isActive ? 1 : 0.7}
                        fontFamily="Cormorant, serif"
                        style={{ userSelect: "none" }}
                      >
                        {dest.name}
                      </text>
                    </g>
                  );
                })}

                {/* Gradient defs */}
                <defs>
                  <radialGradient id="pin-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* RIGHT — Scrollable Destination List */}
          <div className="lg:col-span-2">
            <div
              ref={listRef}
              className="
                max-h-[520px] overflow-y-auto
                [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-[#C9A84C]/30
                [&::-webkit-scrollbar-thumb:hover]:bg-[#C9A84C]/60
                [&::-webkit-scrollbar-thumb]:rounded-full
                pr-1
              "
            >
              <div className="flex flex-col gap-1">
                {destinations.map((dest, i) => {
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={i}
                      className={`
                        dest-list-item group
                        relative w-full flex items-center gap-4
                        px-4 py-3.5 rounded-xl
                        border transition-all duration-300
                        text-left
                        hover:bg-white/70
                        ${
                          isActive
                            ? "border-[#C9A84C]/25 bg-white shadow-md"
                            : "border-transparent"
                        }
                      `}
                      onClick={() => selectDestination(i)}
                      aria-label={`View ${dest.name} — ${dest.subtitle}`}
                      aria-pressed={isActive}
                    >
                      {/* Left accent bar */}
                      <span
                        className={`
                          absolute left-0 top-3 bottom-3 w-0.5 rounded-full
                          bg-[#C9A84C] transition-all duration-300
                          ${isActive ? "opacity-100" : "opacity-0"}
                        `}
                      />

                      {/* Number */}
                      <span
                        className={`
                          font-serif text-2xl font-light w-8 shrink-0 leading-none
                          transition-colors duration-300
                          ${isActive ? "text-[#C9A84C]" : "text-[#1C1209]/20"}
                        `}
                      >
                        {i + 1}
                      </span>

                      {/* Thumbnail */}
                      <div
                        className={`
                          relative w-14 h-14 shrink-0 rounded-lg overflow-hidden
                          transition-transform duration-300
                          ${isActive ? "scale-105" : "scale-100"}
                        `}
                      >
                        <Image
                          src={dest.image}
                          alt={dest.alt}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                        {!isActive && (
                          <div className="absolute inset-0 bg-white/20" />
                        )}
                      </div>

                      {/* Text block */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1C1209] leading-snug truncate">
                          {dest.name}
                        </p>
                        <p className="text-[11px] text-[#1C1209]/50 uppercase tracking-wider mt-0.5">
                          {dest.subtitle}
                        </p>
                      </div>

                      {/* Arrow */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className={`
                          h-3.5 w-3.5 shrink-0 ml-auto
                          transition-opacity duration-200 text-[#C9A84C]
                          ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                        `}
                      >
                        <path
                          fillRule="evenodd"
                          d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.25a.75.75 0 010 1.06l-4.5 4.25a.75.75 0 11-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Zone 3: Detail Card ── */}
        <div ref={detailRef} className="dest-detail-card mt-8 overflow-hidden rounded-2xl border border-[#C9A84C]/15 bg-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-5">

            {/* Image panel */}
            <div className="relative min-h-[280px] lg:min-h-[360px] lg:col-span-3">
              <Image
                src={active.image}
                alt={active.alt}
                fill
                className="object-cover transition-all duration-700"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority={activeIndex === 0}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

              {/* Gold pill badge */}
              <div className="absolute top-5 left-5">
                <span className="rounded-full bg-black/35 backdrop-blur-md px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] text-[#C9A84C] font-medium">
                  {active.subtitle}
                </span>
              </div>

              {/* Location number */}
              <div className="absolute bottom-5 left-5 font-serif text-5xl font-light text-white/20 leading-none select-none">
                {String(activeIndex + 1).padStart(2, "0")}
              </div>
            </div>

            {/* Info panel */}
            <div className="lg:col-span-2 flex flex-col justify-center gap-0 p-8 lg:p-10">

              {/* Gold micro-divider */}
              <div className="h-px w-12 bg-gradient-to-r from-[#C9A84C] to-transparent mb-6" />

              {/* Subtitle */}
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C] mb-2">
                {active.subtitle}
              </p>

              {/* Destination name */}
              <h3 className="font-serif text-3xl lg:text-4xl font-light text-[#1C1209] leading-tight">
                {active.name}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-[#1C1209]/60 mt-4 mb-8">
                {active.description}
              </p>

              {/* Action buttons */}
              <div className="flex items-center gap-5">
                <Link
                  href="/contact"
                  className="group flex items-center gap-2 text-sm font-medium text-[#C9A84C] transition-all duration-200 hover:gap-3"
                >
                  Enquire Now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>

                <div className="w-px h-4 bg-[#C9A84C]/30" />

                <Link
                  href="/tours"
                  className="btn-outline-gold rounded-full px-5 py-2 text-xs tracking-wide transition-all duration-300"
                >
                  View All Tours
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

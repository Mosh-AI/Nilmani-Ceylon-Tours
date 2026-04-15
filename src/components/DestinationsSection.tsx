"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SRI_LANKA_DISTRICTS } from "./sri-lanka-map-data";

gsap.registerPlugin(ScrollTrigger);

/* ── Data ── */

interface Destination {
  name: string;
  subtitle: string;
  description: string;
  image: string;
  alt: string;
  mapX: number;
  mapY: number;
}

const destinations: Destination[] = [
  {
    name: "Sigiriya",
    subtitle: "Ancient Fortress",
    description:
      "Ancient rock fortress rising above the jungle — a UNESCO World Heritage masterpiece with frescoes of celestial maidens.",
    image: "/images/sigiriya.jpg",
    alt: "Sigiriya Lion Rock fortress rising above lush green gardens, ancient steps leading to the rock, Sri Lanka",
    mapX: 231,
    mapY: 403,
  },
  {
    name: "Nuwara Eliya",
    subtitle: "Tea Country",
    description:
      "Cool climate, rolling estates, and the timeless craft of Ceylon tea amid emerald slopes and misty mountains.",
    image:
      "https://images.unsplash.com/photo-1701916106564-77bfb662cc7e?w=1600&q=85",
    alt: "Tea plantation workers in Nuwara Eliya Sri Lanka, green rolling hills, misty mountain backdrop, morning light",
    mapX: 212,
    mapY: 572,
  },
  {
    name: "Ella",
    subtitle: "Highland Escape",
    description:
      "Mist-wrapped hills, the iconic Nine Arch Bridge, and some of the island's most scenic train journeys through tea country.",
    image: "/images/ella.jpg",
    alt: "Blue train crossing the Nine Arch Bridge in Ella, Sri Lanka, surrounded by lush green jungle hills",
    mapX: 287,
    mapY: 587,
  },
  {
    name: "Yala",
    subtitle: "Wild Safari",
    description:
      "Sri Lanka's premier wildlife sanctuary — the world's highest density of wild leopards, elephants, and sloth bears.",
    image: "/images/yala.jpg",
    alt: "Scenic lake in Yala National Park Sri Lanka, lush green trees reflected in calm water, dramatic cloudy sky",
    mapX: 344,
    mapY: 720,
  },
  {
    name: "Galle",
    subtitle: "Coastal Heritage",
    description:
      "Dutch colonial ramparts meeting the Indian Ocean. Cobblestone lanes wind past boutique hotels and a centuries-old lighthouse.",
    image: "/images/galle.jpg",
    alt: "Galle Fort lighthouse with palm trees on the southern coast of Sri Lanka, ocean waves crashing on rocks",
    mapX: 120,
    mapY: 735,
  },
];

const ROUTES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 1],
];

/* District paths imported from sri-lanka-map-data.ts — viewBox 0 0 450 793 */

export function DestinationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prevIndexRef = useRef(-1);
  const hasAnimated = useRef(false);

  const selectDestination = useCallback((idx: number) => {
    if (idx === prevIndexRef.current) return;
    const prev = prevIndexRef.current;
    prevIndexRef.current = idx;
    setActiveIndex(idx);

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    // Animate previous pin back
    if (prev >= 0) {
      const prevPin = document.getElementById(`map-pin-${prev}`);
      if (prevPin) {
        gsap.to(prevPin, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          svgOrigin: `${destinations[prev].mapX} ${destinations[prev].mapY}`,
        });
      }
    }

    // Animate new pin — elastic bounce
    const newPin = document.getElementById(`map-pin-${idx}`);
    if (newPin) {
      gsap.fromTo(
        newPin,
        { scale: 0.7 },
        {
          scale: 1.2,
          duration: 0.7,
          ease: "elastic.out(1.3, 0.55)",
          svgOrigin: `${destinations[idx].mapX} ${destinations[idx].mapY}`,
        }
      );
    }

    // Animate detail card
    const detail = document.querySelector(".dest-detail-card");
    if (detail) {
      gsap.fromTo(
        detail,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" }
      );
    }
  }, []);

  /* ── GSAP scroll-triggered entry ── */
  useEffect(() => {
    if (hasAnimated.current) return;
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      hasAnimated.current = true;
      return;
    }

    const ctx = gsap.context(() => {
      // Initial hidden states
      const headers = section.querySelectorAll<HTMLElement>(".dest-header");
      const districts = section.querySelectorAll<SVGPathElement>(".sri-lanka-district");
      const pinGroups = section.querySelectorAll<SVGGElement>(".map-pin-group");
      const pinLabels = section.querySelectorAll<SVGTextElement>(".map-pin-label");
      const routes = section.querySelectorAll<SVGLineElement>(".map-route");
      const listItems = section.querySelectorAll<HTMLElement>(".dest-list-item");
      const detailCard = section.querySelector<HTMLElement>(".dest-detail-card");

      gsap.set(headers, { opacity: 0, y: 30 });
      gsap.set(districts, { opacity: 0 });
      gsap.set(pinGroups, { opacity: 0 });
      gsap.set(pinLabels, { opacity: 0 });
      gsap.set(routes, { opacity: 0 });
      gsap.set(listItems, { opacity: 0, x: 30 });
      if (detailCard) gsap.set(detailCard, { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
        onComplete: () => {
          hasAnimated.current = true;
        },
      });

      // 1. Headers fade up
      tl.to(headers, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.15,
      });

      // 2. Districts appear with random stagger
      tl.to(
        districts,
        {
          opacity: 1,
          duration: 0.6,
          stagger: { amount: 0.8, from: "random" },
          ease: "power2.out",
        },
        "-=0.3"
      );

      // 3. Pins fade in with stagger
      tl.to(
        pinGroups,
        {
          opacity: 1,
          duration: 0.5,
          stagger: 0.12,
          ease: "power2.out",
        },
        "-=0.3"
      );

      // 4. Pin labels fade in
      tl.to(
        pinLabels,
        { opacity: 1, duration: 0.4, stagger: 0.08, ease: "power2.out" },
        "-=0.3"
      );

      // 5. Route lines fade in
      tl.to(
        routes,
        {
          opacity: 0.2,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.3"
      );

      // 6. List items slide in
      tl.to(
        listItems,
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" },
        "-=0.4"
      );

      // 7. Detail card
      if (detailCard) {
        tl.to(
          detailCard,
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.4"
        );
      }

      // 8. Auto-select first destination
      tl.add(() => selectDestination(0), "-=0.1");
    }, section);

    return () => ctx.revert();
  }, [selectDestination]);

  /* ── Idle pin pulse ── */
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const pulses = document.querySelectorAll(".map-pin-ripple-anim");
    const tweens: gsap.core.Tween[] = [];
    pulses.forEach((el, i) => {
      const tween = gsap.fromTo(
        el,
        { attr: { r: 8 }, opacity: 0.5 },
        {
          attr: { r: 24 },
          opacity: 0,
          duration: 2,
          ease: "power1.out",
          repeat: -1,
          delay: i * 0.4,
        }
      );
      tweens.push(tween);
    });
    return () => tweens.forEach((t) => t.kill());
  }, []);

  const current = destinations[activeIndex];

  return (
    <section
      id="destinations"
      ref={sectionRef}
      className="bg-brand-surface px-6 py-24 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="dest-header mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="gold-divider" />
              <span className="text-xs font-medium uppercase tracking-luxury text-gold">
                Featured Destinations
              </span>
            </div>
            <h2 className="font-serif text-4xl leading-tight font-light text-brand-text md:text-5xl lg:text-6xl">
              Explore the Isle of
              <br />
              <span className="text-gold-gradient italic">Sri Lanka</span>
            </h2>
          </div>
          <Link
            href="/booking"
            className="dest-header btn-outline-gold self-start rounded-full px-6 py-3 text-xs font-semibold tracking-luxury md:self-end"
          >
            Plan Your Journey
          </Link>
        </div>

        {/* Map + Details Grid */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-10">
          {/* LEFT: SVG Map */}
          <div className="relative flex items-start justify-center">
            <svg
              viewBox="0 0 450 793"
              className="mx-auto h-auto w-full max-w-xs sm:max-w-sm lg:max-w-[380px]"
              aria-label="Interactive map of Sri Lanka showing five featured destinations"
              role="img"
            >
              <defs>
                <filter id="map-shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow
                    dx="0"
                    dy="6"
                    stdDeviation="10"
                    floodColor="#A8891A"
                    floodOpacity="0.1"
                  />
                </filter>
                <linearGradient id="map-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C9A84C" />
                  <stop offset="100%" stopColor="#A8891A" />
                </linearGradient>
                <radialGradient id="pin-glow">
                  <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Sri Lanka district paths — real geographic data */}
              <g filter="url(#map-shadow)">
                {SRI_LANKA_DISTRICTS.map((d, i) => (
                  <path
                    key={i}
                    className="sri-lanka-district"
                    d={d}
                    fill="#F5F0E8"
                    stroke="#C9A84C"
                    strokeWidth="0.8"
                    strokeOpacity="0.6"
                  />
                ))}
              </g>

              {/* Route lines */}
              {ROUTES.map(([a, b], i) => (
                <line
                  key={`route-${i}`}
                  className="map-route"
                  x1={destinations[a].mapX}
                  y1={destinations[a].mapY}
                  x2={destinations[b].mapX}
                  y2={destinations[b].mapY}
                  stroke="#C9A84C"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                  opacity={0.2}
                />
              ))}

              {/* Destination Pins */}
              {destinations.map((dest, i) => (
                <g
                  key={dest.name}
                  id={`map-pin-${i}`}
                  className="map-pin-group cursor-pointer outline-none"
                  transform={`translate(${dest.mapX}, ${dest.mapY})`}
                  onClick={() => selectDestination(i)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${dest.name}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      selectDestination(i);
                    }
                  }}
                >
                  {/* Focus ring (visible on keyboard focus only) */}
                  <circle
                    r="18"
                    fill="none"
                    stroke="transparent"
                    strokeWidth="2.5"
                    className="transition-all duration-200"
                  />

                  {/* Glow */}
                  <circle
                    r="22"
                    fill="url(#pin-glow)"
                    opacity={i === activeIndex ? 0.7 : 0.3}
                    className="transition-opacity duration-300"
                  />

                  {/* Pulse ripple */}
                  <circle
                    className="map-pin-ripple-anim"
                    r="8"
                    fill="none"
                    stroke="#C9A84C"
                    strokeWidth="1"
                  />

                  {/* Pin body */}
                  <circle
                    r={i === activeIndex ? 8 : 6}
                    fill={i === activeIndex ? "#C9A84C" : "#A8891A"}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    className="transition-all duration-300"
                  />

                  {/* Center dot */}
                  <circle r="2.5" fill="#FFFFFF" opacity={0.9} />

                  {/* Name label */}
                  <text
                    className="map-pin-label"
                    y="24"
                    textAnchor="middle"
                    fill="#1C1917"
                    fontSize="11"
                    fontWeight="500"
                    letterSpacing="0.02em"
                  >
                    {dest.name}
                  </text>

                  {/* Number badge */}
                  <text
                    className="map-pin-label"
                    y="-16"
                    textAnchor="middle"
                    fill="#A8891A"
                    fontSize="9"
                    fontWeight="600"
                    letterSpacing="0.1em"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* RIGHT: List + Detail */}
          <div className="flex flex-col gap-5">
            {/* Destination list */}
            <div className="flex flex-col gap-1">
              {destinations.map((dest, i) => (
                <button
                  key={dest.name}
                  type="button"
                  onClick={() => selectDestination(i)}
                  className={`dest-list-item group relative flex cursor-pointer items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all duration-300 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
                    i === activeIndex
                      ? "border-gold/40 bg-white shadow-sm"
                      : "border-transparent bg-transparent hover:bg-white/60"
                  }`}
                >
                  {/* Left accent bar */}
                  <span
                    className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-gold transition-all duration-300 ${
                      i === activeIndex ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <span
                    className={`font-serif text-xl font-light transition-colors duration-300 ${
                      i === activeIndex ? "text-gold" : "text-brand-faint"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium transition-colors duration-300 ${
                        i === activeIndex
                          ? "text-brand-text"
                          : "text-brand-muted group-hover:text-brand-text"
                      }`}
                    >
                      {dest.name}
                    </p>
                    <p className="text-xs text-brand-faint">{dest.subtitle}</p>
                  </div>
                  <span
                    className={`text-xs transition-all duration-300 ${
                      i === activeIndex
                        ? "translate-x-0 text-gold opacity-100"
                        : "-translate-x-1 text-brand-faint opacity-0 group-hover:translate-x-0 group-hover:opacity-60 group-focus-visible:translate-x-0 group-focus-visible:opacity-60"
                    }`}
                  >
                    →
                  </span>
                </button>
              ))}
            </div>

            {/* Detail Card */}
            <div
              ref={detailRef}
              className="dest-detail-card overflow-hidden rounded-2xl border border-brand-border bg-white shadow-lg"
            >
              <div className="relative h-44 overflow-hidden sm:h-52 md:h-64">
                <Image
                  src={current.image}
                  alt={current.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <span className="mb-2 block text-xs font-medium uppercase tracking-luxury text-gold">
                  {current.subtitle}
                </span>
                <h3 className="mb-3 font-serif text-2xl font-light text-brand-text lg:text-3xl">
                  {current.name}
                </h3>
                <p className="mb-5 text-sm leading-relaxed text-brand-muted">
                  {current.description}
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
          </div>
        </div>
      </div>
    </section>
  );
}

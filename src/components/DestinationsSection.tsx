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
    image:
      "https://images.unsplash.com/photo-1583087253076-6f6e15484de0?w=1200&q=85",
    alt: "Temple of the Tooth Relic in Kandy Sri Lanka with golden rooftop",
    mapX: 196,
    mapY: 514,
  },
  {
    name: "Nuwara Eliya",
    subtitle: "Tea Country",
    description:
      "Cool climate, rolling emerald estates, and the timeless craft of Ceylon tea amid misty mountains. A hill station that feels like colonial England reimagined in green.",
    image:
      "https://images.unsplash.com/photo-1701916106564-77bfb662cc7e?w=1600&q=85",
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
    image:
      "https://images.unsplash.com/photo-1626099488972-f3f9e6a58ea5?w=1200&q=85",
    alt: "Ancient white stupa in Anuradhapura Sri Lanka surrounded by jungle",
    mapX: 165,
    mapY: 335,
  },
  {
    name: "Trincomalee",
    subtitle: "Coastal Paradise",
    description:
      "Crystal-clear bays with powder-white beaches, whale watching off Swami Rock, and some of the finest coral diving in the Indian Ocean.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=85",
    alt: "Crystal clear turquoise ocean waters and white sand beach in Trincomalee",
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

// Route lines: [6→0→1→2→3→4] and [7→5→8]
const ROUTES: [number, number][] = [
  [6, 0],
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [7, 5],
  [5, 8],
];

export function DestinationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
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

    // Scale previous pin back to 1
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

    // Elastic bounce new pin to scale 1.2
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

    // Animate detail panel
    const detail = document.querySelector(".dest-detail-card");
    if (detail) {
      gsap.fromTo(
        detail,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
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
      const headers = section.querySelectorAll<HTMLElement>(".dest-header");
      const districts =
        section.querySelectorAll<SVGPathElement>(".sri-lanka-district");
      const pinGroups =
        section.querySelectorAll<SVGGElement>(".map-pin-group");
      const pinLabels =
        section.querySelectorAll<SVGTextElement>(".map-pin-label");
      const routes =
        section.querySelectorAll<SVGLineElement>(".map-route");
      const thumbItems =
        section.querySelectorAll<HTMLElement>(".dest-thumb-item");
      const detailCard =
        section.querySelector<HTMLElement>(".dest-detail-card");

      gsap.set(headers, { opacity: 0, y: 30 });
      gsap.set(districts, { opacity: 0 });
      gsap.set(pinGroups, { opacity: 0 });
      gsap.set(pinLabels, { opacity: 0 });
      gsap.set(routes, { opacity: 0 });
      gsap.set(thumbItems, { opacity: 0, y: 20 });
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

      // 3. Pin groups fade in with stagger
      tl.to(
        pinGroups,
        {
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
        },
        "-=0.3"
      );

      // 4. Pin labels fade in
      tl.to(
        pinLabels,
        { opacity: 1, duration: 0.4, stagger: 0.06, ease: "power2.out" },
        "-=0.3"
      );

      // 5. Route lines fade in at 0.2 opacity
      tl.to(
        routes,
        {
          opacity: 0.2,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
        },
        "-=0.3"
      );

      // 6. Thumbnail cards slide up with stagger
      tl.to(
        thumbItems,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: "power2.out",
        },
        "-=0.4"
      );

      // 7. Detail panel fades in
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
          delay: i * 0.35,
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

        {/* Zone 1: Section Header */}
        <div className="dest-header mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="gold-divider" />
              <span className="text-xs font-medium uppercase tracking-luxury text-gold">
                Your Tour, Your Way
              </span>
            </div>
            <h2 className="font-serif text-4xl font-light leading-tight text-brand-text md:text-5xl lg:text-6xl">
              Create Your
              <br />
              <span className="text-gold-gradient italic">Own Tour</span>
            </h2>
          </div>
          <Link
            href="/tours/customize"
            className="dest-header btn-outline-gold self-start rounded-full px-6 py-3 text-xs font-semibold tracking-luxury md:self-end"
          >
            Customize Your Tour →
          </Link>
        </div>

        {/* Zone 2: Map + Thumbnail Grid */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5 lg:gap-8">

          {/* Left col (lg:col-span-3): SVG Map */}
          <div className="relative flex items-start justify-center lg:col-span-3">
            <svg
              viewBox="0 0 450 793"
              className="mx-auto h-auto w-full max-w-xs sm:max-w-sm lg:max-w-full"
              aria-label="Interactive map of Sri Lanka showing nine featured destinations"
              role="img"
            >
              <defs>
                <filter
                  id="map-shadow"
                  x="-10%"
                  y="-10%"
                  width="120%"
                  height="120%"
                >
                  <feDropShadow
                    dx="0"
                    dy="6"
                    stdDeviation="10"
                    floodColor="#A8891A"
                    floodOpacity="0.1"
                  />
                </filter>
                <linearGradient
                  id="map-gold-grad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#C9A84C" />
                  <stop offset="100%" stopColor="#A8891A" />
                </linearGradient>
                <radialGradient id="pin-glow">
                  <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Sri Lanka district paths */}
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

              {/* Destination pins */}
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
                  {/* Focus ring */}
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
                    r={i === activeIndex ? 8 : 5.5}
                    fill={i === activeIndex ? "#C9A84C" : "#A8891A"}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    className="transition-all duration-300"
                  />

                  {/* Center dot */}
                  <circle r="2.5" fill="#FFFFFF" opacity={0.9} />

                  {/* Name label below pin */}
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

                  {/* Number badge above pin */}
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

          {/* Right col (lg:col-span-2): 3×3 Thumbnail Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-3 gap-2">
              {destinations.map((dest, i) => (
                <button
                  key={dest.name}
                  type="button"
                  onClick={() => selectDestination(i)}
                  aria-label={`View ${dest.name}`}
                  className={`dest-thumb-item relative aspect-square cursor-pointer overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-1 ${
                    i === activeIndex
                      ? "ring-2 ring-[#C9A84C] ring-offset-1"
                      : ""
                  }`}
                >
                  {/* Thumbnail image */}
                  <div className="group relative h-full w-full overflow-hidden">
                    <Image
                      src={dest.image}
                      alt={dest.alt}
                      fill
                      className={`object-cover transition-transform duration-500 ${
                        i === activeIndex
                          ? "scale-105"
                          : "group-hover:scale-105"
                      }`}
                      sizes="(max-width: 1024px) 33vw, 15vw"
                    />

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 group-hover:from-black/60" />

                    {/* Number badge top-right */}
                    <div className="absolute right-1.5 top-1.5 rounded-full bg-black/40 px-1.5 py-0.5 text-[9px] font-bold leading-none text-[#C9A84C] backdrop-blur-sm">
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    {/* Name + subtitle bottom-left */}
                    <div className="absolute bottom-2 left-2">
                      <p className="text-[10px] font-semibold uppercase leading-none tracking-wider text-white">
                        {dest.name}
                      </p>
                      <p className="mt-0.5 text-[9px] uppercase tracking-widest text-white/60">
                        {dest.subtitle}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Zone 3: Detail Panel */}
        <div className="dest-detail-card mt-6 overflow-hidden rounded-2xl border border-brand-border bg-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-5">

            {/* Image side (lg:col-span-3) */}
            <div className="relative min-h-[260px] lg:col-span-3 lg:min-h-[320px]">
              <Image
                src={current.image}
                alt={current.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              {/* Bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              {/* Subtitle badge top-left */}
              <div className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-[#C9A84C] backdrop-blur-sm">
                {current.subtitle}
              </div>
            </div>

            {/* Text side (lg:col-span-2) */}
            <div className="flex flex-col justify-center p-7 lg:col-span-2 lg:p-8">
              {/* Gold micro-divider */}
              <div className="mb-5 h-px w-10 bg-gradient-to-r from-[#C9A84C] to-transparent" />

              <h3 className="font-serif text-3xl font-light text-brand-text lg:text-4xl">
                {current.name}
              </h3>

              <p className="mb-6 mt-3 text-sm leading-relaxed text-brand-muted">
                {current.description}
              </p>

              {/* Two buttons row */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-luxury text-gold transition-all duration-300 hover:gap-2.5"
                >
                  Enquire Now →
                </Link>
                <Link
                  href="/tours"
                  className="btn-outline-gold rounded-full px-5 py-2 text-xs font-semibold tracking-luxury"
                >
                  View Itinerary
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

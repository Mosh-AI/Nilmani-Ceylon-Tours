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
    name: "Sigiriya", subtitle: "Ancient Fortress",
    description: "Ancient rock fortress rising above the jungle — a UNESCO World Heritage masterpiece with frescoes of celestial maidens and water gardens at its base.",
    image: "/images/sigiriya.jpg", alt: "Sigiriya Lion Rock fortress rising above lush green gardens",
    mapX: 231, mapY: 403,
  },
  {
    name: "Kandy", subtitle: "Temple City",
    description: "Home to the sacred Temple of the Tooth Relic and the grand Esala Perahera festival — Sri Lanka's cultural and spiritual heartland in the misty hills.",
    image: "/uploads/d4c7b993-7ae3-45fe-97be-7ba530ad1b86.jpg", alt: "Temple of the Sacred Tooth Relic in Kandy, Sri Lanka",
    mapX: 196, mapY: 514,
  },
  {
    name: "Nuwara Eliya", subtitle: "Tea Country",
    description: "Cool climate, rolling emerald estates, and the timeless craft of Ceylon tea amid misty mountains. A hill station that feels like colonial England reimagined in green.",
    image: "https://images.unsplash.com/photo-1701916106564-77bfb662cc7e?w=1200&q=85", alt: "Tea plantation workers in Nuwara Eliya Sri Lanka, green rolling hills",
    mapX: 212, mapY: 572,
  },
  {
    name: "Ella", subtitle: "Highland Escape",
    description: "Mist-wrapped hills, the iconic Nine Arch Bridge, and some of the island's most scenic train journeys cutting through terraced tea country.",
    image: "/uploads/28f84dd1-2d06-4820-9637-b7ff7b67837b.jpg", alt: "Scenic highland landscape in Ella, Sri Lanka",
    mapX: 287, mapY: 587,
  },
  {
    name: "Yala", subtitle: "Wild Safari",
    description: "Sri Lanka's premier wildlife sanctuary — home to the world's highest density of wild leopards alongside elephants, sloth bears, and rare birds.",
    image: "/images/yala.jpg", alt: "Scenic lake in Yala National Park Sri Lanka",
    mapX: 344, mapY: 720,
  },
  {
    name: "Galle", subtitle: "Coastal Heritage",
    description: "Dutch colonial ramparts meeting the Indian Ocean. Cobblestone lanes wind past boutique hotels, art galleries, and a centuries-old lighthouse at the southern tip.",
    image: "/images/galle.jpg", alt: "Galle Fort lighthouse with palm trees on the southern coast of Sri Lanka",
    mapX: 120, mapY: 735,
  },
  {
    name: "Anuradhapura", subtitle: "Ancient Kingdom",
    description: "A UNESCO-listed ancient capital with towering white dagobas, sacred Bo trees over 2,300 years old, and vast stone temple complexes spanning millennia of civilization.",
    image: "/images/anuradhapura.jpg", alt: "Mihintale ancient stupa at dusk in Anuradhapura Sri Lanka",
    mapX: 165, mapY: 335,
  },
  {
    name: "Trincomalee", subtitle: "Coastal Paradise",
    description: "Crystal-clear bays with powder-white beaches, whale watching off Swami Rock, and some of the finest coral diving in the Indian Ocean.",
    image: "/images/slider-beach.jpg", alt: "Crystal clear turquoise ocean and golden sand beach in Sri Lanka",
    mapX: 306, mapY: 284,
  },
  {
    name: "Bentota", subtitle: "Beach Bliss",
    description: "Golden beaches lapped by the Indian Ocean, a tranquil river lagoon rich with wildlife, and lush boutique resorts on Sri Lanka's sun-soaked southwest coast.",
    image: "/images/beach-cta.jpg", alt: "Golden beach at sunset in Bentota Sri Lanka with calm ocean waters",
    mapX: 86, mapY: 677,
  },
];

const ROUTES: [number, number][] = [
  [6, 0], [0, 1], [1, 2], [2, 3], [3, 4], [7, 5], [5, 8],
];

/* ── Component ── */
export function DestinationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef    = useRef<HTMLDivElement>(null);
  const detailRef  = useRef<HTMLDivElement>(null);
  const pinRefs    = useRef<(SVGGElement | null)[]>([]);
  const hasAnimated     = useRef(false);
  const isTransitioning = useRef(false);

  // mode: 'list' = show numbered list | 'detail' = show selected destination
  const [mode, setMode]         = useState<"list" | "detail">("list");
  const [selected, setSelected] = useState<number>(0);
  // which pin is highlighted gold on the map (tracks last selected even in list mode)
  const [activePin, setActivePin] = useState<number>(-1);

  /* ── Animate detail panel in (called after React re-renders with new content) ── */
  const animateDetailIn = useCallback(() => {
    if (!detailRef.current) return;
    gsap.fromTo(
      detailRef.current,
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" }
    );
  }, []);

  /* ── Animate list in ── */
  const animateListIn = useCallback(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll<HTMLElement>(".dest-list-item");
    gsap.fromTo(
      items,
      { autoAlpha: 0, x: 16 },
      { autoAlpha: 1, x: 0, duration: 0.4, stagger: 0.05, ease: "power3.out" }
    );
  }, []);

  /* ── Select destination from map pin or list item ── */
  const selectDestination = useCallback(
    (i: number) => {
      if (isTransitioning.current) return;

      // Animate pin: scale old back, elastic bounce new
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Visual feedback is handled by React state (r size + fill + glow halo)
      // No GSAP scale on <g> elements — SVG translate + CSS transformOrigin don't mix

      setActivePin(i);

      if (mode === "list") {
        // List → Detail transition
        isTransitioning.current = true;
        const listEl = listRef.current;
        if (listEl && !prefersReduced) {
          gsap.to(listEl, {
            autoAlpha: 0, x: -20, duration: 0.28, ease: "power2.in",
            onComplete: () => {
              setSelected(i);
              setMode("detail");
              // animateDetailIn fires from useEffect below
              isTransitioning.current = false;
            },
          });
        } else {
          setSelected(i);
          setMode("detail");
          isTransitioning.current = false;
        }
      } else {
        // Already in detail view — just swap content with a quick fade
        if (i === selected) return;
        if (!prefersReduced && detailRef.current) {
          gsap.to(detailRef.current, {
            opacity: 0, y: 8, duration: 0.18, ease: "power2.in",
            onComplete: () => {
              setSelected(i);
              // animateDetailIn fires from useEffect
            },
          });
        } else {
          setSelected(i);
        }
      }
    },
    [mode, selected, activePin, animateDetailIn]
  );

  /* ── Back to list ── */
  const backToList = useCallback(() => {
    if (isTransitioning.current) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    isTransitioning.current = true;
    if (!prefersReduced && detailRef.current) {
      gsap.to(detailRef.current, {
        autoAlpha: 0, y: 16, duration: 0.28, ease: "power2.in",
        onComplete: () => {
          setMode("list");
          isTransitioning.current = false;
          // animateListIn fires from useEffect
        },
      });
    } else {
      setMode("list");
      isTransitioning.current = false;
    }
  }, []);

  /* ── Trigger enter animations after mode/selected changes ── */
  useEffect(() => {
    if (!hasAnimated.current) return; // skip during initial scroll-triggered anim
    if (mode === "detail") {
      animateDetailIn();
    } else {
      animateListIn();
    }
  }, [mode, selected, animateDetailIn, animateListIn]);

  /* ── GSAP scroll-triggered entry ── */
  useEffect(() => {
    if (hasAnimated.current) return;
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) { hasAnimated.current = true; return; }

    // Hide detail initially via GSAP autoAlpha so it's invisible on mount
    if (detailRef.current) gsap.set(detailRef.current, { autoAlpha: 0 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 78%", once: true },
        onComplete: () => { hasAnimated.current = true; },
      });

      tl.fromTo(".dest-header-eyebrow", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" })
        .fromTo(".dest-header-title",   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6,  ease: "power3.out" }, "-=0.35")
        .fromTo(".dest-header-cta",     { opacity: 0, x: 14 }, { opacity: 1, x: 0, duration: 0.5,  ease: "power3.out" }, "-=0.4")
        .fromTo(".map-district", { opacity: 0 }, { opacity: 1, duration: 0.55, stagger: { each: 0.01, from: "random" }, ease: "power2.out" }, "-=0.2")
        .fromTo(".map-pin-group", { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.07, ease: "power2.out" }, "-=0.3")
        .fromTo(".map-pin-label", { opacity: 0 }, { opacity: 1, duration: 0.35, stagger: 0.05, ease: "power2.out" }, "-=0.2")
        .fromTo(".map-route",     { opacity: 0 }, { opacity: 0.2, duration: 0.4, stagger: 0.04, ease: "power2.out" }, "-=0.2")
        .fromTo(".dest-list-item", { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.45, stagger: 0.055, ease: "power3.out" }, "-=0.35");

      // Idle pin pulse
      pinRefs.current.forEach((pin, i) => {
        if (!pin) return;
        const ripple = pin.querySelector(".map-pin-ripple");
        if (!ripple) return;
        gsap.to(ripple, {
          scale: 2.4, opacity: 0, duration: 1.9,
          repeat: -1, delay: i * 0.35, ease: "power2.out",
          transformOrigin: "center center",
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const dest = destinations[selected];

  return (
    <section
      ref={sectionRef}
      id="destinations"
      className="relative bg-[#FAFAF9] py-20 lg:py-28 overflow-hidden"
      aria-label="Destinations"
    >
      {/* Subtle gold ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(ellipse at 30% 50%, #C9A84C 0%, transparent 65%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">

        {/* ── Header ── */}
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="dest-header-eyebrow mb-4 flex items-center gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-[#C9A84C] to-transparent" />
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── Map + Right Panel ── */}
        <div className="grid items-start gap-8 lg:grid-cols-5">

          {/* LEFT — SVG Map */}
          <div className="lg:col-span-3">
            <div className="relative">
              <div
                className="pointer-events-none absolute inset-0 -z-10 blur-3xl opacity-20"
                style={{ background: "radial-gradient(ellipse at 50% 55%, #C9A84C33 0%, transparent 65%)" }}
              />
              <svg
                viewBox="0 0 450 793"
                className="mx-auto h-auto w-full max-w-[400px] drop-shadow-sm lg:max-w-full"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Interactive map of Sri Lanka"
              >
                <defs>
                  <radialGradient id="dest-pin-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
                  </radialGradient>
                  <filter id="dest-map-shadow" x="-8%" y="-8%" width="116%" height="116%">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#C9A84C" floodOpacity="0.08" />
                  </filter>
                </defs>

                {/* District paths */}
                <g filter="url(#dest-map-shadow)">
                  {SRI_LANKA_DISTRICTS.map((d, i) => (
                    <path key={i} d={d} className="map-district"
                      fill="#F5F0E8" stroke="#C9A84C" strokeWidth="0.75" strokeLinejoin="round" strokeOpacity="0.7" />
                  ))}
                </g>

                {/* Route lines */}
                {ROUTES.map(([a, b], ri) => (
                  <line key={ri} className="map-route"
                    x1={destinations[a].mapX} y1={destinations[a].mapY}
                    x2={destinations[b].mapX} y2={destinations[b].mapY}
                    stroke="#C9A84C" strokeWidth="1.1" strokeDasharray="4 5" opacity="0.2" />
                ))}

                {/* Pins */}
                {destinations.map((d, i) => {
                  const isActive = i === activePin;
                  return (
                    <g
                      key={i}
                      ref={(el) => { pinRefs.current[i] = el; }}
                      className="map-pin-group"
                      transform={`translate(${d.mapX}, ${d.mapY})`}
                      role="button" tabIndex={0}
                      aria-label={`View ${d.name}`} aria-pressed={isActive}
                      style={{ cursor: "pointer" }}
                      onClick={() => selectDestination(i)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectDestination(i); } }}
                    >
                      {/* Glow halo for active */}
                      <circle r="20" fill="url(#dest-pin-glow)" opacity={isActive ? 0.6 : 0} className="transition-opacity duration-500" />

                      {/* Pulse ripple */}
                      <circle className="map-pin-ripple" r={isActive ? 9 : 7}
                        fill="none" stroke="#C9A84C" strokeWidth="1.2" opacity={isActive ? 0.5 : 0.25} />

                      {/* Pin body */}
                      <circle
                        r={isActive ? 8 : 5.5}
                        fill={isActive ? "#C9A84C" : "#A8891A"}
                        stroke="#FAFAF9" strokeWidth={isActive ? 2 : 1.2}
                        style={{ transition: "r 0.35s ease, fill 0.35s ease" }}
                      />
                      {/* Center dot */}
                      <circle r="2.5" fill="#FAFAF9" opacity={isActive ? 1 : 0.8} />

                      {/* Number above */}
                      <text className="map-pin-label" y={-17} textAnchor="middle"
                        fontSize="8.5" fontWeight="700" fill="#C9A84C" fontFamily="Montserrat, sans-serif"
                        style={{ userSelect: "none" }}>
                        {String(i + 1).padStart(2, "0")}
                      </text>

                      {/* Name below */}
                      <text className="map-pin-label" y={25} textAnchor="middle"
                        fontSize="10.5" fontWeight={isActive ? "600" : "400"}
                        fill={isActive ? "#C9A84C" : "#1C1209"} fillOpacity={isActive ? 1 : 0.65}
                        fontFamily="Cormorant, serif"
                        style={{ userSelect: "none" }}>
                        {d.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* RIGHT — Toggle Panel (list ↔ detail) */}
          <div className="lg:col-span-2">

            {/* LIST VIEW */}
            <div ref={listRef} style={{ display: mode === "detail" ? "none" : "block" }}>
              <div
                className="
                  max-h-[580px] overflow-y-auto pr-1
                  [&::-webkit-scrollbar]:w-[3px]
                  [&::-webkit-scrollbar-track]:bg-transparent
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  [&::-webkit-scrollbar-thumb]:bg-[#C9A84C]/25
                  [&::-webkit-scrollbar-thumb:hover]:bg-[#C9A84C]/55
                "
              >
                <div className="flex flex-col gap-1">
                  {destinations.map((d, i) => {
                    const isActive = i === activePin;
                    return (
                      <button
                        key={i}
                        type="button"
                        className={`dest-list-item group relative flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition-all duration-300 hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/50 ${
                          isActive
                            ? "border-[#C9A84C]/30 bg-white shadow-md"
                            : "border-transparent hover:border-[#C9A84C]/10"
                        }`}
                        onClick={() => selectDestination(i)}
                        aria-label={`Explore ${d.name} — ${d.subtitle}`}
                      >
                        {/* Active bar */}
                        <span className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-[#C9A84C] transition-all duration-300 ${isActive ? "opacity-100" : "opacity-0"}`} />

                        {/* Number */}
                        <span className={`w-7 shrink-0 font-serif text-xl font-light leading-none transition-colors duration-300 ${isActive ? "text-[#C9A84C]" : "text-[#1C1209]/20"}`}>
                          {i + 1}
                        </span>

                        {/* Thumbnail */}
                        <div className={`relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-lg transition-all duration-300 ${isActive ? "scale-[1.06] shadow-md" : ""}`}>
                          <Image src={d.image} alt={d.alt} fill className="object-cover" sizes="52px" />
                          {!isActive && <div className="absolute inset-0 bg-black/15" />}
                        </div>

                        {/* Text */}
                        <div className="min-w-0 flex-1">
                          <p className={`truncate text-sm font-semibold leading-snug transition-colors duration-300 ${isActive ? "text-[#1C1209]" : "text-[#1C1209]/70 group-hover:text-[#1C1209]"}`}>
                            {d.name}
                          </p>
                          <p className="mt-0.5 text-[10.5px] uppercase tracking-widest text-[#1C1209]/40">
                            {d.subtitle}
                          </p>
                        </div>

                        {/* Arrow */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                          className={`h-3.5 w-3.5 shrink-0 text-[#C9A84C] transition-all duration-200 ${isActive ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-70"}`}>
                          <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.25a.75.75 0 010 1.06l-4.5 4.25a.75.75 0 11-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
                        </svg>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hint text below list */}
              <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-[#1C1209]/30">
                Select a pin on the map or tap a location
              </p>
            </div>

            {/* DETAIL VIEW */}
            <div
              ref={detailRef}
              style={{ display: mode === "list" ? "none" : "block" }}
              className="overflow-hidden rounded-2xl border border-[#C9A84C]/15 bg-white shadow-xl"
            >
              {/* Back button */}
              <div className="flex items-center justify-between border-b border-[#C9A84C]/10 px-5 py-3">
                <button
                  type="button"
                  onClick={backToList}
                  className="group flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1C1209]/50 transition-all duration-200 hover:text-[#C9A84C] focus-visible:outline-none"
                  aria-label="Back to all destinations"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5">
                    <path fillRule="evenodd" d="M14 8a.75.75 0 01-.75.75H4.56l3.22 3.22a.75.75 0 11-1.06 1.06l-4.5-4.25a.75.75 0 010-1.06l4.5-4.25a.75.75 0 011.06 1.06L4.56 7.25h8.69A.75.75 0 0114 8z" clipRule="evenodd" />
                  </svg>
                  All Destinations
                </button>

                {/* Location counter */}
                <span className="font-serif text-xs text-[#C9A84C]/60">
                  {String(selected + 1).padStart(2, "0")} / {String(destinations.length).padStart(2, "0")}
                </span>
              </div>

              {/* Location image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={dest.image}
                  alt={dest.alt}
                  fill
                  className="object-cover transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                {/* Subtitle badge */}
                <div className="absolute left-4 top-4">
                  <span className="rounded-full bg-black/30 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C] backdrop-blur-md">
                    {dest.subtitle}
                  </span>
                </div>

                {/* Large faint number watermark */}
                <div className="absolute bottom-3 right-4 select-none font-serif text-6xl font-light leading-none text-white/15">
                  {String(selected + 1).padStart(2, "0")}
                </div>

                {/* Name overlaid at image bottom */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
                  <div className="mb-2 h-px w-10 bg-gradient-to-r from-[#C9A84C] to-transparent" />
                  <h3 className="font-serif text-3xl font-light leading-tight text-white">
                    {dest.name}
                  </h3>
                </div>
              </div>

              {/* Info panel */}
              <div className="p-5 lg:p-6">
                <p className="text-sm leading-relaxed text-[#1C1209]/60">
                  {dest.description}
                </p>

                {/* CTAs */}
                <div className="mt-5 flex items-center gap-4">
                  <Link
                    href="/booking"
                    className="group flex items-center gap-1.5 text-sm font-semibold text-[#C9A84C] transition-all duration-200 hover:gap-2.5"
                  >
                    Enquire Now
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                  </Link>

                  <div className="h-4 w-px bg-[#C9A84C]/25" />

                  <Link href="/tours" className="btn-outline-gold rounded-full px-5 py-1.5 text-xs tracking-wide transition-all duration-300">
                    View All Tours
                  </Link>
                </div>

                {/* Prev / Next navigation */}
                <div className="mt-5 flex items-center justify-between border-t border-[#C9A84C]/10 pt-4">
                  <button
                    type="button"
                    onClick={() => selectDestination((selected - 1 + destinations.length) % destinations.length)}
                    className="group flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-[#1C1209]/40 transition-all duration-200 hover:text-[#C9A84C] focus-visible:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 transition-transform group-hover:-translate-x-0.5">
                      <path fillRule="evenodd" d="M14 8a.75.75 0 01-.75.75H4.56l3.22 3.22a.75.75 0 11-1.06 1.06l-4.5-4.25a.75.75 0 010-1.06l4.5-4.25a.75.75 0 011.06 1.06L4.56 7.25h8.69A.75.75 0 0114 8z" clipRule="evenodd" />
                    </svg>
                    Prev
                  </button>

                  {/* Dot indicators */}
                  <div className="flex items-center gap-1.5">
                    {destinations.map((_, i) => (
                      <button
                        key={i} type="button"
                        onClick={() => selectDestination(i)}
                        aria-label={`Go to ${destinations[i].name}`}
                        className={`rounded-full transition-all duration-300 focus-visible:outline-none ${
                          i === selected
                            ? "h-1.5 w-4 bg-[#C9A84C]"
                            : "h-1.5 w-1.5 bg-[#C9A84C]/25 hover:bg-[#C9A84C]/50"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => selectDestination((selected + 1) % destinations.length)}
                    className="group flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-[#1C1209]/40 transition-all duration-200 hover:text-[#C9A84C] focus-visible:outline-none"
                  >
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 transition-transform group-hover:translate-x-0.5">
                      <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.25a.75.75 0 010 1.06l-4.5 4.25a.75.75 0 11-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

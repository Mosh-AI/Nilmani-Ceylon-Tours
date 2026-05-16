"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SRI_LANKA_DISTRICTS } from "@/components/sri-lanka-map-data";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   Geographic → SVG coordinate conversion
   SVG viewBox: 0 0 450 793
   Island path data sits roughly inside:
     X: 44–395  (inner width  ≈ 351)
     Y: 72–702  (inner height ≈ 630)
   Sri Lanka bounds:
     Lat  5.92°N – 9.84°N
     Lng 79.65°E – 81.88°E
───────────────────────────────────────────── */
function geoToSvg(lat: number, lng: number) {
  const minLng = 79.65, maxLng = 81.88;
  const minLat = 5.92,  maxLat = 9.84;
  const innerLeft = 44, innerWidth = 351;
  const innerTop  = 72, innerHeight = 630;
  return {
    x: innerLeft + ((lng - minLng) / (maxLng - minLng)) * innerWidth,
    y: innerTop  + ((maxLat - lat) / (maxLat - minLat)) * innerHeight,
  };
}

/* ── Destinations with real GPS coords ── */
const DESTINATIONS = [
  {
    name: "Sigiriya",      subtitle: "Ancient Fortress",
    lat: 7.9572,  lng: 80.7600,
    image: "/images/sigiriya.jpg",
    description: "Ancient rock fortress rising 200 m above the jungle — a UNESCO World Heritage masterpiece with frescoes of celestial maidens and geometric water gardens at its base.",
  },
  {
    name: "Kandy",         subtitle: "Temple City",
    lat: 7.2906,  lng: 80.6337,
    image: "/images/slider-waterfall.jpg",
    description: "Home to the sacred Temple of the Tooth Relic and the grand Esala Perahera festival — Sri Lanka's cultural and spiritual heartland amid the misty central hills.",
  },
  {
    name: "Nuwara Eliya",  subtitle: "Tea Country",
    lat: 6.9497,  lng: 80.7891,
    image: "https://images.unsplash.com/photo-1701916106564-77bfb662cc7e?w=1200&q=85",
    description: "Cool climate, rolling emerald estates, and the timeless craft of Ceylon tea. A hill station that feels like colonial England reimagined in glorious green.",
  },
  {
    name: "Ella",          subtitle: "Highland Escape",
    lat: 6.8667,  lng: 81.0464,
    image: "/images/ella.jpg",
    description: "Mist-wrapped hills, the iconic Nine Arch Bridge, and some of the island's most scenic train journeys cutting through terraced tea country.",
  },
  {
    name: "Yala",          subtitle: "Wild Safari",
    lat: 6.3729,  lng: 81.5208,
    image: "/images/yala.jpg",
    description: "Sri Lanka's premier wildlife sanctuary — home to the world's highest density of wild leopards, alongside elephants, sloth bears, and rare birds.",
  },
  {
    name: "Galle",         subtitle: "Coastal Heritage",
    lat: 6.0535,  lng: 80.2170,
    image: "/images/galle.jpg",
    description: "Dutch colonial ramparts meeting the Indian Ocean. Cobblestone lanes wind past boutique hotels, art galleries, and a centuries-old lighthouse at the southern tip.",
  },
  {
    name: "Anuradhapura",  subtitle: "Ancient Kingdom",
    lat: 8.3114,  lng: 80.4037,
    image: "/images/anuradhapura.jpg",
    description: "A UNESCO-listed ancient capital with towering white dagobas, sacred Bo trees over 2,300 years old, and vast stone temple complexes spanning millennia.",
  },
  {
    name: "Trincomalee",   subtitle: "Coastal Paradise",
    lat: 8.5874,  lng: 81.2152,
    image: "/images/slider-beach.jpg",
    description: "Crystal-clear bays with powder-white beaches, whale watching off Swami Rock, and some of the finest coral diving in the Indian Ocean.",
  },
  {
    name: "Bentota",       subtitle: "Beach Bliss",
    lat: 6.4212,  lng: 80.0020,
    image: "/images/beach-cta.jpg",
    description: "Golden beaches lapped by the Indian Ocean, a tranquil river lagoon rich with wildlife, and lush boutique resorts on Sri Lanka's sun-soaked southwest coast.",
  },
] as const;

type Dest = (typeof DESTINATIONS)[number];

/* Pre-compute SVG positions */
const PINS = DESTINATIONS.map((d) => ({ ...d, ...geoToSvg(d.lat, d.lng) }));

/* ── Component ── */
export function CustomizeMapExplorer() {
  const sectionRef  = useRef<HTMLElement>(null);
  const listRef     = useRef<HTMLDivElement>(null);
  const detailRef   = useRef<HTMLDivElement>(null);
  const pinRefs     = useRef<(SVGGElement | null)[]>([]);
  const hasAnimated     = useRef(false);
  const isTransitioning = useRef(false);

  const [mode, setMode]         = useState<"list" | "detail">("list");
  const [selected, setSelected] = useState(0);
  const [activePin, setActivePin] = useState(-1);

  /* Animate detail panel in */
  const animateDetailIn = useCallback(() => {
    if (!detailRef.current) return;
    gsap.fromTo(detailRef.current,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" },
    );
  }, []);

  /* Animate list in */
  const animateListIn = useCallback(() => {
    if (!listRef.current) return;
    gsap.fromTo(
      listRef.current.querySelectorAll<HTMLElement>(".cme-list-item"),
      { autoAlpha: 0, x: 18 },
      { autoAlpha: 1, x: 0, duration: 0.4, stagger: 0.05, ease: "power3.out" },
    );
  }, []);

  /* Select destination */
  const select = useCallback((i: number) => {
    if (isTransitioning.current) return;
    const reduced = typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setActivePin(i);

    if (mode === "list") {
      isTransitioning.current = true;
      if (listRef.current && !reduced) {
        gsap.to(listRef.current, {
          autoAlpha: 0, x: -22, duration: 0.28, ease: "power2.in",
          onComplete: () => {
            setSelected(i); setMode("detail");
            isTransitioning.current = false;
          },
        });
      } else {
        setSelected(i); setMode("detail");
        isTransitioning.current = false;
      }
    } else {
      if (i === selected) return;
      if (!reduced && detailRef.current) {
        gsap.to(detailRef.current, {
          opacity: 0, y: 10, duration: 0.18, ease: "power2.in",
          onComplete: () => setSelected(i),
        });
      } else { setSelected(i); }
    }
  }, [mode, selected]);

  /* Back to list */
  const backToList = useCallback(() => {
    if (isTransitioning.current) return;
    const reduced = typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    isTransitioning.current = true;
    if (!reduced && detailRef.current) {
      gsap.to(detailRef.current, {
        autoAlpha: 0, y: 18, duration: 0.28, ease: "power2.in",
        onComplete: () => {
          setMode("list"); isTransitioning.current = false;
        },
      });
    } else { setMode("list"); isTransitioning.current = false; }
  }, []);

  /* Fire enter animations when mode/selected changes */
  useEffect(() => {
    if (!hasAnimated.current) return;
    if (mode === "detail") animateDetailIn();
    else animateListIn();
  }, [mode, selected, animateDetailIn, animateListIn]);

  /* Scroll-triggered entry + idle pin pulse */
  useEffect(() => {
    if (hasAnimated.current) return;
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { hasAnimated.current = true; return; }

    if (detailRef.current) gsap.set(detailRef.current, { autoAlpha: 0 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 80%", once: true },
        onComplete: () => { hasAnimated.current = true; },
      });
      tl.fromTo(".cme-eyebrow",     { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" })
        .fromTo(".cme-title",       { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.35")
        .fromTo(".cme-district",    { opacity: 0 },        { opacity: 1, duration: 0.6, stagger: { each: 0.008, from: "random" }, ease: "power2.out" }, "-=0.3")
        .fromTo(".cme-pin",         { opacity: 0 },        { opacity: 1, duration: 0.5, stagger: 0.07, ease: "power2.out" }, "-=0.2")
        .fromTo(".cme-list-item",   { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.45, stagger: 0.055, ease: "power3.out" }, "-=0.4");

      /* Idle ripple pulse on each pin */
      pinRefs.current.forEach((pin, i) => {
        const ripple = pin?.querySelector(".cme-ripple");
        if (!ripple) return;
        gsap.to(ripple, {
          scale: 2.6, opacity: 0, duration: 2,
          repeat: -1, delay: i * 0.4, ease: "power2.out",
          transformOrigin: "center center",
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const dest: Dest = DESTINATIONS[selected];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0C0804]"
      aria-label="Explore Sri Lanka destinations"
    >
      {/* ── Background: subtle lat/lng grid ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,168,76,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
      {/* Gold radial glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{ backgroundImage: "radial-gradient(ellipse 60% 70% at 35% 55%, #C9A84C22 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-24">

        {/* ── Section header ── */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="cme-eyebrow mb-4 flex items-center gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-[#C9A84C] to-transparent" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A84C]">
                Explore the Island
              </span>
            </div>
            <h2 className="cme-title font-serif text-3xl font-light leading-tight text-white sm:text-4xl lg:text-5xl">
              Where Do You{" "}
              <span
                className="italic"
                style={{
                  background: "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Want to Go?
              </span>
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/45">
              Nine iconic destinations across Sri Lanka. Tap a location to discover what awaits — then scroll down to build your itinerary.
            </p>
          </div>

          {/* Coordinate badge — decorative */}
          <div className="shrink-0 hidden sm:flex flex-col items-end gap-1 font-mono text-[10px] text-[#C9A84C]/30 leading-tight select-none">
            <span>7.87°N · 80.77°E</span>
            <span>Sri Lanka · Indian Ocean</span>
          </div>
        </div>

        {/* ── Map + Panel grid ── */}
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">

          {/* ───── LEFT: SVG Map ───── */}
          <div className="relative">
            {/* Ocean glow behind map */}
            <div
              className="pointer-events-none absolute inset-0 -z-10 rounded-3xl blur-3xl opacity-30"
              style={{ background: "radial-gradient(ellipse at 50% 55%, #C9A84C18 0%, transparent 65%)" }}
            />

            <svg
              viewBox="0 0 450 793"
              className="mx-auto h-auto w-full max-w-[360px] drop-shadow-2xl lg:max-w-full"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Interactive map of Sri Lanka with destination pins"
            >
              <defs>
                <radialGradient id="cme-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#C9A84C" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
                </radialGradient>
                <filter id="cme-shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#C9A84C" floodOpacity="0.12" />
                </filter>
                <filter id="cme-glow-filter">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Ocean background */}
              <rect width="450" height="793" fill="#0C0804" />

              {/* District fills — warm dark */}
              <g filter="url(#cme-shadow)">
                {SRI_LANKA_DISTRICTS.map((d, i) => (
                  <path
                    key={i} d={d}
                    className="cme-district"
                    fill="#1A1008"
                    stroke="#C9A84C"
                    strokeWidth="0.6"
                    strokeLinejoin="round"
                    strokeOpacity="0.35"
                  />
                ))}
              </g>

              {/* Subtle route connector lines */}
              {[
                [6, 0], [0, 1], [1, 2], [2, 3], [3, 4], [7, 5], [5, 8],
              ].map(([a, b], ri) => (
                <line key={ri}
                  x1={PINS[a].x} y1={PINS[a].y}
                  x2={PINS[b].x} y2={PINS[b].y}
                  stroke="#C9A84C" strokeWidth="0.8"
                  strokeDasharray="3 6" opacity="0.12"
                />
              ))}

              {/* Pins */}
              {PINS.map((pin, i) => {
                const isActive = i === activePin;
                return (
                  <g
                    key={i}
                    ref={(el) => { pinRefs.current[i] = el; }}
                    className="cme-pin"
                    transform={`translate(${pin.x}, ${pin.y})`}
                    role="button" tabIndex={0}
                    aria-label={`Select ${pin.name}`}
                    aria-pressed={isActive}
                    style={{ cursor: "pointer" }}
                    onClick={() => select(i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(i); }
                    }}
                  >
                    {/* Active outer glow */}
                    <circle r="24" fill="url(#cme-glow)"
                      opacity={isActive ? 0.65 : 0}
                      className="transition-opacity duration-500" />

                    {/* Ripple ring (animated by GSAP) */}
                    <circle
                      className="cme-ripple"
                      r={isActive ? 10 : 8}
                      fill="none"
                      stroke="#C9A84C"
                      strokeWidth="1"
                      opacity={isActive ? 0.6 : 0.2}
                    />

                    {/* Pin body */}
                    <circle
                      r={isActive ? 7.5 : 5}
                      fill={isActive ? "#C9A84C" : "#2A1E08"}
                      stroke="#C9A84C"
                      strokeWidth={isActive ? 0 : 1.2}
                      strokeOpacity="0.8"
                      style={{ transition: "r 0.35s ease, fill 0.35s ease" }}
                    />

                    {/* Inner dot */}
                    <circle r="2" fill={isActive ? "#1C1209" : "#C9A84C"} opacity={isActive ? 1 : 0.7} />

                    {/* Number badge (above pin) */}
                    <text
                      y={-15} textAnchor="middle"
                      fontSize="7.5" fontWeight="700"
                      fill="#C9A84C" fillOpacity={isActive ? 1 : 0.6}
                      fontFamily="Montserrat, sans-serif"
                      style={{ userSelect: "none" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </text>

                    {/* Location name (below pin) */}
                    <text
                      y={22} textAnchor="middle"
                      fontSize="9.5" fontWeight={isActive ? "600" : "400"}
                      fill={isActive ? "#E8C96A" : "#C9A84C"}
                      fillOpacity={isActive ? 1 : 0.55}
                      fontFamily="Cormorant, serif"
                      style={{ userSelect: "none" }}
                    >
                      {pin.name}
                    </text>
                  </g>
                );
              })}

              {/* Compass rose — bottom right corner */}
              <g transform="translate(415, 745)" opacity="0.25">
                <circle r="12" fill="none" stroke="#C9A84C" strokeWidth="0.6" />
                <line x1="0" y1="-10" x2="0" y2="10" stroke="#C9A84C" strokeWidth="0.5" />
                <line x1="-10" y1="0" x2="10" y2="0" stroke="#C9A84C" strokeWidth="0.5" />
                <text y="-13" textAnchor="middle" fontSize="5" fill="#C9A84C" fontFamily="Montserrat, sans-serif" fontWeight="700">N</text>
              </g>
            </svg>
          </div>

          {/* ───── RIGHT: Toggle Panel ───── */}
          <div className="lg:sticky lg:top-24 lg:self-start">

            {/* LIST MODE */}
            <div ref={listRef} style={{ display: mode === "detail" ? "none" : "block" }}>
              <div
                className="
                  flex flex-col gap-1
                  max-h-[70vh] overflow-y-auto pr-1
                  [&::-webkit-scrollbar]:w-[3px]
                  [&::-webkit-scrollbar-track]:bg-transparent
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  [&::-webkit-scrollbar-thumb]:bg-[#C9A84C]/25
                  [&::-webkit-scrollbar-thumb:hover]:bg-[#C9A84C]/55
                "
              >
                {PINS.map((pin, i) => {
                  const isActive = i === activePin;
                  return (
                    <button
                      key={i}
                      type="button"
                      className={`cme-list-item group relative flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/50 ${
                        isActive
                          ? "border-[#C9A84C]/30 bg-white/8 shadow-lg shadow-black/40"
                          : "border-transparent hover:border-[#C9A84C]/15 hover:bg-white/5"
                      }`}
                      onClick={() => select(i)}
                      aria-label={`Explore ${pin.name}`}
                    >
                      {/* Active left bar */}
                      <span
                        className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-[#C9A84C] transition-all duration-300 ${isActive ? "opacity-100" : "opacity-0"}`}
                      />

                      {/* Number */}
                      <span className={`w-7 shrink-0 font-serif text-xl font-light leading-none transition-colors duration-300 ${isActive ? "text-[#C9A84C]" : "text-white/15"}`}>
                        {i + 1}
                      </span>

                      {/* Thumbnail */}
                      <div className={`relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-lg transition-all duration-300 ${isActive ? "ring-1 ring-[#C9A84C]/50" : ""}`}>
                        <Image src={pin.image} alt={pin.name} fill className="object-cover" sizes="52px" />
                        {!isActive && <div className="absolute inset-0 bg-black/40" />}
                      </div>

                      {/* Text */}
                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-sm font-semibold leading-snug transition-colors duration-300 ${isActive ? "text-white" : "text-white/55 group-hover:text-white/80"}`}>
                          {pin.name}
                        </p>
                        <p className="mt-0.5 text-[10px] uppercase tracking-widest text-[#C9A84C]/50">
                          {pin.subtitle}
                        </p>
                      </div>

                      {/* Arrow */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                        className={`h-3.5 w-3.5 shrink-0 text-[#C9A84C] transition-all duration-200 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`}>
                        <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.25a.75.75 0 010 1.06l-4.5 4.25a.75.75 0 11-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </button>
                  );
                })}
              </div>

              <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-white/20">
                Click a pin on the map or select a location
              </p>
            </div>

            {/* DETAIL MODE */}
            <div
              ref={detailRef}
              style={{ display: mode === "list" ? "none" : "block" }}
              className="overflow-hidden rounded-2xl border border-[#C9A84C]/20 bg-[#140E05] shadow-2xl shadow-black/60"
            >
              {/* Header bar */}
              <div className="flex items-center justify-between border-b border-[#C9A84C]/12 px-5 py-3.5">
                <button
                  type="button"
                  onClick={backToList}
                  className="group flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35 transition-all duration-200 hover:text-[#C9A84C] focus-visible:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5">
                    <path fillRule="evenodd" d="M14 8a.75.75 0 01-.75.75H4.56l3.22 3.22a.75.75 0 11-1.06 1.06l-4.5-4.25a.75.75 0 010-1.06l4.5-4.25a.75.75 0 011.06 1.06L4.56 7.25h8.69A.75.75 0 0114 8z" clipRule="evenodd" />
                  </svg>
                  All Destinations
                </button>
                <span className="font-mono text-xs text-[#C9A84C]/40">
                  {String(selected + 1).padStart(2, "0")} / {String(PINS.length).padStart(2, "0")}
                </span>
              </div>

              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 420px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140E05] via-black/20 to-transparent" />

                {/* Subtitle tag */}
                <div className="absolute left-4 top-4">
                  <span className="rounded-full border border-[#C9A84C]/40 bg-black/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C] backdrop-blur-md">
                    {dest.subtitle}
                  </span>
                </div>

                {/* Watermark number */}
                <div className="absolute bottom-3 right-4 select-none font-serif text-7xl font-light leading-none text-white/8">
                  {String(selected + 1).padStart(2, "0")}
                </div>

                {/* Name overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
                  <div className="mb-2.5 h-px w-10 bg-gradient-to-r from-[#C9A84C] to-transparent" />
                  <h3 className="font-serif text-3xl font-light leading-tight text-white">
                    {dest.name}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 lg:p-6">
                {/* Geo coords */}
                <p className="mb-3 font-mono text-[10px] text-[#C9A84C]/40 tracking-wide">
                  {PINS[selected].lat.toFixed(4)}°N · {PINS[selected].lng.toFixed(4)}°E
                </p>

                <p className="text-sm leading-relaxed text-white/55">
                  {dest.description}
                </p>

                {/* CTAs */}
                <div className="mt-5 flex items-center gap-4">
                  <Link
                    href="/booking"
                    className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#C9A84C] transition-all duration-200 hover:gap-2.5"
                  >
                    Enquire Now
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                  </Link>
                  <div className="h-4 w-px bg-[#C9A84C]/20" />
                  <Link
                    href="/tours"
                    className="rounded-full border border-[#C9A84C]/30 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#C9A84C] transition-all duration-300 hover:border-[#C9A84C] hover:bg-[#C9A84C]/10"
                  >
                    View Tours
                  </Link>
                </div>

                {/* Prev / Next */}
                <div className="mt-5 flex items-center justify-between border-t border-[#C9A84C]/10 pt-4">
                  <button
                    type="button"
                    onClick={() => select((selected - 1 + PINS.length) % PINS.length)}
                    className="group flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-white/30 transition-all duration-200 hover:text-[#C9A84C] focus-visible:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 transition-transform group-hover:-translate-x-0.5">
                      <path fillRule="evenodd" d="M14 8a.75.75 0 01-.75.75H4.56l3.22 3.22a.75.75 0 11-1.06 1.06l-4.5-4.25a.75.75 0 010-1.06l4.5-4.25a.75.75 0 011.06 1.06L4.56 7.25h8.69A.75.75 0 0114 8z" clipRule="evenodd" />
                    </svg>
                    Prev
                  </button>

                  {/* Dot indicators */}
                  <div className="flex items-center gap-1.5">
                    {PINS.map((_, i) => (
                      <button
                        key={i} type="button"
                        onClick={() => select(i)}
                        aria-label={`Go to ${PINS[i].name}`}
                        className={`rounded-full transition-all duration-300 focus-visible:outline-none ${
                          i === selected
                            ? "h-1.5 w-4 bg-[#C9A84C]"
                            : "h-1.5 w-1.5 bg-[#C9A84C]/20 hover:bg-[#C9A84C]/50"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => select((selected + 1) % PINS.length)}
                    className="group flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-white/30 transition-all duration-200 hover:text-[#C9A84C] focus-visible:outline-none"
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

        {/* ── Scroll-down indicator ── */}
        <div className="mt-12 flex flex-col items-center gap-2">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/20">
            Scroll to build your itinerary
          </p>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none"
            className="h-4 w-4 animate-bounce text-[#C9A84C]/25">
            <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

      </div>
    </section>
  );
}

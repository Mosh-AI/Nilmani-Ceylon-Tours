"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { X, MapPin, Loader2 } from "lucide-react";
import { SRI_LANKA_LOCATIONS, LOCATION_BY_SLUG } from "@/data/sri-lanka-locations";
import type { RouteData } from "./CustomizeTourMap";

/*
 * Dynamic overlay alignment:
 * The SVG uses the calibrated affine transform:
 *   svgX = 175.383·lng − 13943.8
 *   svgY = −183.888·lat + 1861.187
 *
 * On every `bounds_changed` event we read the Google Maps viewport bounds,
 * convert them to SVG space with the same affine, and update the SVG viewBox.
 * This keeps the district overlay and pins pixel-locked to the real map as
 * the user zooms or pans — no re-render of the map itself needed.
 */

/** Convert a lat/lng pair to SVG coordinate space */
function toSvg(lat: number, lng: number) {
  return {
    x:  175.383 * lng - 13943.8,
    y: -183.888 * lat + 1861.187,
  };
}

// Minimal dark map style — terrain only, no labels cluttering the overlay
const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "all",             stylers: [{ visibility: "simplified" }] },
  { elementType: "geometry",        stylers: [{ color: "#0f0a05" }] },
  { elementType: "labels",          stylers: [{ visibility: "off" }] },
  { featureType: "water",           elementType: "geometry", stylers: [{ color: "#0d1b2e" }] },
  { featureType: "landscape",       elementType: "geometry", stylers: [{ color: "#1a1208" }] },
  { featureType: "landscape.natural.terrain", elementType: "geometry", stylers: [{ color: "#1f1409" }] },
  { featureType: "road",            stylers: [{ visibility: "off" }] },
  { featureType: "poi",             stylers: [{ visibility: "off" }] },
  { featureType: "transit",         stylers: [{ visibility: "off" }] },
  { featureType: "administrative",  elementType: "geometry.stroke", stylers: [{ color: "#C9A84C" }, { opacity: 0.15 }] },
];

type PinState = "selected" | "normal" | "faded";

// Real GPS coords for every slug that may appear in routes
const GEO_COORDS: Record<string, { lat: number; lng: number }> = {
  "jaffna":          { lat: 9.6615,  lng: 80.0070 },
  "mannar":          { lat: 8.9774,  lng: 79.9046 },
  "anuradhapura":    { lat: 8.3114,  lng: 80.4037 },
  "trincomalee":     { lat: 8.5874,  lng: 81.2152 },
  "polonnaruwa":     { lat: 7.9403,  lng: 81.0003 },
  "sigiriya":        { lat: 7.9572,  lng: 80.7603 },
  "dambulla":        { lat: 7.8731,  lng: 80.6511 },
  "kurunegala":      { lat: 7.4863,  lng: 80.3631 },
  "batticaloa":      { lat: 7.7170,  lng: 81.7000 },
  "arugam-bay":      { lat: 6.8406,  lng: 81.8356 },
  "ampara":          { lat: 7.2984,  lng: 81.6724 },
  "matale":          { lat: 7.4675,  lng: 80.6234 },
  "kandy":           { lat: 7.2906,  lng: 80.6337 },
  "nuwara-eliya":    { lat: 6.9497,  lng: 80.7891 },
  "badulla":         { lat: 6.9934,  lng: 81.0550 },
  "haputale":        { lat: 6.7668,  lng: 80.9535 },
  "ella":            { lat: 6.8686,  lng: 81.0466 },
  "ratnapura":       { lat: 6.6806,  lng: 80.4022 },
  "negombo":         { lat: 7.2096,  lng: 79.8386 },
  "colombo-airport": { lat: 7.1803,  lng: 79.8840 },
  "colombo":         { lat: 6.9271,  lng: 79.8612 },
  "kegalle":         { lat: 7.2513,  lng: 80.3464 },
  "yala":            { lat: 6.3728,  lng: 81.5201 },
  "tissamaharama":   { lat: 6.2931,  lng: 81.2923 },
  "hambantota":      { lat: 6.1241,  lng: 81.1185 },
  "tangalle":        { lat: 6.0241,  lng: 80.7997 },
  "matara":          { lat: 5.9549,  lng: 80.5550 },
  "mirissa":         { lat: 5.9477,  lng: 80.4538 },
  "weligama":        { lat: 5.9739,  lng: 80.4283 },
  "galle":           { lat: 6.0535,  lng: 80.2210 },
  "unawatuna":       { lat: 6.0099,  lng: 80.2490 },
  "hikkaduwa":       { lat: 6.1395,  lng: 80.0998 },
  "bentota":         { lat: 6.4212,  lng: 80.0020 },
};

interface GoogleMapsCustomizeProps {
  routes: RouteData[];
}

export function GoogleMapsCustomize({ routes }: GoogleMapsCustomizeProps) {
  const mapRef         = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const pinRefs        = useRef<(SVGGElement | null)[]>([]);
  const hasAnimated    = useRef(false);

  const [mapLoaded, setMapLoaded]     = useState(false);
  const [loadError, setLoadError]     = useState(false);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  // SVG viewBox tracks the Google Maps viewport in real time
  const [svgViewBox, setSvgViewBox] = useState("0 0 450 793");

  // Only slugs that appear in at least one route
  const allRouteSlugs = useMemo(() => {
    const set = new Set<string>();
    for (const r of routes) for (const s of r.locationSlugs) set.add(s);
    return set;
  }, [routes]);

  // Filter logic
  const { validRoutes, activeSlugs } = useMemo(() => {
    if (selectedSlugs.length === 0) {
      return { validRoutes: routes, activeSlugs: new Set(allRouteSlugs) };
    }
    const valid = routes.filter((r) =>
      selectedSlugs.every((s) => r.locationSlugs.includes(s))
    );
    const active = new Set<string>(selectedSlugs);
    for (const r of valid) for (const s of r.locationSlugs) active.add(s);
    return { validRoutes: valid, activeSlugs: active };
  }, [selectedSlugs, routes, allRouteSlugs]);

  const toggleLocation = useCallback((slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  // SVG pin data — only locations that exist in at least one route
  const svgPins = useMemo(
    () => SRI_LANKA_LOCATIONS.filter((loc) => allRouteSlugs.has(loc.slug)),
    [allRouteSlugs]
  );

  // Init Google Maps — scroll-zoomable, SVG overlay tracks bounds in real time
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !mapRef.current) return;

    import("@googlemaps/js-api-loader")
      .then(({ setOptions, importLibrary }) => {
        setOptions({ key: apiKey, v: "weekly" });
        return importLibrary("maps");
      })
      .then(() => {
        if (!mapRef.current) return;
        const map = new google.maps.Map(mapRef.current, {
          center:           { lat: 7.87, lng: 80.77 },
          zoom:             7.8,
          minZoom:          6,
          maxZoom:          14,
          mapTypeId:        "terrain",
          styles:           MAP_STYLES,
          disableDefaultUI: true,
          zoomControl:      true,
          zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
          gestureHandling:  "greedy",   // scroll wheel always zooms, no ctrl needed
          draggable:        true,
          clickableIcons:   false,
          keyboardShortcuts: false,
        });
        mapInstanceRef.current = map;

        // Keep SVG pin overlay in sync with every viewport change.
        // We listen to zoom_changed + center_changed (not just bounds_changed)
        // so the viewBox updates on every animation frame during smooth zoom,
        // eliminating the "two-layers at different scales" visual glitch.
        const syncViewBox = () => {
          const bounds = map.getBounds();
          if (!bounds) return;
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          const tl = toSvg(ne.lat(), sw.lng());
          const br = toSvg(sw.lat(), ne.lng());
          setSvgViewBox(`${tl.x} ${tl.y} ${br.x - tl.x} ${br.y - tl.y}`);
        };

        map.addListener("bounds_changed",  syncViewBox);
        map.addListener("zoom_changed",    syncViewBox);
        map.addListener("center_changed",  syncViewBox);
        map.addListener("tilesloaded", () => { syncViewBox(); setMapLoaded(true); });
      })
      .catch(() => setLoadError(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Idle ripple pulse on SVG pins
  useEffect(() => {
    if (!mapLoaded || hasAnimated.current) return;
    hasAnimated.current = true;

    import("gsap").then(({ gsap }) => {
      pinRefs.current.forEach((pin, i) => {
        const ripple = pin?.querySelector(".gmc-ripple");
        if (!ripple) return;
        gsap.to(ripple, {
          scale: 2.4, opacity: 0, duration: 1.9,
          repeat: -1, delay: i * 0.3, ease: "power2.out",
          transformOrigin: "center center",
        });
      });
    });
  }, [mapLoaded]);

  const hasNoRoutes = routes.length === 0;

  return (
    <div className="grid grid-cols-1 gap-0 lg:grid-cols-5">

      {/* ── Map: 3 cols — Google Maps base + SVG overlay ── */}
      <div className="lg:col-span-3">
        {hasNoRoutes ? (
          <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-[#C9A84C]/20 bg-[#0C0804]">
            <div className="text-center">
              <MapPin className="mx-auto mb-3 h-10 w-10 text-[#C9A84C]/30" />
              <p className="text-sm text-white/40">No routes have been configured yet.</p>
            </div>
          </div>
        ) : (
          /* Outer frame — dark border, rounded */
          <div className="relative overflow-hidden rounded-2xl border border-[#C9A84C]/15 shadow-2xl shadow-black/60" style={{ height: 600 }}>

            {/* ── Layer 1: Google Maps (base) ── */}
            <div ref={mapRef} className="absolute inset-0" />

            {/* Loading / error states */}
            {!mapLoaded && !loadError && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0C0804]">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-[#C9A84C]" />
                  <p className="text-xs uppercase tracking-[0.18em] text-[#C9A84C]/50">Loading map…</p>
                </div>
              </div>
            )}
            {loadError && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0C0804]">
                <p className="text-sm text-white/30">Map unavailable</p>
              </div>
            )}

            {/* ── Layer 2: SVG island overlay — viewBox tracks map viewport ── */}
            <svg
              viewBox={svgViewBox}
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="gmc-pin-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#C9A84C" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
                </radialGradient>
                <filter id="gmc-glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Route connector lines */}
              {svgPins.length > 1 && validRoutes.slice(0, 1).flatMap((route) =>
                route.locationSlugs.slice(0, -1).map((slug, si) => {
                  const a = SRI_LANKA_LOCATIONS.find((l) => l.slug === slug);
                  const b = SRI_LANKA_LOCATIONS.find((l) => l.slug === route.locationSlugs[si + 1]);
                  if (!a || !b) return null;
                  return (
                    <line key={`${slug}-${si}`}
                      x1={a.mapX} y1={a.mapY} x2={b.mapX} y2={b.mapY}
                      stroke="#C9A84C" strokeWidth="1" strokeDasharray="4 6" strokeOpacity="0.18"
                    />
                  );
                })
              )}

              {/* ── Pins — pointer-events-auto so they're clickable ── */}
              {svgPins.map((loc, i) => {
                const state: PinState = selectedSlugs.includes(loc.slug)
                  ? "selected"
                  : activeSlugs.has(loc.slug)
                  ? "normal"
                  : "faded";
                const isSelected = state === "selected";
                const isFaded    = state === "faded";

                return (
                  <g
                    key={loc.slug}
                    ref={(el) => { pinRefs.current[i] = el; }}
                    transform={`translate(${loc.mapX}, ${loc.mapY})`}
                    style={{ cursor: isFaded ? "default" : "pointer", pointerEvents: isFaded ? "none" : "auto" }}
                    role="button"
                    tabIndex={isFaded ? -1 : 0}
                    aria-label={`${isSelected ? "Deselect" : "Select"} ${loc.name}`}
                    aria-pressed={isSelected}
                    onClick={() => !isFaded && toggleLocation(loc.slug)}
                    onKeyDown={(e) => {
                      if (!isFaded && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault(); toggleLocation(loc.slug);
                      }
                    }}
                  >
                    {/* Selected: outer ambient glow */}
                    {isSelected && (
                      <circle r="26" fill="url(#gmc-pin-glow)" opacity="0.55" />
                    )}

                    {/* Idle ripple ring (GSAP animated) */}
                    <circle
                      className="gmc-ripple"
                      r={isSelected ? 11 : 8}
                      fill="none"
                      stroke="#C9A84C"
                      strokeWidth="1"
                      opacity={isFaded ? 0 : isSelected ? 0.55 : 0.2}
                    />

                    {/* Dark backdrop — makes pin legible over any terrain */}
                    <circle
                      r={isSelected ? 10 : isFaded ? 5 : 7}
                      fill={isSelected ? "#C9A84C" : "#0C0804"}
                      fillOpacity={isFaded ? 0.4 : 0.9}
                      stroke="#C9A84C"
                      strokeWidth={isSelected ? 0 : isFaded ? 0.6 : 1.8}
                      strokeOpacity={isFaded ? 0.25 : 1}
                      style={{ transition: "r 0.3s ease, fill 0.3s ease" }}
                    />

                    {/* Center dot */}
                    <circle
                      r="3"
                      fill={isSelected ? "#0C0804" : "#C9A84C"}
                      opacity={isFaded ? 0.25 : 1}
                    />

                    {/* Label pill background for readability */}
                    {!isFaded && (
                      <rect
                        x={-((loc.name.length * 4.2) / 2)}
                        y={17}
                        width={loc.name.length * 4.2}
                        height={13}
                        rx="3"
                        fill="#0C0804"
                        fillOpacity="0.72"
                      />
                    )}

                    {/* Name label */}
                    <text
                      y={27}
                      textAnchor="middle"
                      fontSize={isSelected ? "10.5" : "9.5"}
                      fontWeight={isSelected ? "600" : "400"}
                      fill={isSelected ? "#E8C96A" : "#C9A84C"}
                      fillOpacity={isFaded ? 0 : isSelected ? 1 : 0.85}
                      fontFamily="Cormorant, serif"
                      style={{ userSelect: "none" }}
                    >
                      {loc.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* ── Layer 3: UI chrome ── */}

            {/* Top-left eyebrow label */}
            <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-2.5 z-20">
              <div className="h-px w-5 bg-[#C9A84C]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">
                Sri Lanka
              </span>
            </div>

            {/* Bottom-right: compass */}
            <div className="pointer-events-none absolute bottom-4 right-4 z-20 opacity-40">
              <svg viewBox="0 0 32 32" width="28" height="28">
                <circle cx="16" cy="16" r="14" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
                <line x1="16" y1="4"  x2="16" y2="28" stroke="#C9A84C" strokeWidth="0.7" />
                <line x1="4"  y1="16" x2="28" y2="16" stroke="#C9A84C" strokeWidth="0.7" />
                <text x="16" y="10" textAnchor="middle" fontSize="6" fill="#C9A84C" fontFamily="Montserrat,sans-serif" fontWeight="700">N</text>
              </svg>
            </div>

            {/* Hint */}
            <div className="pointer-events-none absolute bottom-4 left-5 z-20">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                Tap a pin to filter routes
              </p>
            </div>

            {/* Selected count badge */}
            {selectedSlugs.length > 0 && (
              <div className="absolute left-5 bottom-10 z-20">
                <span className="rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#C9A84C] backdrop-blur-sm">
                  {selectedSlugs.length} selected
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Side panel: 2 cols ── */}
      <div className="flex flex-col gap-6 rounded-r-2xl border border-l-0 border-[#C9A84C]/12 bg-[#0F0A05] p-6 lg:col-span-2 lg:p-8">

        {/* Header */}
        <div>
          <div className="mb-1 flex items-center gap-2.5">
            <div className="h-px w-5 bg-[#C9A84C]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">
              Your Selections
            </span>
          </div>

          {selectedSlugs.length === 0 ? (
            <p className="mt-3 text-sm leading-relaxed text-white/35">
              Tap any pin on the map to begin. Incompatible stops will dim automatically.
            </p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedSlugs.map((slug) => (
                <button
                  key={slug}
                  onClick={() => toggleLocation(slug)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A84C]/35 bg-[#C9A84C]/10 px-3 py-1.5 text-xs font-medium text-[#C9A84C] transition-all duration-200 hover:bg-[#C9A84C]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/40"
                >
                  {LOCATION_BY_SLUG[slug]?.name ?? slug}
                  <X className="h-3 w-3" />
                </button>
              ))}
              <button
                onClick={() => setSelectedSlugs([])}
                className="text-[11px] text-white/25 underline underline-offset-2 hover:text-white/50 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-[#C9A84C]/10" />

        {/* Compatible routes */}
        <div className="flex-1">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="h-px w-5 bg-[#C9A84C]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">
              Compatible Routes
            </span>
            {!hasNoRoutes && (
              <span className="ml-auto rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#C9A84C]">
                {validRoutes.length}
              </span>
            )}
          </div>

          {hasNoRoutes ? (
            <p className="text-sm text-white/30">Routes will appear here once configured.</p>
          ) : validRoutes.length === 0 ? (
            <div className="rounded-xl border border-white/8 bg-white/5 p-5 text-center">
              <p className="text-sm font-medium text-white/60">No routes match</p>
              <p className="mt-1 text-xs text-white/30">Try removing a selected stop.</p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {validRoutes.map((route) => (
                <li
                  key={route.id}
                  className="group rounded-xl border border-[#C9A84C]/12 bg-white/[0.04] p-4 transition-all duration-200 hover:border-[#C9A84C]/25 hover:bg-white/[0.07]"
                >
                  <p className="font-serif text-base font-light text-white">
                    {route.name}
                  </p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-white/35">
                    {route.locationSlugs.length} stop{route.locationSlugs.length !== 1 ? "s" : ""}
                    {" · "}
                    {route.locationSlugs
                      .map((s) => LOCATION_BY_SLUG[s]?.name ?? s)
                      .join(" → ")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* CTA */}
        {selectedSlugs.length > 0 ? (
          <a
            href={`/booking?locations=${selectedSlugs.join(",")}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C9A84C] px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1C1209] transition-all duration-300 hover:bg-[#E8C96A]"
          >
            Request This Itinerary
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </a>
        ) : (
          !hasNoRoutes && (
            <p className="text-[11px] leading-relaxed text-white/20">
              Select locations above, then tap{" "}
              <span className="font-semibold text-white/35">Request This Itinerary</span>{" "}
              to send us your custom tour request.
            </p>
          )
        )}
      </div>

    </div>
  );
}

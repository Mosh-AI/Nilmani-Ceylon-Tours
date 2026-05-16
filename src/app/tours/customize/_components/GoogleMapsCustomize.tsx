"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { X, MapPin, Loader2, ArrowRight, Navigation } from "lucide-react";
import { SRI_LANKA_LOCATIONS, LOCATION_BY_SLUG } from "@/data/sri-lanka-locations";
import type { RouteData } from "./CustomizeTourMap";

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#0e0b07" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0e0b07" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6b5c3e" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#C9A84C" }] },
  { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#C9A84C" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0d1b2a" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3a4f6e" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2a2318" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1a160e" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3d3020" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#8a7040" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#161007" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#1a1a0e" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#1a1a14" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#141a0e" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#5a4a2a" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#1e1a12" }] },
];

type PinState = "selected" | "normal";

function makeSvgIcon(state: PinState): string {
  if (state === "selected") {
    return `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
        <circle cx="16" cy="16" r="14" fill="#C9A84C" stroke="#fff" stroke-width="2" opacity="0.25"/>
        <circle cx="16" cy="16" r="9" fill="#C9A84C" stroke="#fff" stroke-width="2"/>
        <circle cx="16" cy="16" r="4" fill="white"/>
      </svg>`
    )}`;
  }
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
      <circle cx="10" cy="10" r="8" fill="#C9A84C" stroke="rgba(201,168,76,0.3)" stroke-width="3" opacity="0.85"/>
      <circle cx="10" cy="10" r="3" fill="rgba(255,255,255,0.7)"/>
    </svg>`
  )}`;
}

interface GoogleMapsCustomizeProps {
  routes: RouteData[];
}

export function GoogleMapsCustomize({ routes }: GoogleMapsCustomizeProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);

  const allRouteSlugs = useMemo(() => {
    const set = new Set<string>();
    for (const r of routes) for (const s of r.locationSlugs) set.add(s);
    return set;
  }, [routes]);

  const { validRoutes, activeSlugs } = useMemo(() => {
    if (selectedSlugs.length === 0) {
      return { validRoutes: routes, activeSlugs: new Set(allRouteSlugs) };
    }
    const validRoutes = routes.filter((route) =>
      selectedSlugs.every((slug) => route.locationSlugs.includes(slug))
    );
    const activeSlugs = new Set<string>(selectedSlugs);
    for (const route of validRoutes)
      for (const slug of route.locationSlugs) activeSlugs.add(slug);
    return { validRoutes, activeSlugs };
  }, [selectedSlugs, routes, allRouteSlugs]);

  const toggleLocation = useCallback((slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

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
          center: { lat: 7.87, lng: 80.77 },
          zoom: 8,
          mapTypeId: "terrain",
          styles: MAP_STYLES,
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
          gestureHandling: "greedy",
        });
        mapInstanceRef.current = map;

        const routeLocs = SRI_LANKA_LOCATIONS.filter((loc) =>
          allRouteSlugs.has(loc.slug)
        );
        for (const loc of routeLocs) {
          const marker = new google.maps.Marker({
            position: { lat: loc.mapY, lng: loc.mapX },
            map,
            title: loc.name,
            optimized: false,
          });
          marker.addListener("click", () => toggleLocation(loc.slug));
          markersRef.current.set(loc.slug, marker);
        }
        setMapLoaded(true);
      })
      .catch(() => setLoadError(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Combined key: reruns when EITHER the selection OR the active set changes.
  // activeSlugsKey alone is not enough — when Cultural ⊆ Spiritual Escape,
  // selecting Anuradhapura produces the same activeSlugs as no selection,
  // so we must also track which pins are currently selected.
  const stateKey =
    [...selectedSlugs].sort().join("|") +
    "::" +
    [...activeSlugs].sort().join(",");

  useEffect(() => {
    if (!mapLoaded) return;

    const geoCoords: Record<string, { lat: number; lng: number }> = {
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
    };

    for (const [slug, marker] of markersRef.current) {
      const coords = geoCoords[slug];
      const isSelected = selectedSlugs.includes(slug);
      const isActive   = activeSlugs.has(slug);

      // Position (only needs to be set once but safe to repeat)
      if (coords) marker.setPosition({ lat: coords.lat, lng: coords.lng });

      if (!isActive && !isSelected) {
        // Impossible location — hide completely
        marker.setVisible(false);
      } else {
        marker.setVisible(true);
        const state: PinState = isSelected ? "selected" : "normal";
        const iconUrl = makeSvgIcon(state);
        const size = state === "selected" ? 32 : 20;
        marker.setIcon({
          url: iconUrl,
          scaledSize: new google.maps.Size(size, size),
          anchor: new google.maps.Point(size / 2, size / 2),
        });
        marker.setZIndex(state === "selected" ? 10 : 5);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded, stateKey]);

  const hasNoRoutes = routes.length === 0;

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-6" style={{ minHeight: 600 }}>

      {/* ── Map ── */}
      <div className="relative flex-1 lg:flex-[3]">
        {hasNoRoutes ? (
          <div className="flex h-full min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-[#C9A84C]/20 bg-white/[0.02]">
            <div className="text-center">
              <MapPin className="mx-auto mb-3 h-10 w-10 text-[#C9A84C]/30" />
              <p className="text-sm text-white/30">No routes have been configured yet.</p>
            </div>
          </div>
        ) : (
          /* Map frame with gold border */
          <div
            className="relative h-full min-h-[480px] overflow-hidden rounded-2xl lg:min-h-[600px]"
            style={{ boxShadow: "0 0 0 1px rgba(201,168,76,0.18), 0 24px 64px rgba(0,0,0,0.6)" }}
          >
            <div ref={mapRef} className="absolute inset-0" />

            {/* Loading overlay */}
            {!mapLoaded && !loadError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0e0b07]">
                <Loader2 className="h-8 w-8 animate-spin text-[#C9A84C]" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C]/50">
                  Loading map
                </p>
              </div>
            )}

            {loadError && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0e0b07]">
                <p className="text-sm text-white/30">Map failed to load.</p>
              </div>
            )}

            {/* Hint badge — bottom left */}
            {mapLoaded && selectedSlugs.length === 0 && (
              <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-[#C9A84C]/20 bg-black/60 px-3 py-1.5 backdrop-blur-sm">
                <Navigation size={10} className="text-[#C9A84C]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
                  Tap a pin to select
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Side Panel ── */}
      <div
        className="flex flex-col gap-5 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm lg:flex-[2] lg:gap-6"
        style={{ boxShadow: "inset 0 1px 0 rgba(201,168,76,0.06)" }}
      >

        {/* ── Your Selections ── */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px w-6 bg-gradient-to-r from-[#C9A84C] to-transparent" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C9A84C]">
              Your Selections
            </span>
            {selectedSlugs.length > 0 && (
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#C9A84C] text-[9px] font-bold text-[#0C0804]">
                {selectedSlugs.length}
              </span>
            )}
          </div>

          {selectedSlugs.length === 0 ? (
            <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-5">
              <p className="text-center text-xs leading-relaxed text-white/35">
                Tap any gold pin on the map to add a stop. Incompatible pins fade automatically.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedSlugs.map((slug) => (
                <button
                  key={slug}
                  onClick={() => toggleLocation(slug)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-3 py-1.5 text-[11px] font-medium text-[#C9A84C] transition-all duration-200 hover:border-[#C9A84C]/60 hover:bg-[#C9A84C]/20"
                >
                  {LOCATION_BY_SLUG[slug]?.name ?? slug}
                  <X className="h-3 w-3 opacity-60" />
                </button>
              ))}
              <button
                onClick={() => setSelectedSlugs([])}
                className="text-[11px] text-white/25 underline underline-offset-2 transition hover:text-white/50"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

        {/* ── Compatible Routes ── */}
        <div className="flex flex-1 flex-col gap-3 overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-gradient-to-r from-[#C9A84C] to-transparent" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C9A84C]">
              Compatible Routes
            </span>
            {!hasNoRoutes && (
              <span className="ml-auto rounded-full border border-[#C9A84C]/25 bg-[#C9A84C]/10 px-2 py-0.5 text-[10px] font-semibold text-[#C9A84C]">
                {validRoutes.length} of {routes.length}
              </span>
            )}
          </div>

          {hasNoRoutes ? (
            <p className="text-xs text-white/25">Routes will appear here once configured.</p>
          ) : validRoutes.length === 0 ? (
            <div className="rounded-xl border border-red-900/20 bg-red-950/10 px-4 py-5 text-center">
              <p className="text-sm font-light text-white/50">No routes match</p>
              <p className="mt-1 text-[11px] text-white/25">Try removing a stop to widen results.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: 280 }}>
              {validRoutes.map((route, i) => (
                <li
                  key={route.id}
                  className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all duration-200 hover:border-[#C9A84C]/20 hover:bg-[#C9A84C]/[0.04]"
                >
                  {/* subtle top line accent */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                  <div className="mb-2 flex items-start justify-between gap-2">
                    <p className="font-serif text-sm font-light leading-snug text-white/90">
                      {route.name}
                    </p>
                    <span className="shrink-0 rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/30">
                      {route.locationSlugs.length} stops
                    </span>
                  </div>

                  {/* Stop chain */}
                  <div className="flex flex-wrap items-center gap-1">
                    {route.locationSlugs.map((s, idx) => (
                      <span key={s} className="flex items-center gap-1">
                        <span
                          className={`text-[10px] leading-none transition-colors duration-200 ${
                            selectedSlugs.includes(s)
                              ? "font-semibold text-[#C9A84C]"
                              : "text-white/35"
                          }`}
                        >
                          {LOCATION_BY_SLUG[s]?.name ?? s}
                        </span>
                        {idx < route.locationSlugs.length - 1 && (
                          <ArrowRight size={8} className="shrink-0 text-white/15" />
                        )}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

        {/* ── CTA ── */}
        {selectedSlugs.length > 0 ? (
          <a
            href={`/booking?locations=${selectedSlugs.join(",")}`}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C9A84C] px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1C1209] transition-all duration-300 hover:bg-[#E8C96A]"
          >
            Request This Itinerary
            <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        ) : (
          <div className="text-center">
            <p className="text-[11px] leading-relaxed text-white/20">
              Select stops on the map, then request your custom itinerary.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

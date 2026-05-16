"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { X, MapPin, Loader2 } from "lucide-react";
import { SRI_LANKA_LOCATIONS, LOCATION_BY_SLUG } from "@/data/sri-lanka-locations";
import type { RouteData } from "./CustomizeTourMap";

// Dark map style matching brand aesthetic
const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#1c1c1c" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1c1c1c" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#2a2a2a" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#283d6a" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
];

type PinState = "selected" | "normal" | "faded";

function makeSvgIcon(state: PinState): string {
  if (state === "selected") {
    return `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
        <circle cx="12" cy="12" r="10" fill="#C9A84C" stroke="white" stroke-width="2"/>
        <circle cx="12" cy="12" r="4" fill="white"/>
      </svg>`
    )}`;
  }
  if (state === "faded") {
    return `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14">
        <circle cx="7" cy="7" r="5" fill="#888888" opacity="0.25"/>
      </svg>`
    )}`;
  }
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
      <circle cx="8" cy="8" r="6" fill="#A8891A" stroke="white" stroke-width="1.5"/>
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

  // All slugs present in any route
  const allRouteSlugs = useMemo(() => {
    const set = new Set<string>();
    for (const r of routes) for (const s of r.locationSlugs) set.add(s);
    return set;
  }, [routes]);

  // Core filtering
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

  // Init Google Maps
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

        // Create markers for all route locations
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

  // Set accurate lat/lng from our geographic data and update marker icons
  useEffect(() => {
    if (!mapLoaded) return;

    // Real lat/lng for each location (used for Google Maps placement)
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
      const state: PinState = selectedSlugs.includes(slug)
        ? "selected"
        : activeSlugs.has(slug)
        ? "normal"
        : "faded";

      if (coords) {
        marker.setPosition({ lat: coords.lat, lng: coords.lng });
      }
      const iconUrl = makeSvgIcon(state);
      const size = state === "selected" ? 24 : state === "faded" ? 14 : 16;
      marker.setIcon({
        url: iconUrl,
        scaledSize: new google.maps.Size(size, size),
        anchor: new google.maps.Point(size / 2, size / 2),
      });
      marker.setZIndex(state === "selected" ? 10 : state === "normal" ? 5 : 1);
      (marker as google.maps.Marker & { setClickable?: (v: boolean) => void }).setClickable?.(state !== "faded");
    }
  }, [mapLoaded, selectedSlugs, activeSlugs]);

  const hasNoRoutes = routes.length === 0;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12">
      {/* ── Map (3 cols) ── */}
      <div className="lg:col-span-3">
        {hasNoRoutes ? (
          <div className="flex min-h-[420px] items-center justify-center rounded-2xl border-2 border-dashed border-brand-border">
            <div className="text-center">
              <MapPin className="mx-auto mb-3 h-10 w-10 text-brand-border" />
              <p className="text-sm text-brand-muted">No routes have been set up yet.</p>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl" style={{ height: 520 }}>
            <div ref={mapRef} className="absolute inset-0" />
            {!mapLoaded && !loadError && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#1c1c1c]">
                <Loader2 className="h-8 w-8 animate-spin text-[#C9A84C]" />
              </div>
            )}
            {loadError && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#1c1c1c]">
                <p className="text-sm text-brand-muted">Map failed to load.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Side Panel (2 cols) ── */}
      <div className="flex flex-col gap-6 lg:col-span-2 lg:pt-4">
        {/* Selected locations */}
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="h-px w-6 bg-[#C9A84C]" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C9A84C]">
              Your Selections
            </h2>
          </div>
          {selectedSlugs.length === 0 ? (
            <p className="text-sm leading-relaxed text-brand-muted">
              Click any location pin on the map to start filtering compatible
              routes. Incompatible stops will fade automatically.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedSlugs.map((slug) => (
                <button
                  key={slug}
                  onClick={() => toggleLocation(slug)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-3 py-1.5 text-xs font-medium text-[#C9A84C] transition hover:bg-[#C9A84C]/20"
                >
                  {LOCATION_BY_SLUG[slug]?.name ?? slug}
                  <X className="h-3 w-3" />
                </button>
              ))}
              <button
                onClick={() => setSelectedSlugs([])}
                className="text-xs text-brand-faint underline underline-offset-2 hover:text-brand-muted"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Compatible routes */}
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="h-px w-6 bg-[#C9A84C]" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C9A84C]">
              Compatible Routes
              {!hasNoRoutes && (
                <span className="ml-2 rounded-full bg-[#C9A84C]/15 px-2 py-0.5 text-xs font-medium text-[#C9A84C]">
                  {validRoutes.length}
                </span>
              )}
            </h2>
          </div>
          {hasNoRoutes ? (
            <p className="text-sm text-brand-muted">Routes will appear here once configured.</p>
          ) : validRoutes.length === 0 ? (
            <div className="rounded-xl border border-brand-border bg-white p-4 text-center">
              <p className="text-sm font-medium text-gray-700">No routes match your selection</p>
              <p className="mt-1 text-xs text-brand-muted">Try removing one of your selected locations.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {validRoutes.map((route) => (
                <li key={route.id} className="rounded-xl border border-brand-border bg-white p-4 shadow-sm">
                  <p className="font-serif text-base font-light text-brand-text">{route.name}</p>
                  <p className="mt-1 text-xs text-brand-muted">
                    {route.locationSlugs.length} stop{route.locationSlugs.length !== 1 ? "s" : ""}
                    {" · "}
                    {route.locationSlugs.map((s) => LOCATION_BY_SLUG[s]?.name ?? s).join(" → ")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* CTA */}
        {selectedSlugs.length > 0 && (
          <a
            href={`/booking?locations=${selectedSlugs.join(",")}`}
            className="btn-gold inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold tracking-[0.1em]"
          >
            Request This Itinerary
          </a>
        )}
        {selectedSlugs.length === 0 && !hasNoRoutes && (
          <p className="text-xs leading-relaxed text-brand-faint">
            After selecting your preferred locations, use the{" "}
            <strong className="font-medium text-brand-muted">Request This Itinerary</strong>{" "}
            button to send us your custom tour request.
          </p>
        )}
      </div>
    </div>
  );
}

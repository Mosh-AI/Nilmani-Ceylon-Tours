"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { X, MapPin, Loader2, ArrowRight, Navigation, LogIn, MousePointerClick } from "lucide-react";
import type { RouteData } from "./CustomizeTourMap";
import { useSession } from "@/lib/auth-client";

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

function makePinElement(state: PinState): HTMLElement {
  const size = state === "selected" ? 32 : 20;
  const img = document.createElement("img");
  img.src = makeSvgIcon(state);
  img.width = size;
  img.height = size;
  img.style.display = "block";
  return img;
}

interface LocationRow {
  slug: string;
  name: string;
  region: string;
  mapX: number;
  mapY: number;
  lat: number;
  lng: number;
}

interface GoogleMapsCustomizeProps {
  routes: RouteData[];
  locations: LocationRow[];
}

export function GoogleMapsCustomize({ routes, locations }: GoogleMapsCustomizeProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map());
  const useAdvancedMarkersRef = useRef(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const { data: session, isPending: sessionLoading } = useSession();
  const isLoggedIn = !!session?.user;

  const allRouteSlugs = useMemo(() => {
    const set = new Set<string>();
    for (const r of routes) for (const s of r.locationSlugs) set.add(s);
    return set;
  }, [routes]);

  const locBySlug = useMemo(
    () => Object.fromEntries(locations.map((l) => [l.slug, l])),
    [locations]
  );

  const { validRoutes, activeSlugs } = useMemo(() => {
    if (selectedSlugs.length === 0) {
      return { validRoutes: [] as RouteData[], activeSlugs: new Set(allRouteSlugs) };
    }
    const validRoutes = routes.filter((r) =>
      selectedSlugs.every((s) => r.locationSlugs.includes(s))
    );
    const activeSlugs = new Set<string>(selectedSlugs);
    for (const r of validRoutes) for (const s of r.locationSlugs) activeSlugs.add(s);
    return { validRoutes, activeSlugs };
  }, [selectedSlugs, routes, allRouteSlugs]);

  const toggleLocation = useCallback((slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  // Clear route selection if it's no longer in the compatible list
  useEffect(() => {
    if (selectedRouteId && !validRoutes.find((r) => r.id === selectedRouteId)) {
      setSelectedRouteId(null);
    }
  }, [validRoutes, selectedRouteId]);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !mapRef.current) return;

    const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;
    const useAdvancedMarkers = !!mapId;
    useAdvancedMarkersRef.current = useAdvancedMarkers;

    import("@googlemaps/js-api-loader")
      .then(({ setOptions, importLibrary }) => {
        setOptions({ key: apiKey, v: "weekly" });
        const libs: Promise<google.maps.MapsLibrary | google.maps.MarkerLibrary>[] = [importLibrary("maps")];
        if (useAdvancedMarkers) libs.push(importLibrary("marker"));
        return Promise.all(libs);
      })
      .then(() => {
        if (!mapRef.current) return;
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 7.87, lng: 80.77 },
          zoom: 8,
          mapTypeId: "terrain",
          styles: MAP_STYLES,
          ...(mapId ? { mapId } : {}),
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
          gestureHandling: "greedy",
        });
        mapInstanceRef.current = map;

        const routeLocs = locations.filter((loc) =>
          allRouteSlugs.has(loc.slug)
        );
        for (const loc of routeLocs) {
          let marker: google.maps.marker.AdvancedMarkerElement;
          if (useAdvancedMarkers) {
            marker = new google.maps.marker.AdvancedMarkerElement({
              position: { lat: loc.lat, lng: loc.lng },
              map,
              title: loc.name,
              content: makePinElement("normal"),
            });
          } else {
            // Legacy marker — still functional, use until NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID is set
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const legacyMarker = new (google.maps as any).Marker({
              position: { lat: loc.lat, lng: loc.lng },
              map,
              title: loc.name,
              optimized: false,
            });
            marker = legacyMarker as unknown as google.maps.marker.AdvancedMarkerElement;
          }
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

    for (const [slug, marker] of markersRef.current) {
      const loc        = locBySlug[slug];
      const isSelected = selectedSlugs.includes(slug);
      const isActive   = activeSlugs.has(slug);
      const state: PinState = isSelected ? "selected" : "normal";

      if (useAdvancedMarkersRef.current) {
        // AdvancedMarkerElement API
        if (loc) marker.position = { lat: loc.lat, lng: loc.lng };
        if (!isActive && !isSelected) {
          marker.map = null;
        } else {
          marker.map = mapInstanceRef.current;
          marker.content = makePinElement(state);
          marker.zIndex = state === "selected" ? 10 : 5;
        }
      } else {
        // Legacy Marker API
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const m = marker as any;
        if (loc) m.setPosition({ lat: loc.lat, lng: loc.lng });
        if (!isActive && !isSelected) {
          m.setVisible(false);
        } else {
          m.setVisible(true);
          const iconUrl = makeSvgIcon(state);
          const size = state === "selected" ? 32 : 20;
          m.setIcon({
            url: iconUrl,
            scaledSize: new google.maps.Size(size, size),
            anchor: new google.maps.Point(size / 2, size / 2),
          });
          m.setZIndex(state === "selected" ? 10 : 5);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded, stateKey]);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-6" style={{ minHeight: 600 }}>

      {/* ── Map ── */}
      <div className="relative flex-1 lg:flex-[3]">
        {routes.length === 0 ? (
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
        className="flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm lg:flex-[2]"
        style={{ boxShadow: "inset 0 1px 0 rgba(201,168,76,0.06)", minHeight: 480 }}
      >
        {selectedSlugs.length === 0 ? (

          /* ── Empty state: full-panel invitation ── */
          <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl p-6">
            {/* Ambient gold glow */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,168,76,0.10) 0%, transparent 70%)",
              }}
            />
            <div className="relative flex flex-col items-center text-center">
              {/* Icon ring */}
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/[0.06]">
                <MousePointerClick size={32} className="text-[#C9A84C]/50" />
              </div>

              {/* Gold divider */}
              <div className="mx-auto my-6 h-px w-16 bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />

              {/* Heading */}
              <h3 className="font-serif text-xl font-light leading-snug text-white/80 sm:text-2xl">
                Click on the map to<br />create your own tour
              </h3>

              {/* Sub text */}
              <p className="mt-3 max-w-[220px] text-[11px] leading-relaxed text-white/35">
                Tap any destination pin to start building your perfect Sri Lanka journey.
              </p>

              {/* Coordinate */}
              <p className="mt-6 font-mono text-[10px] tracking-[0.22em] text-[#C9A84C]/20">
                7.87°N · 80.77°E
              </p>

              {/* Pulsing dots */}
              <div className="mt-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#C9A84C]/40" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#C9A84C]/25" style={{ animationDelay: "350ms" }} />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#C9A84C]/15" style={{ animationDelay: "700ms" }} />
              </div>
            </div>
          </div>

        ) : (

          /* ── Active state: selected stops + CTA ── */
          <div className="flex flex-col gap-5 p-6">

            {/* Selected stop chips */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-6 bg-gradient-to-r from-[#C9A84C] to-transparent" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C9A84C]">
                  Your Stops
                </span>
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#C9A84C] text-[9px] font-bold text-[#0C0804]">
                  {selectedSlugs.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSlugs.map((slug) => (
                  <button
                    key={slug}
                    onClick={() => toggleLocation(slug)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-3 py-1.5 text-[11px] font-medium text-[#C9A84C] transition-all duration-200 hover:border-[#C9A84C]/60 hover:bg-[#C9A84C]/20"
                  >
                    {locBySlug[slug]?.name ?? slug}
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
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

            {/* ── Compatible Routes ── */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="h-px w-6 bg-gradient-to-r from-[#C9A84C] to-transparent" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C9A84C]">
                  Compatible Routes
                </span>
                <span className="ml-auto rounded-full border border-[#C9A84C]/25 bg-[#C9A84C]/10 px-2 py-0.5 text-[10px] font-semibold text-[#C9A84C]">
                  {validRoutes.length} of {routes.length}
                </span>
              </div>

              {validRoutes.length === 0 ? (
                <div className="rounded-xl border border-red-900/20 bg-red-950/10 px-4 py-5 text-center">
                  <p className="text-sm font-light text-white/50">No routes match</p>
                  <p className="mt-1 text-[11px] text-white/25">Try removing a stop to widen results.</p>
                </div>
              ) : (
                <>
                  <p className="text-[10px] text-white/25 -mt-1">Tap a route to select it</p>
                  <ul className="flex flex-col gap-2 overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#C9A84C]/25" style={{ maxHeight: 240 }}>
                    {validRoutes.map((route) => {
                      const isChosen = selectedRouteId === route.id;
                      return (
                        <li key={route.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedRouteId(isChosen ? null : route.id)}
                            className={`group relative w-full overflow-hidden rounded-xl border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/50 ${
                              isChosen
                                ? "border-[#C9A84C]/50 bg-[#C9A84C]/[0.08] shadow-lg shadow-black/30"
                                : "border-white/[0.06] bg-white/[0.03] hover:border-[#C9A84C]/25 hover:bg-[#C9A84C]/[0.04]"
                            }`}
                          >
                            {/* Top accent line */}
                            <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent transition-opacity duration-200 ${isChosen ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`} />

                            <div className="mb-2 flex items-start justify-between gap-2">
                              <p className={`font-serif text-sm font-light leading-snug transition-colors duration-200 ${isChosen ? "text-[#E8C96A]" : "text-white/90"}`}>
                                {route.name}
                              </p>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {isChosen && (
                                  <span className="rounded-full bg-[#C9A84C] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#0C0804]">
                                    Selected
                                  </span>
                                )}
                                <span className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/30">
                                  {route.locationSlugs.length} stops
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-1">
                              {route.locationSlugs.map((s, idx) => (
                                <span key={s} className="flex items-center gap-1">
                                  <span className={`text-[10px] leading-none transition-colors duration-200 ${selectedSlugs.includes(s) ? "font-semibold text-[#C9A84C]" : "text-white/35"}`}>
                                    {locBySlug[s]?.name ?? s}
                                  </span>
                                  {idx < route.locationSlugs.length - 1 && (
                                    <ArrowRight size={8} className="shrink-0 text-white/15" />
                                  )}
                                </span>
                              ))}
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

            {/* CTA */}
            {sessionLoading ? (
              <div className="h-24 w-full animate-pulse rounded-2xl bg-white/5" />
            ) : !isLoggedIn ? (
              <div className="relative overflow-hidden rounded-2xl border border-[#C9A84C]/20 bg-[#C9A84C]/[0.04]">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
                <div className="flex flex-col gap-3 p-4">
                  <div className="flex items-center gap-2">
                    <LogIn size={14} className="shrink-0 text-[#C9A84C]/50" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C9A84C]/70">
                      Sign in to submit your request
                    </span>
                  </div>
                  {selectedRouteId && (
                    <p className="text-[11px] text-white/50">
                      Route: <span className="text-[#C9A84C]">{validRoutes.find((r) => r.id === selectedRouteId)?.name}</span>
                    </p>
                  )}
                  <p className="text-[11px] leading-relaxed text-white/35">
                    Create a free account or sign in to submit your custom tour request and track it from your dashboard.
                  </p>
                  <div className="flex flex-col gap-2">
                    <a
                      href={`/login?callbackUrl=${encodeURIComponent("/tours/customize")}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C9A84C] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1C1209] transition-all duration-300 hover:bg-[#E8C96A]"
                    >
                      Sign In to Request
                      <LogIn size={12} />
                    </a>
                    <a
                      href="/sign-up"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#C9A84C]/25 px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#C9A84C]/60 transition-all duration-300 hover:border-[#C9A84C]/50 hover:text-[#C9A84C]"
                    >
                      Create Free Account
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 px-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400/60" />
                  <span className="text-[10px] text-white/30">
                    Signed in as{" "}
                    <span className="text-white/50">{session.user.name || session.user.email}</span>
                  </span>
                </div>
                {!selectedRouteId ? (
                  <p className="text-center text-[11px] text-white/25">
                    Select a route above to request it
                  </p>
                ) : (
                  <a
                    href={`/booking?locations=${selectedSlugs.join(",")}&routeId=${selectedRouteId}`}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C9A84C] px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1C1209] transition-all duration-300 hover:bg-[#E8C96A]"
                  >
                    Request: {validRoutes.find((r) => r.id === selectedRouteId)?.name}
                    <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </a>
                )}
              </div>
            )}
          </div>

        )}
      </div>
    </div>
  );
}

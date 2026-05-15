"use client";

import { useState, useMemo } from "react";
import { X, MapPin } from "lucide-react";
import { SriLankaMapBase, type MapPin as Pin } from "@/components/SriLankaMapBase";
import {
  SRI_LANKA_LOCATIONS,
  LOCATION_BY_SLUG,
} from "@/data/sri-lanka-locations";

export interface RouteData {
  id: string;
  name: string;
  locationSlugs: string[];
}

interface CustomizeTourMapProps {
  routes: RouteData[];
}

export function CustomizeTourMap({ routes }: CustomizeTourMapProps) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);

  // All slugs present in any route (the only ones that ever appear as pins)
  const allRouteSlugs = useMemo(() => {
    const set = new Set<string>();
    for (const r of routes) {
      for (const s of r.locationSlugs) set.add(s);
    }
    return set;
  }, [routes]);

  // Core filtering: which routes still match all selected locations?
  const { validRoutes, activeSlugs } = useMemo(() => {
    if (selectedSlugs.length === 0) {
      return { validRoutes: routes, activeSlugs: new Set(allRouteSlugs) };
    }

    const validRoutes = routes.filter((route) =>
      selectedSlugs.every((slug) => route.locationSlugs.includes(slug))
    );

    // Union all stops from valid routes — selected slugs always stay active
    const activeSlugs = new Set<string>(selectedSlugs);
    for (const route of validRoutes) {
      for (const slug of route.locationSlugs) activeSlugs.add(slug);
    }

    return { validRoutes, activeSlugs };
  }, [selectedSlugs, routes, allRouteSlugs]);

  // Build pin array — only locations that appear in at least one route
  const pins: Pin[] = useMemo(
    () =>
      SRI_LANKA_LOCATIONS.filter((loc) => allRouteSlugs.has(loc.slug)).map(
        (loc) => ({
          slug: loc.slug,
          name: loc.name,
          mapX: loc.mapX,
          mapY: loc.mapY,
          state: selectedSlugs.includes(loc.slug)
            ? "selected"
            : activeSlugs.has(loc.slug)
            ? "normal"
            : "faded",
        })
      ),
    [selectedSlugs, activeSlugs, allRouteSlugs]
  );

  function toggleLocation(slug: string) {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  const hasNoRoutes = routes.length === 0;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12">
      {/* ── Map (3 cols) ── */}
      <div className="lg:col-span-3">
        {hasNoRoutes ? (
          <div className="flex min-h-[420px] items-center justify-center rounded-2xl border-2 border-dashed border-brand-border">
            <div className="text-center">
              <MapPin className="mx-auto mb-3 h-10 w-10 text-brand-border" />
              <p className="text-sm text-brand-muted">
                No routes have been set up yet.
              </p>
              <p className="mt-1 text-xs text-brand-faint">
                Check back soon — we&apos;re adding tour routes.
              </p>
            </div>
          </div>
        ) : (
          <SriLankaMapBase
            pins={pins}
            onPinClick={toggleLocation}
            className="mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-full"
            aria-label="Interactive Sri Lanka tour map. Click pins to filter compatible routes."
          />
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
                  aria-label={`Remove ${LOCATION_BY_SLUG[slug]?.name ?? slug}`}
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
            <p className="text-sm text-brand-muted">
              Routes will appear here once they&apos;ve been configured.
            </p>
          ) : validRoutes.length === 0 ? (
            <div className="rounded-xl border border-brand-border bg-white p-4 text-center">
              <p className="text-sm font-medium text-gray-700">
                No routes match your selection
              </p>
              <p className="mt-1 text-xs text-brand-muted">
                Try removing one of your selected locations.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {validRoutes.map((route) => (
                <li
                  key={route.id}
                  className="rounded-xl border border-brand-border bg-white p-4 shadow-sm"
                >
                  <p className="font-serif text-base font-light text-brand-text">
                    {route.name}
                  </p>
                  <p className="mt-1 text-xs text-brand-muted">
                    {route.locationSlugs.length} stop
                    {route.locationSlugs.length !== 1 ? "s" : ""}
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
        {selectedSlugs.length > 0 && (
          <a
            href={`/booking?locations=${selectedSlugs.join(",")}`}
            className="btn-gold inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold tracking-[0.1em]"
          >
            Request This Itinerary
          </a>
        )}

        {/* Hint when nothing selected */}
        {selectedSlugs.length === 0 && !hasNoRoutes && (
          <p className="text-xs leading-relaxed text-brand-faint">
            After selecting your preferred locations, use the{" "}
            <strong className="font-medium text-brand-muted">
              Request This Itinerary
            </strong>{" "}
            button to send us your custom tour request.
          </p>
        )}
      </div>
    </div>
  );
}

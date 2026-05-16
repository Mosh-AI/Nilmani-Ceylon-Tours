import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CustomizeTourMap, type RouteData } from "./_components/CustomizeTourMap";
import { GoogleMapsCustomize } from "./_components/GoogleMapsCustomize";
import { db } from "@/db";
import { routes, routeStops, siteSettings, locations } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { trackMapLoad } from "@/lib/map-usage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Customize Your Tour | Nilmani Ceylon Tours",
  description:
    "Build your dream Sri Lanka itinerary. Select the locations you want to visit and discover perfectly matched tour routes.",
};

async function getRoutes(): Promise<RouteData[]> {
  const allRoutes = await db
    .select({ id: routes.id, name: routes.name })
    .from(routes)
    .orderBy(asc(routes.createdAt));

  const allStops = await db
    .select({
      routeId: routeStops.routeId,
      locationSlug: routeStops.locationSlug,
    })
    .from(routeStops)
    .orderBy(asc(routeStops.routeId), asc(routeStops.stopOrder));

  const stopsByRoute = new Map<string, string[]>();
  for (const stop of allStops) {
    const arr = stopsByRoute.get(stop.routeId) ?? [];
    arr.push(stop.locationSlug);
    stopsByRoute.set(stop.routeId, arr);
  }

  return allRoutes.map((r) => ({
    id: r.id,
    name: r.name,
    locationSlugs: stopsByRoute.get(r.id) ?? [],
  }));
}

async function getLocations() {
  return db.select().from(locations).orderBy(asc(locations.region), asc(locations.name));
}

async function getMapsEnabled(): Promise<boolean> {
  const rows = await db
    .select({ value: siteSettings.value })
    .from(siteSettings)
    .where(eq(siteSettings.key, "google_maps_enabled"));
  return rows[0]?.value !== "false";
}

export default async function CustomizeTourPage() {
  const [allRoutes, allLocations, mapsEnabled] = await Promise.all([
    getRoutes(),
    getLocations(),
    getMapsEnabled(),
  ]);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const useGoogleMaps = mapsEnabled && apiKey.length > 0;

  trackMapLoad();

  return (
    <main className="min-h-screen bg-[#0C0804]">
      <Header />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pb-0 pt-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(ellipse 70% 55% at 50% 0%, #C9A84C 0%, transparent 70%)" }}
        />
        {/* Decorative grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 pb-10 lg:px-12">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px w-8 bg-[#C9A84C]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A84C]">
              Build Your Journey
            </span>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-serif text-4xl font-light leading-tight text-white md:text-5xl lg:text-6xl">
                Customize Your{" "}
                <span
                  className="italic"
                  style={{
                    background: "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Tour
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/45">
                Tap any location pin on the map to select your stops. Matching itineraries filter in real time — then request your custom tour.
              </p>
            </div>
            {/* Decorative coordinate badge */}
            <div className="hidden shrink-0 flex-col items-end gap-1 font-mono text-[10px] leading-tight text-[#C9A84C]/25 sm:flex select-none">
              <span>7.87°N · 80.77°E</span>
              <span>Sri Lanka · Indian Ocean</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Map + Panel ── */}
      <section className="px-6 pb-16 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {useGoogleMaps ? (
            <GoogleMapsCustomize routes={allRoutes} locations={allLocations} />
          ) : (
            /* SVG-only fallback when no Google Maps API key */
            <div className="overflow-hidden rounded-2xl border border-[#C9A84C]/15">
              <CustomizeTourMap routes={allRoutes} />
            </div>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-[#C9A84C]/10 px-6 py-14 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#C9A84C]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A84C]">Need Inspiration?</span>
            <div className="h-px w-8 bg-gradient-to-r from-[#C9A84C] to-transparent" />
          </div>
          <h2 className="font-serif text-3xl font-light text-white sm:text-4xl">
            Browse Our Curated Tours
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/40">
            Discover handcrafted itineraries built by our experts, then return to fine-tune your perfect journey.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="/tours"
              className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1C1209] transition-all duration-300 hover:bg-[#E8C96A]"
            >
              View All Tours
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C9A84C] transition-all duration-300 hover:border-[#C9A84C] hover:bg-[#C9A84C]/10"
            >
              Talk to an Expert
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

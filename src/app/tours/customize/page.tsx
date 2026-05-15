import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CustomizeTourMap, type RouteData } from "./_components/CustomizeTourMap";
import { GoogleMapsCustomize } from "./_components/GoogleMapsCustomize";
import { db } from "@/db";
import { routes, routeStops, siteSettings } from "@/db/schema";
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

async function getMapsEnabled(): Promise<boolean> {
  const rows = await db
    .select({ value: siteSettings.value })
    .from(siteSettings)
    .where(eq(siteSettings.key, "google_maps_enabled"));
  return rows[0]?.value !== "false"; // default true if not set
}

export default async function CustomizeTourPage() {
  const [allRoutes, mapsEnabled] = await Promise.all([getRoutes(), getMapsEnabled()]);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const useGoogleMaps = mapsEnabled && apiKey.length > 0;

  // Fire-and-forget: track this page load, check thresholds, send alerts
  trackMapLoad();

  return (
    <main className="min-h-screen bg-brand-bg">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#1C1209] pb-16 pt-36">
        <div className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, #C9A84C 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px w-8 bg-[#C9A84C]" />
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#C9A84C]">
              Build Your Journey
            </span>
          </div>
          <h1 className="font-serif text-4xl font-light leading-tight text-white md:text-5xl lg:text-6xl">
            Customize Your{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              className="italic"
            >
              Tour
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/60">
            Click the locations you want to visit on the map below. The routes
            that include all your chosen stops will update in real time.
            Select more stops to narrow down perfectly matched itineraries.
          </p>
        </div>
      </section>

      {/* Map + Panel */}
      <section className="py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {useGoogleMaps ? (
            <GoogleMapsCustomize routes={allRoutes} />
          ) : (
            <CustomizeTourMap routes={allRoutes} />
          )}
        </div>
      </section>

      {/* Bottom CTA strip */}
      <section className="border-t border-brand-border bg-white py-12 px-6 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-2xl font-light text-brand-text">
            Not sure where to start?
          </p>
          <p className="mt-3 text-sm text-brand-muted">
            Browse our curated tour packages for inspiration, then come back to
            fine-tune your perfect itinerary.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="/tours"
              className="btn-gold rounded-full px-8 py-3 text-sm font-semibold tracking-[0.1em]"
            >
              View All Tours
            </a>
            <a
              href="/contact"
              className="rounded-full border border-brand-border px-8 py-3 text-sm font-medium text-brand-text transition hover:border-[#C9A84C]/50 hover:text-[#C9A84C]"
            >
              Talk to Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

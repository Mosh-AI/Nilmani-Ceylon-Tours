import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CustomizeTourMap, type RouteData } from "./_components/CustomizeTourMap";
import { GoogleMapsCustomize } from "./_components/GoogleMapsCustomize";
import { CustomizeMapExplorer } from "./_components/CustomizeMapExplorer";
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
  return rows[0]?.value !== "false";
}

export default async function CustomizeTourPage() {
  const [allRoutes, mapsEnabled] = await Promise.all([getRoutes(), getMapsEnabled()]);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const useGoogleMaps = mapsEnabled && apiKey.length > 0;

  trackMapLoad();

  return (
    <main className="min-h-screen bg-[#1C1209]">
      <Header />

      {/* ── Page title hero — slim, dark ── */}
      <section className="relative overflow-hidden bg-[#0C0804] pb-12 pt-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(ellipse 70% 55% at 50% 0%, #C9A84C 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px w-8 bg-[#C9A84C]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A84C]">
              Build Your Journey
            </span>
          </div>
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
              Sri Lanka Tour
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/50">
            Explore the destinations below, then scroll to select your preferred stops and discover perfectly matched itineraries — or let us craft something entirely bespoke.
          </p>
        </div>
      </section>

      {/* ── Interactive destination map explorer ── */}
      <CustomizeMapExplorer />

      {/* ── Divider between explorer and route builder ── */}
      <div className="relative bg-[#1C1209] px-6 py-14 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left sm:gap-8">
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-[#C9A84C]">
                  <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="h-px w-12 bg-gradient-to-r from-[#C9A84C]/50 to-transparent hidden sm:block" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-light text-white">
                Now Build Your Itinerary
              </h2>
              <p className="mt-1.5 text-sm text-white/40">
                Click the pins below to select your preferred stops — matching routes update in real time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Route builder map ── */}
      <section className="bg-[#FAFAF9] px-6 py-16 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-7xl">
          {useGoogleMaps ? (
            <GoogleMapsCustomize routes={allRoutes} />
          ) : (
            <CustomizeTourMap routes={allRoutes} />
          )}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-[#1C1209] px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#C9A84C]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A84C]">Need Help?</span>
            <div className="h-px w-8 bg-gradient-to-r from-[#C9A84C] to-transparent" />
          </div>
          <h2 className="font-serif text-3xl font-light text-white sm:text-4xl">
            Not sure where to start?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/45">
            Browse our curated tour packages for inspiration, then come back to fine-tune your perfect itinerary.
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
              Talk to Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

import { NextResponse } from "next/server";
import { db } from "@/db";
import { routes, routeStops } from "@/db/schema";
import { asc } from "drizzle-orm";
import { apiHeaders } from "@/lib/api-headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const allRoutes = await db
    .select({ id: routes.id, name: routes.name })
    .from(routes)
    .orderBy(asc(routes.createdAt));

  const allStops = await db
    .select({
      routeId: routeStops.routeId,
      locationSlug: routeStops.locationSlug,
      stopOrder: routeStops.stopOrder,
    })
    .from(routeStops)
    .orderBy(asc(routeStops.routeId), asc(routeStops.stopOrder));

  // Group stops by routeId (avoids N duplicate rows from a join)
  const stopsByRoute = new Map<string, string[]>();
  for (const stop of allStops) {
    const arr = stopsByRoute.get(stop.routeId) ?? [];
    arr.push(stop.locationSlug);
    stopsByRoute.set(stop.routeId, arr);
  }

  const result = allRoutes.map((r) => ({
    id: r.id,
    name: r.name,
    locationSlugs: stopsByRoute.get(r.id) ?? [],
  }));

  return NextResponse.json(
    { routes: result },
    {
      headers: {
        ...apiHeaders(),
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    }
  );
}

import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { locations, routeStops } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { apiHeaders } from "@/lib/api-headers";
import { z } from "zod";
import { sanitizeText } from "@/lib/sanitize";

const REGION_VALUES = ["north", "north-central", "east", "central", "west", "south"] as const;
type Region = typeof REGION_VALUES[number];

const updateSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be 100 characters or fewer" })
    .optional(),
  region: z
    .enum([...REGION_VALUES] as [Region, ...Region[]], {
      errorMap: () => ({ message: "Invalid region" }),
    })
    .optional(),
  mapX: z.number({ invalid_type_error: "Map X must be a number" }).min(0).max(500).optional(),
  mapY: z.number({ invalid_type_error: "Map Y must be a number" }).min(0).max(800).optional(),
  lat: z.number({ invalid_type_error: "Lat must be a number" }).min(5).max(11).optional(),
  lng: z.number({ invalid_type_error: "Lng must be a number" }).min(79).max(82).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session)
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: apiHeaders() }
    );

  const { id } = await params;

  const [existing] = await db
    .select()
    .from(locations)
    .where(eq(locations.id, id))
    .limit(1);

  if (!existing)
    return NextResponse.json(
      { error: "Not found" },
      { status: 404, headers: apiHeaders() }
    );

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400, headers: apiHeaders() }
    );
  }

  const { name, region, mapX, mapY, lat, lng } = parsed.data;

  const updates: Partial<{
    name: string;
    region: Region;
    mapX: number;
    mapY: number;
    lat: number;
    lng: number;
  }> = {};

  if (name !== undefined) updates.name = sanitizeText(name);
  if (region !== undefined) updates.region = region;
  if (mapX !== undefined) updates.mapX = mapX;
  if (mapY !== undefined) updates.mapY = mapY;
  if (lat !== undefined) updates.lat = lat;
  if (lng !== undefined) updates.lng = lng;

  const [updated] = await db
    .update(locations)
    .set(updates)
    .where(eq(locations.id, id))
    .returning();

  return NextResponse.json({ location: updated }, { headers: apiHeaders() });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session)
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: apiHeaders() }
    );

  const { id } = await params;

  const [existing] = await db
    .select()
    .from(locations)
    .where(eq(locations.id, id))
    .limit(1);

  if (!existing)
    return NextResponse.json(
      { error: "Not found" },
      { status: 404, headers: apiHeaders() }
    );

  // Check if location is used in any route stops
  const [usageRow] = await db
    .select({ total: count() })
    .from(routeStops)
    .where(eq(routeStops.locationSlug, existing.slug));

  const usageCount = usageRow?.total ?? 0;
  if (usageCount > 0) {
    return NextResponse.json(
      { error: `Cannot delete — used in ${usageCount} route(s)` },
      { status: 409, headers: apiHeaders() }
    );
  }

  await db.delete(locations).where(eq(locations.id, id));

  return NextResponse.json({ success: true }, { headers: apiHeaders() });
}

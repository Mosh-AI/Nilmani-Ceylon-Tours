import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { locations } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { apiHeaders } from "@/lib/api-headers";
import { z } from "zod";
import { sanitizeText } from "@/lib/sanitize";

const REGION_VALUES = ["north", "north-central", "east", "central", "west", "south"] as const;
type Region = typeof REGION_VALUES[number];

const createSchema = z.object({
  slug: z
    .string()
    .min(1, { message: "Slug is required" })
    .max(100, { message: "Slug must be 100 characters or fewer" })
    .regex(/^[a-z0-9-]+$/, { message: "Slug may only contain lowercase letters, digits, and hyphens" }),
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be 100 characters or fewer" }),
  region: z.enum([...REGION_VALUES] as [Region, ...Region[]], {
    errorMap: () => ({ message: "Invalid region" }),
  }),
  mapX: z.number({ invalid_type_error: "Map X must be a number" }).min(0).max(500),
  mapY: z.number({ invalid_type_error: "Map Y must be a number" }).min(0).max(800),
  lat: z.number({ invalid_type_error: "Lat must be a number" }).min(5).max(11),
  lng: z.number({ invalid_type_error: "Lng must be a number" }).min(79).max(82),
});

export async function GET() {
  const session = await getAdminSession();
  if (!session)
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: apiHeaders() }
    );

  const rows = await db
    .select()
    .from(locations)
    .orderBy(asc(locations.region), asc(locations.name));

  return NextResponse.json({ locations: rows }, { headers: apiHeaders() });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session)
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: apiHeaders() }
    );

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400, headers: apiHeaders() }
    );
  }

  const { slug, name, region, mapX, mapY, lat, lng } = parsed.data;

  // Check slug uniqueness
  const existing = await db
    .select({ id: locations.id })
    .from(locations)
    .where(eq(locations.slug, slug))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json(
      { error: `A location with slug "${slug}" already exists` },
      { status: 409, headers: apiHeaders() }
    );
  }

  const [location] = await db
    .insert(locations)
    .values({
      slug: sanitizeText(slug),
      name: sanitizeText(name),
      region,
      mapX,
      mapY,
      lat,
      lng,
    })
    .returning();

  return NextResponse.json({ location }, { status: 201, headers: apiHeaders() });
}

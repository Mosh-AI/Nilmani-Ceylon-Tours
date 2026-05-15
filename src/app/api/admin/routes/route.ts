import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { routes, routeStops } from "@/db/schema";
import { desc } from "drizzle-orm";
import { apiHeaders } from "@/lib/api-headers";
import { z } from "zod";
import { sanitizeText } from "@/lib/sanitize";
import { LOCATION_BY_SLUG } from "@/data/sri-lanka-locations";

const routeSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(2).max(150),
  description: z.string().max(500).nullable().optional(),
  stops: z
    .array(z.string().min(1).max(100))
    .min(1, { message: "At least one stop is required" })
    .max(50),
});

export async function GET() {
  const session = await getAdminSession();
  if (!session)
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: apiHeaders() }
    );

  const rows = await db
    .select({
      id: routes.id,
      name: routes.name,
      description: routes.description,
      createdAt: routes.createdAt,
    })
    .from(routes)
    .orderBy(desc(routes.createdAt));

  return NextResponse.json({ routes: rows }, { headers: apiHeaders() });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session)
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: apiHeaders() }
    );

  const body = await request.json();
  const parsed = routeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400, headers: apiHeaders() }
    );
  }

  const { name, description, stops } = parsed.data;

  // Validate slugs exist in the pre-defined location list
  const unknown = stops.filter((s) => !LOCATION_BY_SLUG[s]);
  if (unknown.length > 0) {
    return NextResponse.json(
      { error: `Unknown location slugs: ${unknown.join(", ")}` },
      { status: 400, headers: apiHeaders() }
    );
  }

  const [route] = await db
    .insert(routes)
    .values({
      name: sanitizeText(name),
      description: description ? sanitizeText(description) : null,
    })
    .returning();

  await db.insert(routeStops).values(
    stops.map((slug, idx) => ({
      routeId: route.id,
      locationSlug: slug,
      stopOrder: idx,
    }))
  );

  return NextResponse.json({ route }, { status: 201, headers: apiHeaders() });
}

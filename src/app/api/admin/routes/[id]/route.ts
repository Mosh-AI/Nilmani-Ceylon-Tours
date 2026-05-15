import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { routes, routeStops } from "@/db/schema";
import { eq } from "drizzle-orm";
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

export async function GET(
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

  const [route] = await db
    .select()
    .from(routes)
    .where(eq(routes.id, id))
    .limit(1);

  if (!route)
    return NextResponse.json(
      { error: "Not found" },
      { status: 404, headers: apiHeaders() }
    );

  const stops = await db
    .select({ locationSlug: routeStops.locationSlug })
    .from(routeStops)
    .where(eq(routeStops.routeId, id))
    .orderBy(routeStops.stopOrder);

  return NextResponse.json(
    { route: { ...route, stops: stops.map((s) => s.locationSlug) } },
    { headers: apiHeaders() }
  );
}

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
    .select({ id: routes.id })
    .from(routes)
    .where(eq(routes.id, id))
    .limit(1);

  if (!existing)
    return NextResponse.json(
      { error: "Not found" },
      { status: 404, headers: apiHeaders() }
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

  const unknown = stops.filter((s) => !LOCATION_BY_SLUG[s]);
  if (unknown.length > 0) {
    return NextResponse.json(
      { error: `Unknown location slugs: ${unknown.join(", ")}` },
      { status: 400, headers: apiHeaders() }
    );
  }

  await db
    .update(routes)
    .set({
      name: sanitizeText(name),
      description: description ? sanitizeText(description) : null,
      updatedAt: new Date(),
    })
    .where(eq(routes.id, id));

  // Replace stops atomically: delete all then re-insert in order
  await db.delete(routeStops).where(eq(routeStops.routeId, id));
  await db.insert(routeStops).values(
    stops.map((slug, idx) => ({
      routeId: id,
      locationSlug: slug,
      stopOrder: idx,
    }))
  );

  return NextResponse.json({ success: true }, { headers: apiHeaders() });
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
    .select({ id: routes.id })
    .from(routes)
    .where(eq(routes.id, id))
    .limit(1);

  if (!existing)
    return NextResponse.json(
      { error: "Not found" },
      { status: 404, headers: apiHeaders() }
    );

  // cascade delete handles routeStops
  await db.delete(routes).where(eq(routes.id, id));

  return NextResponse.json({ success: true }, { headers: apiHeaders() });
}

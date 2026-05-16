import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tours, tourDestinations, destinations } from "@/db/schema";
import { eq, inArray, and } from "drizzle-orm";
import { apiHeaders } from "@/lib/api-headers";

const tourFields = {
  id: tours.id,
  slug: tours.slug,
  title: tours.title,
  subtitle: tours.subtitle,
  duration: tours.duration,
  price: tours.price,
  category: tours.category,
  heroImage: tours.heroImage,
  personsIncluded: tours.personsIncluded,
  difficulty: tours.difficulty,
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const locationsParam = searchParams.get("locations");

  const locationSlugs = locationsParam
    ? locationsParam
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s.length > 0)
    : [];

  if (locationSlugs.length === 0) {
    const rows = await db
      .select(tourFields)
      .from(tours)
      .where(eq(tours.available, true))
      .orderBy(tours.duration);

    return NextResponse.json({ tours: rows }, { headers: apiHeaders() });
  }

  const matchedDestinations = await db
    .select({ slug: destinations.slug, name: destinations.name, id: destinations.id })
    .from(destinations)
    .where(inArray(destinations.slug, locationSlugs));

  const matchedDestinationIds = matchedDestinations.map((d) => d.id);
  const matchedLocations = matchedDestinations.map(({ slug, name }) => ({ slug, name }));

  if (matchedDestinationIds.length === 0) {
    const allTours = await db
      .select(tourFields)
      .from(tours)
      .where(eq(tours.available, true))
      .orderBy(tours.duration);

    return NextResponse.json(
      {
        tours: allTours,
        filtered: false,
        requestedLocations: locationSlugs,
        matchedLocations: [],
      },
      { headers: apiHeaders() }
    );
  }

  const tourIdRows = await db
    .selectDistinct({ tourId: tourDestinations.tourId })
    .from(tourDestinations)
    .innerJoin(destinations, eq(tourDestinations.destinationId, destinations.id))
    .where(inArray(destinations.id, matchedDestinationIds));

  const tourIds = tourIdRows.map((r) => r.tourId);

  if (tourIds.length === 0) {
    const allTours = await db
      .select(tourFields)
      .from(tours)
      .where(eq(tours.available, true))
      .orderBy(tours.duration);

    return NextResponse.json(
      {
        tours: allTours,
        filtered: false,
        requestedLocations: locationSlugs,
        matchedLocations,
      },
      { headers: apiHeaders() }
    );
  }

  const filteredTours = await db
    .select(tourFields)
    .from(tours)
    .where(and(eq(tours.available, true), inArray(tours.id, tourIds)))
    .orderBy(tours.duration);

  return NextResponse.json(
    {
      tours: filteredTours,
      filtered: true,
      requestedLocations: locationSlugs,
      matchedLocations,
    },
    { headers: apiHeaders() }
  );
}

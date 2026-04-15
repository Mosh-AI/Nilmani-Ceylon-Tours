import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/user-auth";
import { db } from "@/db";
import { bookings, favorites, tours } from "@/db/schema";
import { eq } from "drizzle-orm";
import { apiHeaders } from "@/lib/api-headers";

/**
 * GDPR Article 20 — Right to Data Portability.
 * Returns all user data as a JSON download.
 */
export async function GET() {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });
  }

  const uid = session.user.id;

  const [myBookings, myFavorites] = await Promise.all([
    db.select().from(bookings).where(eq(bookings.userId, uid)),
    db
      .select({ tour: tours })
      .from(favorites)
      .innerJoin(tours, eq(favorites.tourId, tours.id))
      .where(eq(favorites.userId, uid)),
  ]);

  const export_data = {
    exported_at: new Date().toISOString(),
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    },
    bookings: myBookings.map((b) => ({
      referenceCode: b.referenceCode,
      startDate: b.startDate,
      guests: b.guests,
      status: b.status,
      specialRequests: b.specialRequests,
      createdAt: b.createdAt,
    })),
    saved_tours: myFavorites.map(({ tour }) => ({
      title: tour.title,
      slug: tour.slug,
    })),
  };

  return new NextResponse(JSON.stringify(export_data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="nilmani-data-export-${uid.slice(0, 8)}.json"`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}

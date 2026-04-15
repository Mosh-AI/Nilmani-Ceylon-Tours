import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { bookings, tours, contactSubmissions, galleryImages } from "@/db/schema";
import { eq, sql, gte, count } from "drizzle-orm";
import { apiHeaders } from "@/lib/api-headers";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalBookings,
    newInquiries,
    confirmedBookings,
    totalTours,
    recentContacts,
    recentBookings,
  ] = await Promise.all([
    db.select({ count: count() }).from(bookings),
    db.select({ count: count() }).from(bookings).where(eq(bookings.status, "inquiry")),
    db.select({ count: count() }).from(bookings).where(eq(bookings.status, "confirmed")),
    db.select({ count: count() }).from(tours).where(eq(tours.available, true)),
    db.select({ count: count() }).from(contactSubmissions).where(
      gte(contactSubmissions.createdAt, thirtyDaysAgo)
    ),
    db
      .select({
        id: bookings.id,
        referenceCode: bookings.referenceCode,
        guestName: bookings.guestName,
        tourId: bookings.tourId,
        startDate: bookings.startDate,
        guests: bookings.guests,
        status: bookings.status,
        createdAt: bookings.createdAt,
      })
      .from(bookings)
      .orderBy(sql`${bookings.createdAt} desc`)
      .limit(5),
  ]);

  return NextResponse.json(
    {
      stats: {
        totalBookings: totalBookings[0]?.count ?? 0,
        newInquiries: newInquiries[0]?.count ?? 0,
        confirmedBookings: confirmedBookings[0]?.count ?? 0,
        activeTours: totalTours[0]?.count ?? 0,
        recentContacts: recentContacts[0]?.count ?? 0,
      },
      recentBookings,
    },
    { headers: apiHeaders() }
  );
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq, and, ilike } from "drizzle-orm";
import { apiHeaders } from "@/lib/api-headers";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ref = searchParams.get("ref")?.trim().toUpperCase();
  const email = searchParams.get("email")?.trim().toLowerCase();

  if (!ref || !email) {
    return NextResponse.json(
      { error: "Reference code and email are required" },
      { status: 400, headers: apiHeaders() }
    );
  }

  const [booking] = await db
    .select({
      referenceCode: bookings.referenceCode,
      guestName: bookings.guestName,
      startDate: bookings.startDate,
      guests: bookings.guests,
      status: bookings.status,
      totalPrice: bookings.totalPrice,
      specialRequests: bookings.specialRequests,
    })
    .from(bookings)
    .where(
      and(
        eq(bookings.referenceCode, ref),
        ilike(bookings.email, email)
      )
    )
    .limit(1);

  if (!booking) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404, headers: apiHeaders() }
    );
  }

  return NextResponse.json({ booking }, { headers: apiHeaders() });
}

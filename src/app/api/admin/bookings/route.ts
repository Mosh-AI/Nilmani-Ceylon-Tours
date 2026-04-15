import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq, sql, ilike, or } from "drizzle-orm";
import { apiHeaders } from "@/lib/api-headers";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });

  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = 20;
  const offset = (page - 1) * limit;

  let query = db.select().from(bookings);

  const validStatuses = ["inquiry","quoted","deposit_paid","confirmed","in_progress","completed","cancelled"] as const;
  type BookingStatus = typeof validStatuses[number];
  if (status && (validStatuses as readonly string[]).includes(status)) {
    query = query.where(eq(bookings.status, status as BookingStatus)) as typeof query;
  }
  if (search) {
    query = query.where(
      or(
        ilike(bookings.guestName, `%${search}%`),
        ilike(bookings.email, `%${search}%`),
        ilike(bookings.referenceCode, `%${search}%`)
      )
    ) as typeof query;
  }

  const rows = await query
    .orderBy(sql`${bookings.createdAt} desc`)
    .limit(limit)
    .offset(offset);

  return NextResponse.json({ bookings: rows }, { headers: apiHeaders() });
}

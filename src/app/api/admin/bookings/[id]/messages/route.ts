import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { messages, bookings } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { apiHeaders } from "@/lib/api-headers";
import { sanitizeText } from "@/lib/sanitize";
import { z } from "zod";

const postSchema = z.object({
  content: z.string().min(1).max(2000),
});

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/admin/bookings/[id]/messages
 * Returns the full message thread for a booking.
 */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const adminSession = await getAdminSession();
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });
  }

  const { id } = await params;

  const [booking] = await db
    .select({ id: bookings.id })
    .from(bookings)
    .where(eq(bookings.id, id))
    .limit(1);

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404, headers: apiHeaders() });
  }

  const thread = await db
    .select()
    .from(messages)
    .where(eq(messages.bookingId, id))
    .orderBy(asc(messages.createdAt));

  return NextResponse.json({ messages: thread }, { headers: apiHeaders() });
}

/**
 * POST /api/admin/bookings/[id]/messages
 * Admin sends a message on the booking thread.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  const adminSession = await getAdminSession();
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });
  }

  const { id } = await params;

  const [booking] = await db
    .select({ id: bookings.id })
    .from(bookings)
    .where(eq(bookings.id, id))
    .limit(1);

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404, headers: apiHeaders() });
  }

  const body = await request.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400, headers: apiHeaders() }
    );
  }

  const clean = sanitizeText(parsed.data.content);

  const [msg] = await db
    .insert(messages)
    .values({
      bookingId: id,
      senderId: adminSession.user.id,
      senderRole: "admin",
      content: clean,
    })
    .returning();

  return NextResponse.json({ message: msg }, { status: 201, headers: apiHeaders() });
}

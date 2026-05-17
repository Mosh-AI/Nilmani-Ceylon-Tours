import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { messages, bookings } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { apiHeaders } from "@/lib/api-headers";
import { sanitizeText } from "@/lib/sanitize";
import { z } from "zod";

const postSchema = z.object({
  bookingId: z.string().uuid(),
  content: z.string().min(1).max(2000),
});

/**
 * GET /api/admin/messages?bookingId=xxx
 * Fetch all messages for a booking (admin only).
 */
export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });
  }

  const bookingId = request.nextUrl.searchParams.get("bookingId");
  if (!bookingId) {
    return NextResponse.json({ error: "bookingId required" }, { status: 400, headers: apiHeaders() });
  }

  const thread = await db
    .select()
    .from(messages)
    .where(eq(messages.bookingId, bookingId))
    .orderBy(sql`${messages.createdAt} asc`);

  return NextResponse.json({ messages: thread }, { headers: apiHeaders() });
}

/**
 * POST /api/admin/messages
 * Send a message as admin on a booking thread.
 */
export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });
  }

  const body = await request.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400, headers: apiHeaders() });
  }

  const { bookingId, content } = parsed.data;

  // Verify booking exists
  const [booking] = await db
    .select({ id: bookings.id })
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .limit(1);

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404, headers: apiHeaders() });
  }

  const clean = sanitizeText(content);

  const [msg] = await db
    .insert(messages)
    .values({
      bookingId,
      senderId: session.user.id,
      senderRole: "admin",
      content: clean,
    })
    .returning();

  return NextResponse.json({ message: msg }, { status: 201, headers: apiHeaders() });
}

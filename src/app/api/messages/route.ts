import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/lib/user-auth";
import { db } from "@/db";
import { messages, bookings } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { apiHeaders } from "@/lib/api-headers";
import { sanitizeText } from "@/lib/sanitize";
import { z } from "zod";

const bodySchema = z.object({
  bookingId: z.string().uuid(),
  content: z.string().min(1).max(2000),
});

/**
 * POST /api/messages
 * Send a message on a booking thread.
 * IDOR protection: verifies the booking belongs to the authenticated user.
 */
export async function POST(request: NextRequest) {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });
  }

  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400, headers: apiHeaders() }
    );
  }

  const { bookingId, content } = parsed.data;

  // IDOR guard: booking must belong to this user
  const [booking] = await db
    .select({ id: bookings.id })
    .from(bookings)
    .where(and(eq(bookings.id, bookingId), eq(bookings.userId, session.user.id)))
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
      senderRole: "user",
      content: clean,
    })
    .returning();

  return NextResponse.json({ message: msg }, { status: 201, headers: apiHeaders() });
}

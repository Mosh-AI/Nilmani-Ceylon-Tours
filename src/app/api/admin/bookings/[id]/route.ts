import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { bookings, bookingStatusHistory } from "@/db/schema";
import { eq } from "drizzle-orm";
import { apiHeaders } from "@/lib/api-headers";
import { z } from "zod";
import { sendBookingStatusUpdateEmail } from "@/lib/email";

const updateSchema = z.object({
  status: z
    .enum(["inquiry", "quoted", "deposit_paid", "confirmed", "in_progress", "completed", "cancelled"])
    .optional(),
  adminNotes: z.string().max(2000).optional(),
  totalPrice: z.number().int().min(0).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });

  const { id } = await params;
  const [booking] = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404, headers: apiHeaders() });

  const history = await db
    .select()
    .from(bookingStatusHistory)
    .where(eq(bookingStatusHistory.bookingId, id))
    .orderBy(bookingStatusHistory.createdAt);

  return NextResponse.json({ booking, history }, { headers: apiHeaders() });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });

  const { id } = await params;
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400, headers: apiHeaders() });
  }

  const data = parsed.data;

  // Get current booking to detect status change
  const [current] = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404, headers: apiHeaders() });

  await db
    .update(bookings)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(bookings.id, id));

  // Log status change to history + send guest notification email
  if (data.status && data.status !== current.status) {
    await db.insert(bookingStatusHistory).values({
      id: crypto.randomUUID(),
      bookingId: id,
      status: data.status,
      changedBy: session.user.id,
      createdAt: new Date(),
    });

    // Fire-and-forget — don't block the admin response on email delivery
    sendBookingStatusUpdateEmail(
      current.email,
      current.guestName,
      current.referenceCode,
      data.status
    ).catch((err) => console.error("[Email] Status update email failed:", err));
  }

  return NextResponse.json({ success: true }, { headers: apiHeaders() });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });

  const { id } = await params;
  await db.delete(bookings).where(eq(bookings.id, id));
  return NextResponse.json({ success: true }, { headers: apiHeaders() });
}

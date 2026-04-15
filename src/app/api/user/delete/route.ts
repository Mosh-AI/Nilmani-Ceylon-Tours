import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/user-auth";
import { db } from "@/db";
import { user, bookings, favorites, messages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { apiHeaders } from "@/lib/api-headers";

/**
 * GDPR Article 17 — Right to Erasure.
 * Anonymises the user's bookings, deletes messages, favorites, and the user account.
 */
export async function DELETE() {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });
  }

  const uid = session.user.id;

  // Anonymise bookings (keep for accounting/legal, but remove PII)
  await db
    .update(bookings)
    .set({
      guestName: "Deleted User",
      email: `deleted-${uid}@anonymised.invalid`,
      phone: null,
      specialRequests: null,
      adminNotes: null,
      userId: null,
    })
    .where(eq(bookings.userId, uid));

  // Delete messages
  await db.delete(messages).where(eq(messages.senderId, uid));

  // Delete favorites
  await db.delete(favorites).where(eq(favorites.userId, uid));

  // Delete the user account (cascades to session, account, verification via FK)
  await db.delete(user).where(eq(user.id, uid));

  return NextResponse.json(
    { success: true, message: "Your account and personal data have been deleted." },
    { headers: apiHeaders() }
  );
}

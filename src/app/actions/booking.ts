"use server";

import { bookingSchema } from "@/lib/validations";
import { isBot } from "@/lib/honeypot";
import {
  sanitizeText,
  sanitizeEmail,
  sanitizePhone,
  generateReferenceCode,
} from "@/lib/sanitize";
import {
  sendBookingNotificationToAdmin,
  sendBookingConfirmationToGuest,
} from "@/lib/email";
import { db } from "@/db";
import { bookings } from "@/db/schema";

export type BookingActionResult =
  | { success: true; referenceCode: string; message: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function submitBookingForm(
  formData: unknown
): Promise<BookingActionResult> {
  // 1. Parse and validate with Zod
  const parsed = bookingSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = parsed.data;

  // 2. Honeypot bot detection
  if (isBot(data)) {
    // Fake success to not reveal detection
    return {
      success: true,
      referenceCode: generateReferenceCode(),
      message: "Your booking enquiry has been received!",
    };
  }

  // 3. Sanitize inputs
  const sanitized = {
    tourId: data.tourId || undefined,
    tourName: sanitizeText(data.tourName),
    startDate: data.startDate,
    duration: data.duration,
    guests: data.guests,
    specialRequests: data.specialRequests
      ? sanitizeText(data.specialRequests)
      : undefined,
    guestName: sanitizeText(data.guestName),
    email: sanitizeEmail(data.email) ?? data.email,
    phone: sanitizePhone(data.phone),
    nationality: sanitizeText(data.nationality),
  };

  // 4. Generate unique reference code
  const referenceCode = generateReferenceCode();

  // 5. Persist booking to database
  try {
    await db.insert(bookings).values({
      id: crypto.randomUUID(),
      referenceCode,
      tourId: sanitized.tourId ?? null,
      userId: null,
      guestName: sanitized.guestName,
      email: sanitized.email,
      phone: sanitized.phone || null,
      startDate: sanitized.startDate,
      endDate: null,
      guests: sanitized.guests,
      specialRequests: sanitized.specialRequests ?? null,
      status: "inquiry",
      totalPrice: null,
      adminNotes: `Nationality: ${sanitized.nationality}. Tour: ${sanitized.tourName}. Duration: ${sanitized.duration} days.`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (dbError) {
    console.error("[Booking] DB insert failed:", dbError);
    // Continue even if DB fails — emails are more important for the client
  }

  // 6. Send emails
  try {
    await Promise.all([
      sendBookingNotificationToAdmin(
        {
          tourId: sanitized.tourId,
          tourName: sanitized.tourName,
          startDate: sanitized.startDate,
          duration: sanitized.duration,
          guests: sanitized.guests,
          specialRequests: sanitized.specialRequests,
          guestName: sanitized.guestName,
          email: sanitized.email,
          phone: sanitized.phone,
          nationality: sanitized.nationality,
        },
        referenceCode
      ),
      sendBookingConfirmationToGuest(
        {
          tourId: sanitized.tourId,
          tourName: sanitized.tourName,
          startDate: sanitized.startDate,
          duration: sanitized.duration,
          guests: sanitized.guests,
          specialRequests: sanitized.specialRequests,
          guestName: sanitized.guestName,
          email: sanitized.email,
          phone: sanitized.phone,
          nationality: sanitized.nationality,
        },
        referenceCode
      ),
    ]);
  } catch (emailError) {
    console.error("[Booking] Email send failed:", emailError);
    return {
      success: true,
      referenceCode,
      message:
        "Your booking enquiry was received! Reference: " + referenceCode,
    };
  }

  return {
    success: true,
    referenceCode,
    message: `Your booking enquiry has been submitted! Reference: ${referenceCode}. Check your email for confirmation.`,
  };
}

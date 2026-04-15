"use server";

import { z } from "zod";
import { contactSchema } from "@/lib/validations";
import { isBot } from "@/lib/honeypot";
import { sanitizeText, sanitizeEmail, sanitizePhone } from "@/lib/sanitize";
import {
  sendContactNotificationToAdmin,
  sendContactAutoReply,
} from "@/lib/email";
import { db } from "@/db";
import { contactSubmissions } from "@/db/schema";

export type ContactActionResult =
  | { success: true; message: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function submitContactForm(
  formData: unknown
): Promise<ContactActionResult> {
  // 1. Parse and validate with Zod
  const parsed = contactSchema.safeParse(formData);
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
    // Silently accept — don't reveal detection to bots
    return { success: true, message: "Thank you for your message!" };
  }

  // 3. Sanitize inputs
  const sanitized = {
    name: sanitizeText(data.name),
    email: sanitizeEmail(data.email) ?? data.email,
    phone: data.phone ? sanitizePhone(data.phone) : undefined,
    subject: sanitizeText(data.subject),
    message: sanitizeText(data.message),
  };

  // 4. Persist to database
  try {
    await db.insert(contactSubmissions).values({
      id: crypto.randomUUID(),
      name: sanitized.name,
      email: sanitized.email,
      phone: sanitized.phone ?? null,
      subject: sanitized.subject,
      message: sanitized.message,
      createdAt: new Date(),
    });
  } catch (dbError) {
    console.error("[Contact] DB insert failed:", dbError);
    // Don't block the user — still send emails even if DB fails
  }

  // 5. Send emails (in parallel for speed)
  try {
    await Promise.all([
      sendContactNotificationToAdmin({ ...sanitized, subject: sanitized.subject }),
      sendContactAutoReply({ ...sanitized, subject: sanitized.subject }),
    ]);
  } catch (emailError) {
    console.error("[Contact] Email send failed:", emailError);
    // Form was submitted successfully even if email fails
    return {
      success: true,
      message:
        "Your message was received. We'll be in touch soon!",
    };
  }

  return {
    success: true,
    message:
      "Thank you for your message! We'll get back to you within 24 hours.",
  };
}

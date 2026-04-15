import { z } from "zod";

/* ── Contact Form ─────────────────────────────────────────────────────────── */

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(254, "Email is too long")
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(150, "Subject is too long")
    .trim(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long")
    .trim(),
  // Honeypot fields — must be empty
  website: z.string().max(0, "Bot detected").optional(),
  url_field: z.string().max(0, "Bot detected").optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

/* ── Booking Form — Step 1: Trip Details ─────────────────────────────────── */

export const bookingStep1Schema = z.object({
  tourId: z.string().uuid("Invalid tour selection").optional().or(z.literal("")),
  tourName: z
    .string()
    .min(2, "Please enter the tour or trip type")
    .max(150)
    .trim(),
  startDate: z
    .string()
    .refine((val) => {
      const d = new Date(val);
      return d > new Date();
    }, "Start date must be in the future"),
  duration: z
    .number({ error: "Duration is required" })
    .int()
    .min(1, "Minimum 1 day")
    .max(30, "Maximum 30 days"),
  guests: z
    .number({ error: "Guest count is required" })
    .int()
    .min(1, "At least 1 guest")
    .max(20, "Maximum 20 guests"),
  specialRequests: z.string().max(1000, "Too long").optional().or(z.literal("")),
});

export type BookingStep1Data = z.infer<typeof bookingStep1Schema>;

/* ── Booking Form — Step 2: Personal Information ─────────────────────────── */

export const bookingStep2Schema = z.object({
  guestName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(254)
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .min(7, "Phone number is too short")
    .max(20, "Phone number is too long")
    .regex(/^[\d+\-\s()]+$/, "Invalid phone number format"),
  nationality: z
    .string()
    .min(2, "Nationality is required")
    .max(60)
    .trim(),
  // Honeypot
  website: z.string().max(0, "Bot detected").optional(),
});

export type BookingStep2Data = z.infer<typeof bookingStep2Schema>;

/* ── Full Booking (merged for server action) ─────────────────────────────── */

export const bookingSchema = bookingStep1Schema.merge(bookingStep2Schema);

export type BookingFormData = z.infer<typeof bookingSchema>;

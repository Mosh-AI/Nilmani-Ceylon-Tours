import { Resend } from "resend";
import type { ContactFormData, BookingFormData } from "./validations";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "Nilmani Ceylon Tours <tours@nilmaniceylontours.com>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "roshan@nilmaniceylontours.com";

/* ── Shared HTML wrapper ─────────────────────────────────────────────────── */

function htmlWrapper(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:#1C1209;padding:32px 40px;text-align:center;">
              <p style="margin:0;font-family:'Georgia',serif;font-size:22px;color:#C9A84C;letter-spacing:2px;text-transform:uppercase;">
                Nilmani Ceylon Tours
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#8B7355;letter-spacing:1px;">
                LUXURY SRI LANKA TRAVEL
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;color:#2C1810;font-size:15px;line-height:1.7;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#F9F6F0;padding:24px 40px;text-align:center;border-top:1px solid #E5DDD0;">
              <p style="margin:0;font-size:12px;color:#8B7355;">
                Nilmani Ceylon Tours · Seeduwa, Sri Lanka<br />
                <a href="https://nilmaniceylontours.com" style="color:#C9A84C;">nilmaniceylontours.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;font-weight:bold;width:140px;color:#5C4033;vertical-align:top;">${label}:</td>
    <td style="padding:8px 0;color:#2C1810;">${value}</td>
  </tr>`;
}

/* ── Contact Form Emails ─────────────────────────────────────────────────── */

/** Send notification to admin when a contact form is submitted. */
export async function sendContactNotificationToAdmin(data: ContactFormData) {
  const body = `
    <h2 style="margin:0 0 24px;font-size:20px;color:#1C1209;">New Contact Enquiry</h2>
    <table cellpadding="0" cellspacing="0" width="100%">
      ${row("Name", data.name)}
      ${row("Email", `<a href="mailto:${data.email}" style="color:#C9A84C;">${data.email}</a>`)}
      ${data.phone ? row("Phone", data.phone) : ""}
      ${row("Subject", data.subject)}
      ${row("Message", `<div style="background:#F9F6F0;padding:12px;border-radius:4px;white-space:pre-wrap;">${data.message}</div>`)}
    </table>
    <p style="margin:24px 0 0;">
      <a href="mailto:${data.email}" style="background:#C9A84C;color:#1C1209;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:bold;display:inline-block;">
        Reply to ${data.name}
      </a>
    </p>`;

  return resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    replyTo: data.email,
    subject: `[Contact] ${data.subject} — ${data.name}`,
    html: htmlWrapper("New Contact Enquiry", body),
  });
}

/** Send auto-reply to the guest who submitted the contact form. */
export async function sendContactAutoReply(data: ContactFormData) {
  const body = `
    <p>Dear ${data.name},</p>
    <p>Thank you for reaching out to Nilmani Ceylon Tours. We have received your message and will get back to you within <strong>24 hours</strong>.</p>
    <p>For urgent enquiries, you can also reach us via WhatsApp:</p>
    <p>
      <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "94XXXXXXXXX"}"
         style="background:#25D366;color:#FFFFFF;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:bold;display:inline-block;">
        Chat on WhatsApp
      </a>
    </p>
    <hr style="border:none;border-top:1px solid #E5DDD0;margin:24px 0;" />
    <p style="color:#8B7355;font-size:13px;">
      <strong>Your message:</strong><br />
      ${data.message}
    </p>`;

  return resend.emails.send({
    from: FROM,
    to: data.email,
    subject: "We received your enquiry — Nilmani Ceylon Tours",
    html: htmlWrapper("Thank You for Contacting Us", body),
  });
}

/* ── Booking Form Emails ─────────────────────────────────────────────────── */

/** Send booking notification to admin. */
export async function sendBookingNotificationToAdmin(
  data: BookingFormData,
  referenceCode: string
) {
  const body = `
    <h2 style="margin:0 0 24px;font-size:20px;color:#1C1209;">New Booking Enquiry</h2>
    <p style="background:#F0EBE0;padding:12px 16px;border-radius:4px;font-family:monospace;font-size:16px;display:inline-block;color:#1C1209;">
      Ref: <strong>${referenceCode}</strong>
    </p>
    <h3 style="margin:24px 0 12px;color:#5C4033;">Trip Details</h3>
    <table cellpadding="0" cellspacing="0" width="100%">
      ${row("Tour", data.tourName)}
      ${row("Start Date", data.startDate)}
      ${row("Duration", `${data.duration} day${data.duration > 1 ? "s" : ""}`)}
      ${row("Guests", String(data.guests))}
      ${data.specialRequests ? row("Special Requests", data.specialRequests) : ""}
    </table>
    <h3 style="margin:24px 0 12px;color:#5C4033;">Guest Information</h3>
    <table cellpadding="0" cellspacing="0" width="100%">
      ${row("Name", data.guestName)}
      ${row("Email", `<a href="mailto:${data.email}" style="color:#C9A84C;">${data.email}</a>`)}
      ${row("Phone", `<a href="tel:${data.phone}" style="color:#C9A84C;">${data.phone}</a>`)}
      ${row("Nationality", data.nationality)}
    </table>
    <p style="margin:24px 0 0;">
      <a href="mailto:${data.email}" style="background:#C9A84C;color:#1C1209;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:bold;display:inline-block;">
        Reply to ${data.guestName}
      </a>
    </p>`;

  return resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    replyTo: data.email,
    subject: `[Booking] ${referenceCode} — ${data.guestName} — ${data.tourName}`,
    html: htmlWrapper("New Booking Enquiry", body),
  });
}

/* ── Booking Status Change Email ────────────────────────────────────────── */

const STATUS_MESSAGES: Record<string, { subject: (ref: string) => string; body: (ref: string, name: string) => string }> = {
  quoted: {
    subject: (ref: string) => `Your quote is ready — Ref: ${ref}`,
    body: (ref, name) => `
      <p>Dear ${name},</p>
      <p>Your personalised quote for booking <strong>${ref}</strong> is ready. Roshan will be in touch shortly with the full details.</p>
      <p>Have questions? <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "94XXXXXXXXX"}" style="color:#C9A84C;">Chat on WhatsApp</a></p>`,
  },
  confirmed: {
    subject: (ref: string) => `Booking Confirmed! — Ref: ${ref}`,
    body: (ref, name) => `
      <p>Dear ${name},</p>
      <p>Great news! Your Sri Lanka journey (Ref: <strong>${ref}</strong>) has been <strong>confirmed</strong>. We can't wait to welcome you!</p>
      <p>Your itinerary and final details will follow shortly. In the meantime, feel free to reach us via WhatsApp.</p>
      <p><a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "94XXXXXXXXX"}" style="background:#25D366;color:#fff;padding:10px 20px;border-radius:4px;text-decoration:none;font-weight:bold;display:inline-block;">WhatsApp Roshan</a></p>`,
  },
  completed: {
    subject: (ref: string) => `Thank you for travelling with us — Ref: ${ref}`,
    body: (ref, name) => `
      <p>Dear ${name},</p>
      <p>We hope you had a wonderful time exploring Sri Lanka! Thank you for choosing Nilmani Ceylon Tours for your journey (Ref: ${ref}).</p>
      <p>We'd love to hear about your experience. A quick review on TripAdvisor would mean the world to us.</p>`,
  },
  cancelled: {
    subject: (ref: string) => `Booking Cancelled — Ref: ${ref}`,
    body: (ref, name) => `
      <p>Dear ${name},</p>
      <p>Your booking <strong>${ref}</strong> has been cancelled as requested. If this was a mistake or you'd like to rebook, please contact us.</p>
      <p><a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "94XXXXXXXXX"}" style="color:#C9A84C;">Contact us on WhatsApp</a></p>`,
  },
};

export async function sendBookingStatusUpdateEmail(
  guestEmail: string,
  guestName: string,
  referenceCode: string,
  newStatus: string
) {
  const template = STATUS_MESSAGES[newStatus];
  if (!template) return; // No email for intermediate statuses

  const subject = template.subject(referenceCode);
  const body = template.body(referenceCode, guestName);

  return resend.emails.send({
    from: FROM,
    to: guestEmail,
    subject,
    html: htmlWrapper(subject, body),
  });
}

/** Send booking confirmation to the guest. */
export async function sendBookingConfirmationToGuest(
  data: BookingFormData,
  referenceCode: string
) {
  const body = `
    <p>Dear ${data.guestName},</p>
    <p>Thank you for choosing Nilmani Ceylon Tours! We have received your booking enquiry and will send you a detailed quote within <strong>24 hours</strong>.</p>
    <p style="background:#F0EBE0;padding:12px 16px;border-radius:4px;font-family:monospace;font-size:16px;color:#1C1209;">
      Your Reference: <strong>${referenceCode}</strong>
    </p>
    <p>Please keep this reference number safe — you will need it for all future correspondence.</p>
    <h3 style="margin:24px 0 12px;color:#5C4033;">Your Booking Summary</h3>
    <table cellpadding="0" cellspacing="0" width="100%">
      ${row("Tour", data.tourName)}
      ${row("Start Date", data.startDate)}
      ${row("Duration", `${data.duration} day${data.duration > 1 ? "s" : ""}`)}
      ${row("Guests", String(data.guests))}
    </table>
    <p style="margin:24px 0 0;">
      <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "94XXXXXXXXX"}"
         style="background:#25D366;color:#FFFFFF;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:bold;display:inline-block;">
        Chat on WhatsApp
      </a>
    </p>`;

  return resend.emails.send({
    from: FROM,
    to: data.email,
    subject: `Booking Confirmed — Ref: ${referenceCode} | Nilmani Ceylon Tours`,
    html: htmlWrapper("Booking Enquiry Received", body),
  });
}

/* ── Google Maps usage alerts ─────────────────────────────────────────────── */

export function sendMapVisitorAlert(
  currentCount: number,
  threshold: number,
  to: string
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nilmaniceylontours.skymaxsolution.com";
  const body = `
    <h2 style="color:#1C1209;font-size:20px;margin:0 0 16px;">Customize Tour Visitor Milestone</h2>
    <p>Your <strong>Customize Your Tour</strong> page has reached
       <strong style="color:#C9A84C;">${currentCount.toLocaleString()} visitors</strong> this month,
       approaching your alert threshold of ${threshold.toLocaleString()}.</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
      ${row("This Month", `${currentCount.toLocaleString()} visitors`)}
      ${row("Alert Threshold", `${threshold.toLocaleString()} visitors`)}
    </table>
    <p>Monitor usage and adjust thresholds from your admin dashboard:</p>
    <p>
      <a href="${siteUrl}/admin/maps-monitor"
         style="background:#C9A84C;color:#1C1209;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:bold;display:inline-block;">
        View Maps Monitor
      </a>
    </p>`;
  return resend.emails.send({
    from: FROM,
    to,
    subject: `[Nilmani Maps] Customize Tour reached ${currentCount.toLocaleString()} visitors this month`,
    html: htmlWrapper("Maps Visitor Alert", body),
  });
}

export function sendMapFreeTierAlert(
  currentCount: number,
  autoDisableAt: number,
  to: string
) {
  const freeTierLimit = 28500;
  const pct = Math.round((currentCount / freeTierLimit) * 100);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nilmaniceylontours.skymaxsolution.com";
  const body = `
    <h2 style="color:#C9A84C;font-size:20px;margin:0 0 16px;">⚠ Approaching Google Maps Free Tier</h2>
    <p>Your Google Maps usage this month is nearing the free-tier limit. If it exceeds
       <strong>${autoDisableAt.toLocaleString()}</strong> map loads, Google Maps will be
       <strong>automatically disabled</strong> and the page will switch to the built-in SVG map.</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
      ${row("Current Usage", `${currentCount.toLocaleString()} map loads (${pct}% of free tier)`)}
      ${row("Free Tier Limit", `~${freeTierLimit.toLocaleString()} map loads / month`)}
      ${row("Auto-disable At", `${autoDisableAt.toLocaleString()} map loads`)}
    </table>
    <p>You can raise the auto-disable threshold or manually disable Google Maps now:</p>
    <p>
      <a href="${siteUrl}/admin/maps-monitor"
         style="background:#C9A84C;color:#1C1209;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:bold;display:inline-block;">
        Manage Maps Settings
      </a>
    </p>`;
  return resend.emails.send({
    from: FROM,
    to,
    subject: `[Nilmani Maps] ⚠ Approaching Google Maps free tier (${pct}% used)`,
    html: htmlWrapper("Maps Free Tier Warning", body),
  });
}

export function sendMapAutoDisabledEmail(to: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nilmaniceylontours.skymaxsolution.com";
  const body = `
    <h2 style="color:#c0392b;font-size:20px;margin:0 0 16px;">🔴 Google Maps Auto-Disabled</h2>
    <p>To protect you from unexpected Google Maps billing charges, the Google Maps feature on
       your <strong>Customize Your Tour</strong> page has been <strong>automatically disabled</strong>
       for this month.</p>
    <p>The page is now showing the <strong>built-in SVG map</strong> as a fallback — your visitors
       can still use the full route-finding feature.</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
      ${row("Action Taken", "Google Maps disabled, SVG map active")}
      ${row("Resets", "At the start of next month you can re-enable from the admin panel")}
    </table>
    <p>
      <a href="${siteUrl}/admin/maps-monitor"
         style="background:#C9A84C;color:#1C1209;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:bold;display:inline-block;">
        Go to Maps Monitor
      </a>
    </p>`;
  return resend.emails.send({
    from: FROM,
    to,
    subject: `[Nilmani Maps] 🔴 Google Maps auto-disabled — free tier protection`,
    html: htmlWrapper("Google Maps Auto-Disabled", body),
  });
}

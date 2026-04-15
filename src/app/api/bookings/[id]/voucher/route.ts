import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/lib/user-auth";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * Returns a printable HTML voucher for a booking.
 * The user can open this in their browser and use Ctrl+P / Save as PDF.
 * Scoped by userId to prevent IDOR.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getUserSession();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  const [booking] = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.id, id), eq(bookings.userId, session.user.id)))
    .limit(1);

  if (!booking) {
    return new NextResponse("Not found", { status: 404 });
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Voucher — ${booking.referenceCode}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Georgia, serif; background: #fff; color: #1C1209; padding: 40px; max-width: 680px; margin: 0 auto; }
    .header { border-bottom: 2px solid #C9A84C; padding-bottom: 24px; margin-bottom: 24px; }
    .logo { font-size: 22px; letter-spacing: 3px; text-transform: uppercase; color: #1C1209; }
    .subtitle { font-size: 11px; letter-spacing: 2px; color: #8B7355; text-transform: uppercase; margin-top: 4px; }
    .ref { background: #F5F0E8; border-radius: 6px; padding: 12px 16px; font-family: monospace; font-size: 18px; font-weight: bold; display: inline-block; margin: 16px 0; }
    h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #8B7355; margin: 20px 0 10px; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 8px 0; border-bottom: 1px solid #F0EBE0; font-size: 14px; }
    td:first-child { color: #8B7355; width: 160px; }
    td:last-child { font-weight: 600; }
    .status { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; background: #F0EBE0; color: #5C4033; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #E5DDD0; font-size: 12px; color: #8B7355; }
    @media print { body { padding: 20px; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">Nilmani Ceylon Tours</div>
    <div class="subtitle">Luxury Sri Lanka Travel</div>
  </div>

  <h1 style="font-size:24px;font-weight:300;letter-spacing:1px;">Booking Voucher</h1>
  <div class="ref">${booking.referenceCode}</div>

  <h2>Trip Details</h2>
  <table>
    <tr><td>Guest Name</td><td>${booking.guestName}</td></tr>
    <tr><td>Start Date</td><td>${booking.startDate}</td></tr>
    <tr><td>Guests</td><td>${booking.guests}</td></tr>
    <tr><td>Status</td><td><span class="status">${(booking.status ?? "inquiry").replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span></td></tr>
    ${booking.totalPrice ? `<tr><td>Quoted Price</td><td>$${booking.totalPrice} USD</td></tr>` : ""}
    ${booking.specialRequests ? `<tr><td>Special Requests</td><td>${booking.specialRequests}</td></tr>` : ""}
  </table>

  <h2>Contact</h2>
  <table>
    <tr><td>Guide / Driver</td><td>Roshan Jayasuriya</td></tr>
    <tr><td>WhatsApp</td><td>+94 78 782 9952</td></tr>
    <tr><td>Email</td><td>nilmaniceylontours@gmail.com</td></tr>
    <tr><td>Website</td><td>nilmaniceylontours.com</td></tr>
  </table>

  <div class="footer">
    <p>Generated on ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
    <p style="margin-top:6px;">Please keep this voucher for your records. Present your reference code to your guide on arrival.</p>
  </div>

  <div class="no-print" style="margin-top:24px;text-align:center;">
    <button onclick="window.print()" style="background:#1C1209;color:#C9A84C;border:none;padding:12px 28px;border-radius:24px;font-size:14px;font-weight:600;cursor:pointer;letter-spacing:1px;">
      Print / Save as PDF
    </button>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

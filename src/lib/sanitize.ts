/* ── Input Sanitization + Reference Code Generator ── */

/**
 * Strip HTML tags and dangerous characters from user input.
 * Used on all form fields before storage or email sending.
 */
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/[&<>"'`]/g, (char) => {
      const map: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;",
      };
      return map[char] ?? char;
    })
    .trim()
    .slice(0, 2000); // hard cap to prevent oversized payloads
}

/**
 * Normalise and validate an email address.
 * Returns the lowercase-trimmed email or null if invalid.
 */
export function sanitizeEmail(input: string): string | null {
  const trimmed = input.trim().toLowerCase().slice(0, 254);
  // RFC 5322 simplified — good enough for form validation
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(trimmed) ? trimmed : null;
}

/**
 * Sanitize a phone number — keep only digits, +, -, spaces, parentheses.
 */
export function sanitizePhone(input: string): string {
  return input.replace(/[^\d+\-\s()]/g, "").trim().slice(0, 20);
}

/**
 * Generate a unique booking reference code.
 * Format: NCT-YYYYMMDD-XXXXX (e.g. NCT-20260415-A3K9F)
 * Collision probability is negligible for expected booking volume.
 */
export function generateReferenceCode(): string {
  const date = new Date();
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // exclude ambiguous I/O/1/0
  let random = "";
  for (let i = 0; i < 5; i++) {
    random += chars[Math.floor(Math.random() * chars.length)];
  }
  return `NCT-${datePart}-${random}`;
}

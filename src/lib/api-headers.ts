/* ── Security Headers for API Responses ── */

/**
 * Standard security headers to attach to all API route responses.
 * These complement the Nginx headers for direct Next.js API routes.
 */
export const API_SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "Pragma": "no-cache",
};

/**
 * Return a NextResponse-compatible headers object for JSON API responses.
 * Usage: return NextResponse.json(data, { headers: apiHeaders() })
 */
export function apiHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    ...API_SECURITY_HEADERS,
    "Content-Type": "application/json",
    ...extra,
  };
}

/**
 * Return headers for successful form submission responses.
 */
export function formResponseHeaders(): Record<string, string> {
  return apiHeaders();
}

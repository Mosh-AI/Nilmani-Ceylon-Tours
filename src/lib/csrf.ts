/* ── CSRF Protection ── */

/** Validate that the request Origin matches our site URL */
export function validateOrigin(request: Request): boolean {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // In development, allow localhost
  if (process.env.NODE_ENV === "development") {
    const devOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
    if (origin && devOrigins.some((o) => origin.startsWith(o))) return true;
    if (referer && devOrigins.some((o) => referer.startsWith(o))) return true;
  }

  // Check Origin header (preferred)
  if (origin) {
    return origin === siteUrl || origin === siteUrl.replace(/\/$/, "");
  }

  // Fallback to Referer header
  if (referer) {
    return referer.startsWith(siteUrl);
  }

  // No Origin or Referer — reject for state-changing requests
  return false;
}

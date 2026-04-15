// Sentry initialization helper
// Usage: import and call in sentry.client.config.ts and sentry.server.config.ts

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

export const sentryConfig = {
  dsn: SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0,
};

/** Fields that should be scrubbed from Sentry event data to protect PII. */
const PII_FIELDS = new Set([
  "email",
  "password",
  "phone",
  "token",
  "authorization",
  "cookie",
  "creditCard",
  "credit_card",
]);

/**
 * Recursively scrub PII fields from an object.
 * Returns a shallow clone with sensitive values replaced by "[Filtered]".
 */
export function scrubPii(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (PII_FIELDS.has(key.toLowerCase())) {
      cleaned[key] = "[Filtered]";
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      cleaned[key] = scrubPii(value as Record<string, unknown>);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

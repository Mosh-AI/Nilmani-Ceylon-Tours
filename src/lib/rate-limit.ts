/* ── Rate Limiting Utilities ── */

import { RateLimiterMemory } from "rate-limiter-flexible";

/** 5 requests per minute — for login/register */
export const authLimiter = new RateLimiterMemory({
  points: 5,
  duration: 60,
});

/** 5 requests per minute — for contact/booking forms */
export const formLimiter = new RateLimiterMemory({
  points: 5,
  duration: 60,
});

/** 60 requests per minute — for public GET APIs */
export const apiLimiter = new RateLimiterMemory({
  points: 60,
  duration: 60,
});

/** 30 requests per minute — for admin API routes */
export const adminLimiter = new RateLimiterMemory({
  points: 30,
  duration: 60,
});

/** Extract real client IP from request headers */
export function getClientIp(request: Request): string {
  const headers = request.headers;
  return (
    headers.get("cf-connecting-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}

/** Check if a request exceeds the rate limit */
export async function checkRateLimit(
  limiter: RateLimiterMemory,
  key: string
): Promise<{ success: boolean; retryAfter?: number }> {
  try {
    await limiter.consume(key);
    return { success: true };
  } catch (rateLimiterRes) {
    const res = rateLimiterRes as { msBeforeNext?: number };
    return {
      success: false,
      retryAfter: Math.ceil((res.msBeforeNext ?? 60000) / 1000),
    };
  }
}

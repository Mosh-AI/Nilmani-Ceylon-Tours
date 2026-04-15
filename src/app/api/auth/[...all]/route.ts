import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/integrations/next-js";

/**
 * Better Auth catch-all route handler.
 * Handles all /api/auth/* endpoints (sign-in, sign-up, sign-out,
 * session, callback, verify-email, etc.)
 */
export const { GET, POST } = toNextJsHandler(auth);

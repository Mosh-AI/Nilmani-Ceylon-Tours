import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Server-side user guard (any authenticated user).
 * Redirects to /login if not authenticated.
 */
export async function requireUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return session;
}

/**
 * Get session without redirecting.
 */
export async function getUserSession() {
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch {
    return null;
  }
}

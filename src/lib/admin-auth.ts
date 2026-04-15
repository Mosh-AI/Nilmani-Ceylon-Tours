import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Server-side admin guard.
 * Call at the top of every admin Server Component / Route Handler.
 * Redirects to /login if not authenticated or not an admin.
 */
export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?callbackUrl=/admin");
  }

  // Better Auth puts the role in session.user via additionalFields
  const role = (session.user as { role?: string }).role;
  if (role !== "admin") {
    redirect("/");
  }

  return session;
}

/**
 * Get session without redirecting — for optional auth checks.
 * Returns null if not authenticated.
 */
export async function getAdminSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (!session || role !== "admin") return null;
    return session;
  } catch {
    return null;
  }
}

/* ── Better Auth Client (React) ── */

"use client";

import { createAuthClient } from "better-auth/client/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
});

export const {
  useSession,
  signIn,
  signUp,
  signOut,
} = authClient;

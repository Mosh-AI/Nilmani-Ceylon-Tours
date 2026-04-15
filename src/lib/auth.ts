/* ── Better Auth Server Configuration ── */

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle-adapter";
import { db } from "@/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),

  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  /* ── Email + Password ── */
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
    maxPasswordLength: 128,
    autoSignIn: true,
  },

  /* ── Social Providers ── */
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },

  /* ── Session ── */
  session: {
    expiresIn: 86400, // 24 hours in seconds
    updateAge: 3600,  // refresh session token every hour
  },

  /* ── Email Verification ── */
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      // Resend integration will be added in the email phase.
      // For now, log to console in development.
      if (process.env.NODE_ENV === "development") {
        console.log(`[Auth] Verification email for ${user.email}: ${url}`);
      }
    },
    sendOnSignUp: true,
  },

  /* ── User Schema Extension ── */
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false, // cannot be set by the client
      },
    },
  },

  /* ── Account Linking ── */
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },

  /* ── Rate Limiting ── */
  rateLimit: {
    enabled: true,
    window: 60,
    max: 30,
    customRules: {
      "/api/auth/sign-in/email": {
        window: 900, // 15 min lockout window
        max: 5,      // 5 attempts before lockout
      },
      "/api/auth/sign-up/email": {
        window: 3600,
        max: 3,
      },
    },
  },

  /* ── Advanced / Security ── */
  advanced: {
    defaultCookieAttributes: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
    },
  },
});

export type Auth = typeof auth;

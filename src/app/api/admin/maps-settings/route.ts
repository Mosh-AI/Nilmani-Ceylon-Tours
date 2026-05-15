import { NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { getAdminSession } from "@/lib/admin-auth";
import { apiHeaders } from "@/lib/api-headers";
import { z } from "zod";
import { sanitizeText } from "@/lib/sanitize";

const MAPS_KEYS = [
  "google_maps_enabled",
  "maps_alert_email",
  "maps_monthly_visitor_threshold",
  "maps_free_tier_alert_threshold",
  "maps_auto_disable_threshold",
] as const;

const updateSchema = z.object({
  google_maps_enabled: z.enum(["true", "false"]).optional(),
  maps_alert_email: z
    .string()
    .email({ message: "Valid email required" })
    .optional(),
  maps_monthly_visitor_threshold: z.coerce
    .number({ message: "Must be a number" })
    .min(1)
    .max(28000)
    .optional(),
  maps_free_tier_alert_threshold: z.coerce
    .number({ message: "Must be a number" })
    .min(1)
    .max(28000)
    .optional(),
  maps_auto_disable_threshold: z.coerce
    .number({ message: "Must be a number" })
    .min(1)
    .max(28500)
    .optional(),
});

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });
  }

  const rows = await db
    .select({ key: siteSettings.key, value: siteSettings.value })
    .from(siteSettings)
    .where(inArray(siteSettings.key, [...MAPS_KEYS]));

  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return NextResponse.json({ settings }, { headers: apiHeaders() });
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers: apiHeaders() });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422, headers: apiHeaders() }
    );
  }

  const data = parsed.data;
  const upserts: Array<{ key: string; value: string; updatedAt: Date }> = [];

  if (data.google_maps_enabled !== undefined) {
    upserts.push({ key: "google_maps_enabled", value: data.google_maps_enabled, updatedAt: new Date() });
  }
  if (data.maps_alert_email !== undefined) {
    upserts.push({ key: "maps_alert_email", value: sanitizeText(data.maps_alert_email), updatedAt: new Date() });
  }
  if (data.maps_monthly_visitor_threshold !== undefined) {
    upserts.push({ key: "maps_monthly_visitor_threshold", value: String(data.maps_monthly_visitor_threshold), updatedAt: new Date() });
  }
  if (data.maps_free_tier_alert_threshold !== undefined) {
    upserts.push({ key: "maps_free_tier_alert_threshold", value: String(data.maps_free_tier_alert_threshold), updatedAt: new Date() });
  }
  if (data.maps_auto_disable_threshold !== undefined) {
    upserts.push({ key: "maps_auto_disable_threshold", value: String(data.maps_auto_disable_threshold), updatedAt: new Date() });
  }

  for (const row of upserts) {
    await db
      .insert(siteSettings)
      .values(row)
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: row.value, updatedAt: row.updatedAt },
      });
  }

  return NextResponse.json({ ok: true }, { headers: apiHeaders() });
}

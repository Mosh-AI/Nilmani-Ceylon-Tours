import { db } from "@/db";
import { mapUsageLogs, siteSettings } from "@/db/schema";
import { eq, gte, sql } from "drizzle-orm";
import {
  sendMapVisitorAlert,
  sendMapFreeTierAlert,
  sendMapAutoDisabledEmail,
} from "@/lib/email";

// ── Helpers ───────────────────────────────────────────────────────────────────

function currentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function currentMonthStart(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
}

function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

async function readSetting(key: string): Promise<string | null> {
  const rows = await db
    .select({ value: siteSettings.value })
    .from(siteSettings)
    .where(eq(siteSettings.key, key));
  return rows[0]?.value ?? null;
}

async function writeSetting(key: string, value: string): Promise<void> {
  await db
    .insert(siteSettings)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value, updatedAt: new Date() },
    });
}

// ── Main export: called fire-and-forget from the customize page ───────────────

export async function trackMapLoad(): Promise<void> {
  try {
    // 1. Upsert today's count
    await db
      .insert(mapUsageLogs)
      .values({ date: todayString(), pageViews: 1 })
      .onConflictDoUpdate({
        target: mapUsageLogs.date,
        set: {
          pageViews: sql`map_usage_logs.page_views + 1`,
          updatedAt: new Date(),
        },
      });

    // 2. Sum current month
    const rows = await db
      .select({ total: sql<number>`coalesce(sum(${mapUsageLogs.pageViews}), 0)` })
      .from(mapUsageLogs)
      .where(gte(mapUsageLogs.date, currentMonthStart()));
    const total = Number(rows[0]?.total ?? 0);

    // 3. Read settings
    const [
      alertEmail,
      visitorThresholdStr,
      freeTierAlertStr,
      autoDisableStr,
      visitorAlertMonth,
      freeTierAlertMonth,
      autoDisabledMonth,
      mapsEnabled,
    ] = await Promise.all([
      readSetting("maps_alert_email"),
      readSetting("maps_monthly_visitor_threshold"),
      readSetting("maps_free_tier_alert_threshold"),
      readSetting("maps_auto_disable_threshold"),
      readSetting("maps_visitor_alert_sent_month"),
      readSetting("maps_free_tier_alert_sent_month"),
      readSetting("maps_auto_disabled_month"),
      readSetting("google_maps_enabled"),
    ]);

    const email = alertEmail ?? "mtulanka@gmail.com";
    const visitorThreshold = parseInt(visitorThresholdStr ?? "400");
    const freeTierAlert = parseInt(freeTierAlertStr ?? "24000");
    const autoDisableAt = parseInt(autoDisableStr ?? "27000");
    const thisMonth = currentMonthKey();

    // 4. Auto-disable (highest priority)
    if (total >= autoDisableAt) {
      if (mapsEnabled !== "false") {
        await writeSetting("google_maps_enabled", "false");
      }
      if (autoDisabledMonth !== thisMonth) {
        await writeSetting("maps_auto_disabled_month", thisMonth);
        await sendMapAutoDisabledEmail(email);
      }
      return; // no need to check other thresholds
    }

    // 5. Free-tier approach alert
    if (total >= freeTierAlert && freeTierAlertMonth !== thisMonth) {
      await writeSetting("maps_free_tier_alert_sent_month", thisMonth);
      await sendMapFreeTierAlert(total, autoDisableAt, email);
    }

    // 6. Visitor milestone alert
    if (total >= visitorThreshold && visitorAlertMonth !== thisMonth) {
      await writeSetting("maps_visitor_alert_sent_month", thisMonth);
      await sendMapVisitorAlert(total, visitorThreshold, email);
    }
  } catch {
    // Tracking must never crash the page render
  }
}

// ── Analytics queries (for admin monitor page) ────────────────────────────────

export async function getCurrentMonthTotal(): Promise<number> {
  const rows = await db
    .select({ total: sql<number>`coalesce(sum(${mapUsageLogs.pageViews}), 0)` })
    .from(mapUsageLogs)
    .where(gte(mapUsageLogs.date, currentMonthStart()));
  return Number(rows[0]?.total ?? 0);
}

export interface DailyUsage {
  date: string;
  pageViews: number;
}

export async function getLast30DaysUsage(): Promise<DailyUsage[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 29);
  const cutoffStr = cutoff.toISOString().split("T")[0];

  const rows = await db
    .select({ date: mapUsageLogs.date, pageViews: mapUsageLogs.pageViews })
    .from(mapUsageLogs)
    .where(gte(mapUsageLogs.date, cutoffStr))
    .orderBy(mapUsageLogs.date);

  // Fill in zero days for dates with no records
  const byDate = new Map(rows.map((r) => [r.date, r.pageViews]));
  const result: DailyUsage[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    result.push({ date: key, pageViews: byDate.get(key) ?? 0 });
  }
  return result;
}

export interface MonthlyUsage {
  month: string; // "2026-05"
  total: number;
}

export async function getMonthlyUsage(monthsBack = 3): Promise<MonthlyUsage[]> {
  const result: MonthlyUsage[] = [];
  for (let i = 0; i < monthsBack; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthStart = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1)
      .toISOString()
      .split("T")[0];
    const rows = await db
      .select({ total: sql<number>`coalesce(sum(${mapUsageLogs.pageViews}), 0)` })
      .from(mapUsageLogs)
      .where(
        sql`${mapUsageLogs.date} >= ${monthStart} AND ${mapUsageLogs.date} < ${monthEnd}`
      );
    result.push({
      month: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      total: Number(rows[0]?.total ?? 0),
    });
  }
  return result.reverse();
}

export async function getMapSettings(): Promise<{
  enabled: boolean;
  alertEmail: string;
  visitorThreshold: number;
  freeTierAlertThreshold: number;
  autoDisableThreshold: number;
}> {
  const keys = [
    "google_maps_enabled",
    "maps_alert_email",
    "maps_monthly_visitor_threshold",
    "maps_free_tier_alert_threshold",
    "maps_auto_disable_threshold",
  ];
  const rows = await db
    .select({ key: siteSettings.key, value: siteSettings.value })
    .from(siteSettings)
    .where(sql`${siteSettings.key} = ANY(${keys})`);
  const s = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    enabled: s["google_maps_enabled"] !== "false",
    alertEmail: s["maps_alert_email"] ?? "mtulanka@gmail.com",
    visitorThreshold: parseInt(s["maps_monthly_visitor_threshold"] ?? "400"),
    freeTierAlertThreshold: parseInt(s["maps_free_tier_alert_threshold"] ?? "24000"),
    autoDisableThreshold: parseInt(s["maps_auto_disable_threshold"] ?? "27000"),
  };
}

import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { apiHeaders } from "@/lib/api-headers";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });

  const rows = await db.select().from(siteSettings);
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value ?? ""]));
  return NextResponse.json({ settings }, { headers: apiHeaders() });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });

  const body = await request.json() as Record<string, string>;

  for (const [key, value] of Object.entries(body)) {
    if (typeof key !== "string" || typeof value !== "string") continue;
    await db
      .insert(siteSettings)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value, updatedAt: new Date() },
      });
  }

  return NextResponse.json({ success: true }, { headers: apiHeaders() });
}

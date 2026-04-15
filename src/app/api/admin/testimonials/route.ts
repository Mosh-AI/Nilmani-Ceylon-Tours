import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { apiHeaders } from "@/lib/api-headers";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });

  const rows = await db
    .select()
    .from(testimonials)
    .orderBy(sql`${testimonials.createdAt} desc`);

  return NextResponse.json({ testimonials: rows }, { headers: apiHeaders() });
}

export async function PATCH(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });

  const { id, approved } = await request.json() as { id: string; approved: boolean };
  if (!id || typeof approved !== "boolean") {
    return NextResponse.json({ error: "Invalid data" }, { status: 400, headers: apiHeaders() });
  }

  await db.update(testimonials).set({ approved }).where(eq(testimonials.id, id));
  return NextResponse.json({ success: true }, { headers: apiHeaders() });
}

export async function DELETE(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });

  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400, headers: apiHeaders() });

  await db.delete(testimonials).where(eq(testimonials.id, id));
  return NextResponse.json({ success: true }, { headers: apiHeaders() });
}

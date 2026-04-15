import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { galleryImages } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { apiHeaders } from "@/lib/api-headers";
import { z } from "zod";

const addSchema = z.object({
  url: z.string().url().max(500),
  alt: z.string().max(200).optional().or(z.literal("")),
  category: z.string().max(100).optional().or(z.literal("")),
  sortOrder: z.number().int().min(0).optional(),
});

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });

  const rows = await db
    .select()
    .from(galleryImages)
    .orderBy(galleryImages.sortOrder, sql`${galleryImages.createdAt} asc`);

  return NextResponse.json({ images: rows }, { headers: apiHeaders() });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });

  const body = await request.json();
  const parsed = addSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400, headers: apiHeaders() });
  }

  const [image] = await db
    .insert(galleryImages)
    .values({
      id: crypto.randomUUID(),
      url: parsed.data.url,
      alt: parsed.data.alt || null,
      category: parsed.data.category || null,
      sortOrder: parsed.data.sortOrder ?? 0,
      createdAt: new Date(),
    })
    .returning();

  return NextResponse.json({ image }, { status: 201, headers: apiHeaders() });
}

export async function DELETE(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });

  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400, headers: apiHeaders() });

  await db.delete(galleryImages).where(eq(galleryImages.id, id));
  return NextResponse.json({ success: true }, { headers: apiHeaders() });
}

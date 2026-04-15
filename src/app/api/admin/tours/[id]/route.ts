import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { tours } from "@/db/schema";
import { eq } from "drizzle-orm";
import { apiHeaders } from "@/lib/api-headers";
import { z } from "zod";
import { sanitizeText } from "@/lib/sanitize";

const updateSchema = z.object({
  title: z.string().min(2).max(150).optional(),
  subtitle: z.string().max(200).optional().or(z.literal("")),
  description: z.string().min(10).max(5000).optional(),
  duration: z.number().int().min(1).max(60).optional(),
  price: z.number().int().min(0).optional(),
  difficulty: z.enum(["Easy", "Moderate", "Challenging"]).optional(),
  maxGroup: z.number().int().min(1).max(50).optional(),
  category: z.string().max(100).optional(),
  highlights: z.array(z.string()).optional(),
  whatsIncluded: z.array(z.string()).optional(),
  whatsExcluded: z.array(z.string()).optional(),
  heroImage: z.string().max(500).optional().or(z.literal("")),
  featured: z.boolean().optional(),
  available: z.boolean().optional(),
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
  focusKeyword: z.string().max(100).optional().or(z.literal("")),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });

  const { id } = await params;
  const [tour] = await db.select().from(tours).where(eq(tours.id, id)).limit(1);
  if (!tour) return NextResponse.json({ error: "Not found" }, { status: 404, headers: apiHeaders() });

  return NextResponse.json({ tour }, { headers: apiHeaders() });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });

  const { id } = await params;
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400, headers: apiHeaders() }
    );
  }

  const data = parsed.data;
  const updateData: Record<string, unknown> = { updatedAt: new Date() };

  if (data.title !== undefined) updateData.title = sanitizeText(data.title);
  if (data.subtitle !== undefined) updateData.subtitle = data.subtitle ? sanitizeText(data.subtitle) : null;
  if (data.description !== undefined) updateData.description = sanitizeText(data.description);
  if (data.duration !== undefined) updateData.duration = data.duration;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.difficulty !== undefined) updateData.difficulty = data.difficulty;
  if (data.maxGroup !== undefined) updateData.maxGroup = data.maxGroup;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.highlights !== undefined) updateData.highlights = JSON.stringify(data.highlights);
  if (data.whatsIncluded !== undefined) updateData.whatsIncluded = JSON.stringify(data.whatsIncluded);
  if (data.whatsExcluded !== undefined) updateData.whatsExcluded = JSON.stringify(data.whatsExcluded);
  if (data.heroImage !== undefined) updateData.heroImage = data.heroImage || null;
  if (data.featured !== undefined) updateData.featured = data.featured;
  if (data.available !== undefined) updateData.available = data.available;
  if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle || null;
  if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription || null;
  if (data.focusKeyword !== undefined) updateData.focusKeyword = data.focusKeyword || null;

  await db.update(tours).set(updateData).where(eq(tours.id, id));

  return NextResponse.json({ success: true }, { headers: apiHeaders() });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });

  const { id } = await params;
  await db.delete(tours).where(eq(tours.id, id));
  return NextResponse.json({ success: true }, { headers: apiHeaders() });
}

import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { tours } from "@/db/schema";
import { sql } from "drizzle-orm";
import { apiHeaders } from "@/lib/api-headers";
import { z } from "zod";
import { sanitizeText } from "@/lib/sanitize";

const tourSchema = z.object({
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  title: z.string().min(2).max(150),
  subtitle: z.string().max(200).optional().or(z.literal("")),
  description: z.string().min(10).max(5000),
  duration: z.number().int().min(1).max(60),
  price: z.number().int().min(0),
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

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });

  const rows = await db
    .select()
    .from(tours)
    .orderBy(sql`${tours.createdAt} desc`);

  return NextResponse.json({ tours: rows }, { headers: apiHeaders() });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });

  const body = await request.json();
  const parsed = tourSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400, headers: apiHeaders() }
    );
  }

  const data = parsed.data;

  const [tour] = await db
    .insert(tours)
    .values({
      id: crypto.randomUUID(),
      slug: data.slug,
      title: sanitizeText(data.title),
      subtitle: data.subtitle ? sanitizeText(data.subtitle) : null,
      description: sanitizeText(data.description),
      duration: data.duration,
      price: data.price,
      difficulty: data.difficulty ?? null,
      maxGroup: data.maxGroup ?? null,
      category: data.category ?? null,
      highlights: data.highlights ? JSON.stringify(data.highlights) : null,
      whatsIncluded: data.whatsIncluded ? JSON.stringify(data.whatsIncluded) : null,
      whatsExcluded: data.whatsExcluded ? JSON.stringify(data.whatsExcluded) : null,
      heroImage: data.heroImage || null,
      featured: data.featured ?? false,
      available: data.available ?? true,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      focusKeyword: data.focusKeyword || null,
      itinerary: null,
      faqs: null,
      images: null,
      priceUnit: "USD",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return NextResponse.json({ tour }, { status: 201, headers: apiHeaders() });
}

import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { apiHeaders } from "@/lib/api-headers";
import { z } from "zod";
import { sanitizeText } from "@/lib/sanitize";

function sanitizeBlogContent(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "")
    .slice(0, 100000);
}

const updateSchema = z.object({
  title: z.string().min(2).max(150).optional(),
  content: z.string().max(100000).optional().or(z.literal("")),
  excerpt: z.string().max(300).optional().or(z.literal("")),
  coverImage: z.string().max(500).optional().or(z.literal("")),
  published: z.boolean().optional(),
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
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404, headers: apiHeaders() });
  return NextResponse.json({ post }, { headers: apiHeaders() });
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
    return NextResponse.json({ error: "Invalid data" }, { status: 400, headers: apiHeaders() });
  }

  const data = parsed.data;
  const update: Record<string, unknown> = { updatedAt: new Date() };

  if (data.title !== undefined) update.title = sanitizeText(data.title);
  if (data.content !== undefined) update.content = data.content ? sanitizeBlogContent(data.content) : null;
  if (data.excerpt !== undefined) update.excerpt = data.excerpt ? sanitizeText(data.excerpt) : null;
  if (data.coverImage !== undefined) update.coverImage = data.coverImage || null;
  if (data.published !== undefined) update.published = data.published;
  if (data.metaTitle !== undefined) update.metaTitle = data.metaTitle || null;
  if (data.metaDescription !== undefined) update.metaDescription = data.metaDescription || null;
  if (data.focusKeyword !== undefined) update.focusKeyword = data.focusKeyword || null;

  await db.update(blogPosts).set(update).where(eq(blogPosts.id, id));
  return NextResponse.json({ success: true }, { headers: apiHeaders() });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });

  const { id } = await params;
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  return NextResponse.json({ success: true }, { headers: apiHeaders() });
}

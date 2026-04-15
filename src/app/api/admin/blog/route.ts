import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { sql } from "drizzle-orm";
import { apiHeaders } from "@/lib/api-headers";
import { z } from "zod";
import { sanitizeText } from "@/lib/sanitize";

// Allowlist-based HTML sanitizer for blog content
function sanitizeBlogContent(html: string): string {
  // Strip script tags and dangerous attributes outright
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "") // strip event handlers
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "")
    .slice(0, 100000);
}

const postSchema = z.object({
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, "Lowercase with hyphens only"),
  title: z.string().min(2).max(150),
  content: z.string().max(100000).optional().or(z.literal("")),
  excerpt: z.string().max(300).optional().or(z.literal("")),
  coverImage: z.string().max(500).optional().or(z.literal("")),
  published: z.boolean().optional(),
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
  focusKeyword: z.string().max(100).optional().or(z.literal("")),
});

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });

  const rows = await db
    .select()
    .from(blogPosts)
    .orderBy(sql`${blogPosts.createdAt} desc`);

  return NextResponse.json({ posts: rows }, { headers: apiHeaders() });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });

  const body = await request.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400, headers: apiHeaders() }
    );
  }

  const data = parsed.data;

  const [post] = await db
    .insert(blogPosts)
    .values({
      id: crypto.randomUUID(),
      slug: data.slug,
      title: sanitizeText(data.title),
      content: data.content ? sanitizeBlogContent(data.content) : null,
      excerpt: data.excerpt ? sanitizeText(data.excerpt) : null,
      coverImage: data.coverImage || null,
      published: data.published ?? false,
      authorId: session.user.id,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      focusKeyword: data.focusKeyword || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return NextResponse.json({ post }, { status: 201, headers: apiHeaders() });
}

import { NextResponse } from "next/server";
import { db } from "@/db";
import { galleryImages } from "@/db/schema";
import { sql } from "drizzle-orm";
import { apiHeaders } from "@/lib/api-headers";

export async function GET() {
  const rows = await db
    .select()
    .from(galleryImages)
    .orderBy(galleryImages.sortOrder, sql`${galleryImages.createdAt} asc`);

  return NextResponse.json({ images: rows }, { headers: apiHeaders() });
}

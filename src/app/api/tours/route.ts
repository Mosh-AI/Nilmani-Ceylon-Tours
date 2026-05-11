import { NextResponse } from "next/server";
import { db } from "@/db";
import { tours } from "@/db/schema";
import { eq } from "drizzle-orm";
import { apiHeaders } from "@/lib/api-headers";

export async function GET() {
  const rows = await db
    .select({
      id: tours.id,
      slug: tours.slug,
      title: tours.title,
      subtitle: tours.subtitle,
      duration: tours.duration,
      price: tours.price,
      category: tours.category,
      heroImage: tours.heroImage,
      personsIncluded: tours.personsIncluded,
      difficulty: tours.difficulty,
    })
    .from(tours)
    .where(eq(tours.available, true))
    .orderBy(tours.duration);

  return NextResponse.json({ tours: rows }, { headers: apiHeaders() });
}

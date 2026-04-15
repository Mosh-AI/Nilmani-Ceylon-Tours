import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/lib/user-auth";
import { db } from "@/db";
import { favorites } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { apiHeaders } from "@/lib/api-headers";

export async function POST(request: NextRequest) {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });
  }

  const { tourId } = await request.json() as { tourId: string };
  if (!tourId) {
    return NextResponse.json({ error: "tourId required" }, { status: 400, headers: apiHeaders() });
  }

  // Toggle: if exists delete, otherwise insert
  const [existing] = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, session.user.id), eq(favorites.tourId, tourId)))
    .limit(1);

  if (existing) {
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, session.user.id), eq(favorites.tourId, tourId)));
    return NextResponse.json({ saved: false }, { headers: apiHeaders() });
  }

  await db.insert(favorites).values({
    userId: session.user.id,
    tourId,
    createdAt: new Date(),
  });

  return NextResponse.json({ saved: true }, { headers: apiHeaders() });
}

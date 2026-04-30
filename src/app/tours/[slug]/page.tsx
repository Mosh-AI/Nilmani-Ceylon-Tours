import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { db } from "@/db";
import { tours as toursTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getTourBySlug, tours as staticTours } from "@/data/tours";
import { TourDetailClient } from "./_components/TourDetailClient";

export const revalidate = 60;

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Gate: check DB — is this tour active?
  const [dbRow] = await db
    .select({ available: toursTable.available })
    .from(toursTable)
    .where(and(eq(toursTable.slug, slug), eq(toursTable.available, true)))
    .limit(1);

  // Load full tour content from static data
  const tour = getTourBySlug(slug);

  // Show 404 if inactive in DB OR not in static data at all
  if (!dbRow || !tour) {
    notFound();
  }

  // Build related tours: same category, also active in DB
  const activeRows = await db
    .select({ slug: toursTable.slug })
    .from(toursTable)
    .where(eq(toursTable.available, true));

  const activeSlugSet = new Set(activeRows.map((r) => r.slug));

  const relatedTours = staticTours
    .filter(
      (t) =>
        t.slug !== slug &&
        activeSlugSet.has(t.slug) &&
        t.category === tour.category
    )
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-brand-bg">
      <Header />
      <TourDetailClient tour={tour} relatedTours={relatedTours} />
      <Footer />
    </main>
  );
}

import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { db } from "@/db";
import { tours as toursTable } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { TourDetailClient } from "./_components/TourDetailClient";
import type { Tour } from "@/data/tours";

export const revalidate = 60;

function formatDuration(days: number): string {
  const nights = days - 1;
  return `${days} Day${days !== 1 ? "s" : ""} / ${nights} Night${nights !== 1 ? "s" : ""}`;
}

function formatPrice(usd: number): string {
  return `$${usd.toLocaleString("en-US")}`;
}

function dbRowToTour(row: typeof toursTable.$inferSelect): Tour {
  return {
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle ?? "",
    description: row.summary ?? row.description.slice(0, 200),
    longDescription: row.description,
    category: (row.category as Tour["category"]) ?? "Cultural",
    duration: formatDuration(row.duration),
    durationDays: row.duration,
    price: formatPrice(row.price),
    priceNote: "per 2 persons (private tour)",
    difficulty: row.difficulty ?? "Easy",
    groupSize: row.maxGroup ? `Up to ${row.maxGroup} guests (private)` : "Private / Small Group",
    heroImage: row.heroImage ?? "/images/sigiriya-hero.jpg",
    heroAlt: `${row.title} — Sri Lanka Tour`,
    galleryImages: [],
    richHighlights: (row.highlights as { text: string; featured: boolean }[] | null) ?? undefined,
    highlights: ((row.highlights as { text: string; featured: boolean }[] | null) ?? []).map((h) => h.text),
    itinerary: [],
    included: (row.whatsIncluded as string[]) ?? [],
    notIncluded: (row.whatsExcluded as string[]) ?? [],
    faqs: [],
  };
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch full tour data from DB
  const [dbTour] = await db
    .select()
    .from(toursTable)
    .where(and(eq(toursTable.slug, slug), eq(toursTable.available, true)))
    .limit(1);

  if (!dbTour) {
    notFound();
  }

  const tour = dbRowToTour(dbTour);

  // Related tours: same category, available, different slug (up to 3)
  const relatedRows = await db
    .select()
    .from(toursTable)
    .where(
      and(
        eq(toursTable.available, true),
        eq(toursTable.category, dbTour.category ?? ""),
        ne(toursTable.slug, slug)
      )
    )
    .limit(3);

  const relatedTours = relatedRows.map(dbRowToTour);

  return (
    <main className="min-h-screen bg-brand-bg">
      <Header />
      <TourDetailClient tour={tour} relatedTours={relatedTours} />
      <Footer />
    </main>
  );
}

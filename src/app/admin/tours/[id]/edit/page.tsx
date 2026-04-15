import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/db";
import { tours } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "../../../_components/AdminPageHeader";
import { TourForm } from "../../_components/TourForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditTourPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const [tour] = await db.select().from(tours).where(eq(tours.id, id)).limit(1);
  if (!tour) notFound();

  const initial = {
    id: tour.id,
    slug: tour.slug,
    title: tour.title,
    subtitle: tour.subtitle ?? "",
    description: tour.description,
    duration: tour.duration,
    price: tour.price,
    difficulty: tour.difficulty ?? "Easy" as const,
    maxGroup: tour.maxGroup ?? 8,
    category: tour.category ?? "",
    highlights: (tour.highlights as string[] | null) ?? [],
    whatsIncluded: (tour.whatsIncluded as string[] | null) ?? [],
    whatsExcluded: (tour.whatsExcluded as string[] | null) ?? [],
    heroImage: tour.heroImage ?? "",
    featured: tour.featured,
    available: tour.available,
    metaTitle: tour.metaTitle ?? "",
    metaDescription: tour.metaDescription ?? "",
    focusKeyword: tour.focusKeyword ?? "",
  };

  return (
    <div>
      <div className="mb-4">
        <Link href="/admin/tours" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" /> Back to tours
        </Link>
      </div>
      <AdminPageHeader
        title={`Edit: ${tour.title}`}
        description="Update the tour details, pricing, and SEO settings."
      />
      <TourForm initial={initial} />
    </div>
  );
}

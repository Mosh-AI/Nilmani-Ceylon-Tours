import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/db";
import { locations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "../../../_components/AdminPageHeader";
import { LocationForm } from "../../_components/LocationForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditLocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const [location] = await db
    .select()
    .from(locations)
    .where(eq(locations.id, id))
    .limit(1);

  if (!location) notFound();

  const initial = {
    id: location.id,
    slug: location.slug,
    name: location.name,
    region: location.region,
    mapX: location.mapX,
    mapY: location.mapY,
    lat: location.lat,
    lng: location.lng,
  };

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/locations"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to locations
        </Link>
      </div>
      <AdminPageHeader
        title={`Edit: ${location.name}`}
        description="Update location details. Slug cannot be changed."
      />
      <LocationForm initial={initial} />
    </div>
  );
}

import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/db";
import { routes, routeStops } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "../../../_components/AdminPageHeader";
import { RouteForm } from "../../_components/RouteForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const [route] = await db
    .select()
    .from(routes)
    .where(eq(routes.id, id))
    .limit(1);

  if (!route) notFound();

  const stops = await db
    .select({ locationSlug: routeStops.locationSlug })
    .from(routeStops)
    .where(eq(routeStops.routeId, id))
    .orderBy(asc(routeStops.stopOrder));

  const initial = {
    id: route.id,
    name: route.name,
    description: route.description ?? "",
    stops: stops.map((s) => s.locationSlug),
  };

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/routes"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to routes
        </Link>
      </div>
      <AdminPageHeader
        title={`Edit: ${route.name}`}
        description="Update the route name, description, and stop order."
      />
      <RouteForm initial={initial} />
    </div>
  );
}

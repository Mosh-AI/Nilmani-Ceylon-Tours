import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/db";
import { locations } from "@/db/schema";
import { asc } from "drizzle-orm";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import Link from "next/link";
import { MapPin, Plus, Pencil } from "lucide-react";
import { DeleteLocationButton } from "./_components/DeleteLocationButton";

const REGION_LABELS: Record<string, string> = {
  "north": "North",
  "north-central": "North Central",
  "east": "East",
  "central": "Central / Hill Country",
  "west": "West",
  "south": "South",
};

export default async function LocationsPage() {
  await requireAdmin();

  const rows = await db
    .select()
    .from(locations)
    .orderBy(asc(locations.region), asc(locations.name));

  return (
    <div>
      <AdminPageHeader
        title={`Locations (${rows.length})`}
        description="Manage the named stops used on route maps and the Customize Your Tour page."
        action={
          <Link
            href="/admin/locations/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#1C1209] px-4 py-2 text-sm font-semibold text-[#C9A84C] hover:bg-[#2E1E0A]"
          >
            <Plus className="h-4 w-4" />
            Add Location
          </Link>
        }
      />

      {rows.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <MapPin className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-500">No locations yet</p>
          <p className="mt-1 text-xs text-gray-400">
            Add locations then seed them to power tour routes.
          </p>
          <Link
            href="/admin/locations/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#1C1209] px-4 py-2 text-sm font-semibold text-[#C9A84C]"
          >
            <Plus className="h-4 w-4" /> Add Location
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Name", "Slug", "Region", "Lat / Lng", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((loc) => (
                <tr key={loc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {loc.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    {loc.slug}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-[#C9A84C]/15 px-2.5 py-0.5 text-xs font-semibold text-[#C9A84C]">
                      {REGION_LABELS[loc.region] ?? loc.region}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">
                    {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/locations/${loc.id}/edit`}
                        className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </Link>
                      <DeleteLocationButton id={loc.id} name={loc.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

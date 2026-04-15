import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/db";
import { tours } from "@/db/schema";
import { sql } from "drizzle-orm";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import Link from "next/link";
import { Map, Plus, Pencil } from "lucide-react";
import { AvailabilityToggle } from "./_components/AvailabilityToggle";

export default async function ToursPage() {
  await requireAdmin();

  const rows = await db
    .select()
    .from(tours)
    .orderBy(sql`${tours.createdAt} desc`);

  return (
    <div>
      <AdminPageHeader
        title="Tours"
        description="Manage your tour listings, pricing, and availability."
        action={
          <Link
            href="/admin/tours/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#1C1209] px-4 py-2 text-sm font-semibold text-[#C9A84C] hover:bg-[#2E1E0A]"
          >
            <Plus className="h-4 w-4" />
            Add Tour
          </Link>
        }
      />

      {rows.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <Map className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-500">No tours yet</p>
          <p className="mt-1 text-xs text-gray-400">Add your first tour to get started.</p>
          <Link
            href="/admin/tours/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#1C1209] px-4 py-2 text-sm font-semibold text-[#C9A84C]"
          >
            <Plus className="h-4 w-4" /> Add Tour
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Tour", "Duration", "Price (USD)", "Category", "Featured", "Available", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{t.title}</div>
                    <div className="text-xs text-gray-400">/tours/{t.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{t.duration}d</td>
                  <td className="px-4 py-3 text-gray-500">${t.price}</td>
                  <td className="px-4 py-3 text-gray-500">{t.category ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${t.featured ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-500"}`}>
                      {t.featured ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <AvailabilityToggle tourId={t.id} available={t.available} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/tours/${t.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </Link>
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

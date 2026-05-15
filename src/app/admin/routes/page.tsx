import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/db";
import { routes, routeStops } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import Link from "next/link";
import { Route, Plus, Pencil } from "lucide-react";

export default async function RoutesPage() {
  await requireAdmin();

  const rows = await db
    .select({
      id: routes.id,
      name: routes.name,
      description: routes.description,
      createdAt: routes.createdAt,
      stopCount: sql<number>`count(${routeStops.id})::int`,
    })
    .from(routes)
    .leftJoin(routeStops, eq(routeStops.routeId, routes.id))
    .groupBy(routes.id)
    .orderBy(desc(routes.createdAt));

  return (
    <div>
      <AdminPageHeader
        title="Routes"
        description="Define named stop sequences used on the Customize Your Tour map."
        action={
          <Link
            href="/admin/routes/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#1C1209] px-4 py-2 text-sm font-semibold text-[#C9A84C] hover:bg-[#2E1E0A]"
          >
            <Plus className="h-4 w-4" />
            Add Route
          </Link>
        }
      />

      {rows.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <Route className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-500">No routes yet</p>
          <p className="mt-1 text-xs text-gray-400">
            Create your first route to power the Customize Your Tour page.
          </p>
          <Link
            href="/admin/routes/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#1C1209] px-4 py-2 text-sm font-semibold text-[#C9A84C]"
          >
            <Plus className="h-4 w-4" /> Add Route
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Route Name", "Description", "Stops", "Created", ""].map((h) => (
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
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {r.name}
                  </td>
                  <td className="max-w-xs px-4 py-3 text-gray-500">
                    {r.description ? (
                      <span className="line-clamp-1">{r.description}</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-[#C9A84C]/15 px-2.5 py-0.5 text-xs font-semibold text-[#C9A84C]">
                      {r.stopCount} stop{r.stopCount !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(r.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/routes/${r.id}/edit`}
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

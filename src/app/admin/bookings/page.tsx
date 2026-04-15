import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { StatusBadge } from "../_components/StatusBadge";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";

const STATUS_FILTERS = [
  { label: "All", value: "" },
  { label: "Inquiries", value: "inquiry" },
  { label: "Quoted", value: "quoted" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();
  const { status } = await searchParams;

  let query = db
    .select()
    .from(bookings)
    .orderBy(sql`${bookings.createdAt} desc`)
    .limit(50);

  if (status) {
    query = query.where(eq(bookings.status, status)) as typeof query;
  }

  const rows = await query;

  return (
    <div>
      <AdminPageHeader
        title="Bookings"
        description="Manage all booking enquiries and reservations."
      />

      {/* Status filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map(({ label, value }) => (
          <Link
            key={value}
            href={value ? `/admin/bookings?status=${value}` : "/admin/bookings"}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              (status ?? "") === value
                ? "bg-[#1C1209] text-[#C9A84C]"
                : "bg-white text-gray-600 shadow-sm hover:bg-gray-50"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <CalendarCheck className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-500">No bookings found</p>
          <p className="mt-1 text-xs text-gray-400">
            {status ? `No bookings with status "${status}".` : "Booking enquiries will appear here once your site is live."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Reference", "Guest", "Email", "Tour / Trip", "Start Date", "Guests", "Status", ""].map((h) => (
                    <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{b.referenceCode}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{b.guestName}</td>
                    <td className="px-4 py-3 text-gray-500">{b.email}</td>
                    <td className="max-w-[180px] truncate px-4 py-3 text-gray-500">
                      {b.adminNotes?.split(".")[0] ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{b.startDate}</td>
                    <td className="px-4 py-3 text-gray-500">{b.guests}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status ?? "inquiry"} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/db";
import { bookings, tours, contactSubmissions } from "@/db/schema";
import { eq, sql, gte, count } from "drizzle-orm";
import { AdminPageHeader } from "./_components/AdminPageHeader";
import { StatusBadge } from "./_components/StatusBadge";
import Link from "next/link";
import {
  CalendarCheck,
  Map,
  Mail,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

async function getStats() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [total, inquiries, confirmed, activeTours, contacts, recent] =
    await Promise.all([
      db.select({ c: count() }).from(bookings),
      db.select({ c: count() }).from(bookings).where(eq(bookings.status, "inquiry")),
      db.select({ c: count() }).from(bookings).where(eq(bookings.status, "confirmed")),
      db.select({ c: count() }).from(tours).where(eq(tours.available, true)),
      db
        .select({ c: count() })
        .from(contactSubmissions)
        .where(gte(contactSubmissions.createdAt, thirtyDaysAgo)),
      db
        .select({
          id: bookings.id,
          referenceCode: bookings.referenceCode,
          guestName: bookings.guestName,
          startDate: bookings.startDate,
          guests: bookings.guests,
          status: bookings.status,
          createdAt: bookings.createdAt,
        })
        .from(bookings)
        .orderBy(sql`${bookings.createdAt} desc`)
        .limit(8),
    ]);

  return {
    totalBookings: total[0]?.c ?? 0,
    newInquiries: inquiries[0]?.c ?? 0,
    confirmed: confirmed[0]?.c ?? 0,
    activeTours: activeTours[0]?.c ?? 0,
    recentContacts: contacts[0]?.c ?? 0,
    recentBookings: recent,
  };
}

export default async function AdminDashboard() {
  await requireAdmin();
  const stats = await getStats();

  const cards = [
    {
      label: "New Inquiries",
      value: stats.newInquiries,
      icon: AlertCircle,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/admin/bookings?status=inquiry",
    },
    {
      label: "Confirmed Bookings",
      value: stats.confirmed,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
      href: "/admin/bookings?status=confirmed",
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: CalendarCheck,
      color: "text-purple-600",
      bg: "bg-purple-50",
      href: "/admin/bookings",
    },
    {
      label: "Active Tours",
      value: stats.activeTours,
      icon: Map,
      color: "text-[#C9A84C]",
      bg: "bg-amber-50",
      href: "/admin/tours",
    },
    {
      label: "Contacts (30d)",
      value: stats.recentContacts,
      icon: Mail,
      color: "text-teal-600",
      bg: "bg-teal-50",
      href: "/admin/bookings",
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description={`Welcome back! Here's what's happening at Nilmani Ceylon Tours.`}
      />

      {/* Setup checklist — shown when no tours exist */}
      {stats.activeTours === 0 && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="font-semibold text-amber-800">
            Complete your site setup
          </p>
          <ul className="mt-3 space-y-2 text-sm text-amber-700">
            <li className="flex items-center gap-2">
              <span className="text-amber-400">☐</span>
              <Link href="/admin/tours/new" className="underline underline-offset-2 hover:text-amber-900">
                Add your first tour
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-amber-400">☐</span>
              <Link href="/admin/gallery" className="underline underline-offset-2 hover:text-amber-900">
                Upload gallery photos
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-amber-400">☐</span>
              <Link href="/admin/settings" className="underline underline-offset-2 hover:text-amber-900">
                Set your WhatsApp number and contact details
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className={`inline-flex rounded-lg p-2 ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
            <p className="mt-0.5 text-xs text-gray-500">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            Recent Bookings
          </h2>
          <Link
            href="/admin/bookings"
            className="text-sm text-[#C9A84C] underline-offset-2 hover:underline"
          >
            View all
          </Link>
        </div>

        {stats.recentBookings.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 py-12 text-center">
            <CalendarCheck className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-500">
              No bookings yet
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Booking enquiries will appear here once your site is live.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Reference
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Guest
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 sm:table-cell">
                    Date
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 md:table-cell">
                    Guests
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">
                      {b.referenceCode}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {b.guestName}
                    </td>
                    <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">
                      {b.startDate}
                    </td>
                    <td className="hidden px-4 py-3 text-gray-500 md:table-cell">
                      {b.guests}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status ?? "inquiry"} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="text-xs text-[#C9A84C] hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

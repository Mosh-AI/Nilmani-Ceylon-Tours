import { requireUser } from "@/lib/user-auth";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { StatusBadge } from "@/app/admin/_components/StatusBadge";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";

export default async function MyBookingsPage() {
  const session = await requireUser();

  // IDOR: always filter by session user id
  const myBookings = await db
    .select()
    .from(bookings)
    .where(eq(bookings.userId, session.user.id))
    .orderBy(sql`${bookings.createdAt} desc`);

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold text-gray-900">My Bookings</h2>

      {myBookings.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
          <CalendarCheck className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-500">No bookings yet</p>
          <Link
            href="/booking"
            className="mt-4 inline-block rounded-full bg-[#1C1209] px-6 py-2.5 text-sm font-semibold text-[#C9A84C]"
          >
            Book a Tour
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {myBookings.map((b) => (
            <Link
              key={b.id}
              href={`/dashboard/bookings/${b.id}`}
              className="block rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-gray-500">
                      {b.referenceCode}
                    </span>
                    <StatusBadge status={b.status ?? "inquiry"} />
                  </div>
                  <p className="mt-1 font-medium text-gray-900 truncate">
                    {b.adminNotes?.split(".")[0] ?? "Tour booking"}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Start: {b.startDate} · {b.guests} guest{b.guests !== 1 ? "s" : ""}
                    {b.totalPrice ? ` · $${b.totalPrice} USD` : ""}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-[#C9A84C]">View →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

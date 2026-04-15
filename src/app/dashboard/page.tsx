import { requireUser } from "@/lib/user-auth";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { StatusBadge } from "@/app/admin/_components/StatusBadge";
import Link from "next/link";
import { CalendarCheck, Map, MessageSquare } from "lucide-react";

export default async function DashboardPage() {
  const session = await requireUser();

  const myBookings = await db
    .select()
    .from(bookings)
    .where(eq(bookings.userId, session.user.id))
    .orderBy(sql`${bookings.createdAt} desc`)
    .limit(5);

  const name = session.user.name ?? "Traveller";

  return (
    <div>
      <h1 className="mb-1 font-serif text-2xl font-light text-[#1C1209]">
        Welcome back, {name}
      </h1>
      <p className="mb-8 text-sm text-gray-500">
        Here&apos;s an overview of your trips with Nilmani Ceylon Tours.
      </p>

      {myBookings.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
          <Map className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-base font-medium text-gray-600">
            No bookings yet
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Start planning your Sri Lanka journey.
          </p>
          <Link
            href="/booking"
            className="mt-5 inline-block rounded-full bg-[#1C1209] px-6 py-2.5 text-sm font-semibold text-[#C9A84C] hover:bg-[#2E1E0A]"
          >
            Book a Tour
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Recent Bookings
            </h2>
            <Link
              href="/dashboard/bookings"
              className="text-sm text-[#C9A84C] hover:underline"
            >
              View all
            </Link>
          </div>

          {myBookings.map((b) => (
            <Link
              key={b.id}
              href={`/dashboard/bookings/${b.id}`}
              className="block rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gray-500">
                      {b.referenceCode}
                    </span>
                    <StatusBadge status={b.status ?? "inquiry"} />
                  </div>
                  <p className="mt-1 font-medium text-gray-900">
                    {b.adminNotes?.split(".")[0] ?? "Tour booking"}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {b.startDate} · {b.guests} guest{b.guests !== 1 ? "s" : ""}
                  </p>
                </div>
                <CalendarCheck className="mt-0.5 h-5 w-5 shrink-0 text-gray-300" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Quick links */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/track"
          className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
            <CalendarCheck className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Track Booking</p>
            <p className="text-xs text-gray-500">Use your reference code</p>
          </div>
        </Link>
        <Link
          href="/tours"
          className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50">
            <Map className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Browse Tours</p>
            <p className="text-xs text-gray-500">Find your next adventure</p>
          </div>
        </Link>
        <Link
          href="/contact"
          className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
            <MessageSquare className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Contact Us</p>
            <p className="text-xs text-gray-500">Questions? We&apos;re here</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

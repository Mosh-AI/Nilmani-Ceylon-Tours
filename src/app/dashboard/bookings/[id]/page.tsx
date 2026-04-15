import { requireUser } from "@/lib/user-auth";
import { db } from "@/db";
import { bookings, messages } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/app/admin/_components/StatusBadge";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { MessageThread } from "./_components/MessageThread";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireUser();
  const { id } = await params;

  // IDOR: scope by userId to prevent accessing other users' bookings
  const [booking] = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.id, id), eq(bookings.userId, session.user.id)))
    .limit(1);

  if (!booking) notFound();

  const thread = await db
    .select()
    .from(messages)
    .where(eq(messages.bookingId, id))
    .orderBy(sql`${messages.createdAt} asc`);

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to bookings
        </Link>
      </div>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm text-gray-500">
              {booking.referenceCode}
            </span>
            <StatusBadge status={booking.status ?? "inquiry"} />
          </div>
          <h1 className="mt-1 font-serif text-2xl font-light text-[#1C1209]">
            {booking.adminNotes?.split(".")[0] ?? "Tour Booking"}
          </h1>
        </div>
        <Link
          href={`/api/bookings/${id}/voucher`}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Download className="h-4 w-4" />
          Voucher
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Booking details */}
        <div className="lg:col-span-2 space-y-4">
          <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Trip Details
            </h2>
            <dl className="space-y-2 text-sm">
              {[
                ["Start Date", booking.startDate],
                ["Guests", booking.guests],
                ["Status", <StatusBadge key="s" status={booking.status ?? "inquiry"} />],
                ...(booking.totalPrice ? [["Quoted Price", `$${booking.totalPrice} USD`]] : []),
                ...(booking.specialRequests ? [["Special Requests", booking.specialRequests]] : []),
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between gap-2">
                  <dt className="text-gray-500">{label}</dt>
                  <dd className="font-medium text-gray-900 text-right">{value as string}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Need Help?
            </h2>
            <a
              href="https://wa.me/94787829952"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-[#25D366]/10 px-4 py-2.5 text-sm font-medium text-[#128C7E] hover:bg-[#25D366]/20"
            >
              WhatsApp Roshan
            </a>
          </section>
        </div>

        {/* Message thread */}
        <div className="lg:col-span-3">
          <MessageThread
            bookingId={id}
            userId={session.user.id}
            userName={session.user.name ?? "You"}
            initialMessages={thread.map((m) => ({
              id: m.id,
              content: m.content,
              senderRole: m.senderRole,
              createdAt: m.createdAt.toISOString(),
            }))}
          />
        </div>
      </div>
    </div>
  );
}

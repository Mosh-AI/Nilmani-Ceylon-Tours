"use client";

import { useState, useEffect } from "react";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { StatusBadge } from "../../_components/StatusBadge";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";

const STATUSES = [
  "inquiry", "quoted", "deposit_paid", "confirmed", "in_progress", "completed", "cancelled",
] as const;

type Booking = {
  id: string;
  referenceCode: string;
  guestName: string;
  email: string;
  phone: string | null;
  startDate: string;
  guests: number;
  status: string;
  totalPrice: number | null;
  adminNotes: string | null;
  specialRequests: string | null;
  createdAt: string;
};

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [status, setStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [bookingId, setBookingId] = useState("");

  useEffect(() => {
    params.then(({ id }) => {
      setBookingId(id);
      fetch(`/api/admin/bookings/${id}`)
        .then((r) => r.json())
        .then((data) => {
          setBooking(data.booking);
          setStatus(data.booking.status);
          setAdminNotes(data.booking.adminNotes ?? "");
          setTotalPrice(data.booking.totalPrice?.toString() ?? "");
        });
    });
  }, [params]);

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/admin/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        adminNotes,
        ...(totalPrice ? { totalPrice: parseInt(totalPrice, 10) } : {}),
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleDelete() {
    if (!confirm("Delete this booking? This cannot be undone.")) return;
    await fetch(`/api/admin/bookings/${bookingId}`, { method: "DELETE" });
    router.push("/admin/bookings");
  }

  if (!booking) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="h-64 rounded-xl bg-gray-200" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to bookings
        </Link>
      </div>

      <AdminPageHeader
        title={`Booking — ${booking.referenceCode}`}
        description={`Submitted ${new Date(booking.createdAt).toLocaleDateString()}`}
        action={
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1C1209] px-4 py-2 text-sm font-semibold text-[#C9A84C] hover:bg-[#2E1E0A] disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saved ? "Saved!" : saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Guest details */}
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Guest Information
            </h2>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              {[
                ["Name", booking.guestName],
                ["Email", booking.email],
                ["Phone", booking.phone ?? "—"],
                ["Start Date", booking.startDate],
                ["Guests", booking.guests],
                ["Special Requests", booking.specialRequests ?? "—"],
              ].map(([label, value]) => (
                <div key={String(label)}>
                  <dt className="text-xs font-medium text-gray-500">{label}</dt>
                  <dd className="mt-0.5 text-gray-900">{String(value)}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Admin Notes
            </h2>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              placeholder="Internal notes about this booking (not visible to guest)..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
            />
          </section>
        </div>

        {/* Status + price */}
        <div className="space-y-6">
          <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Status
            </h2>
            <div className="mb-3">
              <StatusBadge status={status} />
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </section>

          <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Quoted Price (USD)
            </h2>
            <input
              type="number"
              value={totalPrice}
              onChange={(e) => setTotalPrice(e.target.value)}
              placeholder="e.g. 1200"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
            />
            <p className="mt-1.5 text-xs text-gray-400">
              Enter total quoted price to share with guest.
            </p>
          </section>

          <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <a
                href={`mailto:${booking.email}?subject=Re: Your booking ${booking.referenceCode}`}
                className="block w-full rounded-lg bg-gray-50 px-4 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Reply by Email
              </a>
              {booking.phone && (
                <a
                  href={`https://wa.me/${booking.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-lg bg-[#25D366]/10 px-4 py-2.5 text-center text-sm font-medium text-[#128C7E] hover:bg-[#25D366]/20"
                >
                  WhatsApp Guest
                </a>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

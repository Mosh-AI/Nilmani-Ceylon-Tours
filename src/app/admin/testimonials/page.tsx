import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { sql } from "drizzle-orm";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { TestimonialToggle } from "./_components/TestimonialToggle";
import { Star } from "lucide-react";

export default async function TestimonialsPage() {
  await requireAdmin();

  const rows = await db
    .select()
    .from(testimonials)
    .orderBy(sql`${testimonials.createdAt} desc`);

  return (
    <div>
      <AdminPageHeader
        title="Testimonials"
        description="Approve guest reviews to show them on the public website."
      />

      {rows.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-12 text-center">
          <Star className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">No testimonials yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((t) => (
            <div
              key={t.id}
              className={`rounded-xl border bg-white p-5 shadow-sm ${
                t.approved ? "border-green-100" : "border-gray-100"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{t.guestName}</p>
                    {t.country && (
                      <span className="text-sm text-gray-400">· {t.country}</span>
                    )}
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="shrink-0">
                  <TestimonialToggle id={t.id} approved={t.approved} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

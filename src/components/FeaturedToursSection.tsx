import Image from "next/image";
import Link from "next/link";
import { db } from "@/db";
import { tours as toursTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { Clock, ArrowRight } from "lucide-react";

export const revalidate = 30;

function formatPrice(usd: number) {
  return `$${usd.toLocaleString("en-US")}`;
}

function formatDuration(days: number) {
  const nights = days - 1;
  return `${days} Day${days !== 1 ? "s" : ""} / ${nights} Night${nights !== 1 ? "s" : ""}`;
}

export async function FeaturedToursSection() {
  const featured = await db
    .select({
      slug: toursTable.slug,
      title: toursTable.title,
      subtitle: toursTable.subtitle,
      summary: toursTable.summary,
      description: toursTable.description,
      category: toursTable.category,
      duration: toursTable.duration,
      price: toursTable.price,
      heroImage: toursTable.heroImage,
    })
    .from(toursTable)
    .where(and(eq(toursTable.available, true), eq(toursTable.featured, true)))
    .orderBy(toursTable.createdAt)
    .limit(3);

  if (featured.length === 0) return null;

  return (
    <section className="bg-brand-bg px-6 py-20 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="gold-divider" />
              <span className="text-xs font-medium uppercase tracking-luxury text-gold">
                Signature Experiences
              </span>
            </div>
            <h2 className="font-serif text-4xl font-light leading-tight text-brand-text md:text-5xl">
              Create Your Own{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                className="italic"
              >
                Tour
              </span>
            </h2>
          </div>
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 self-start rounded-full border border-brand-border px-6 py-3 text-xs font-semibold tracking-luxury text-brand-text transition-all duration-300 hover:border-gold/50 hover:text-gold sm:self-end"
          >
            View All Tours
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Tour cards */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((tour) => {
            const heroSrc = tour.heroImage ?? "/images/sigiriya-hero.jpg";
            return (
              <Link
                key={tour.slug}
                href={`/tours/${tour.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-brand-border bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-gold/30 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden sm:h-64">
                  <Image
                    src={heroSrc}
                    alt={tour.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                  {/* Category pill */}
                  {tour.category && (
                    <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-luxury text-gold backdrop-blur-sm">
                      {tour.category}
                    </span>
                  )}

                  {/* Price */}
                  <span className="absolute bottom-4 right-4 rounded-full bg-black/60 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
                    {formatPrice(tour.price)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center gap-1.5 text-xs text-brand-muted">
                    <Clock size={12} className="text-gold" />
                    {formatDuration(tour.duration)}
                  </div>

                  <h3 className="mb-2 font-serif text-xl font-light text-brand-text lg:text-2xl">
                    {tour.title}
                  </h3>

                  {tour.subtitle && (
                    <p className="mb-2 text-xs text-gold">{tour.subtitle}</p>
                  )}

                  <p className="mb-6 mt-1 flex-1 text-sm leading-relaxed text-brand-muted line-clamp-3">
                    {tour.summary ?? tour.description}
                  </p>

                  <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-luxury text-gold transition-all duration-300 group-hover:gap-3">
                    View Details
                    <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { db } from "@/db";
import { tours as toursTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ToursClient } from "./_components/ToursClient";

export const revalidate = 30;

export default async function ToursPage() {
  // Fetch all active tours directly from database — no static data dependency
  const rows = await db
    .select({
      slug: toursTable.slug,
      title: toursTable.title,
      subtitle: toursTable.subtitle,
      description: toursTable.description,
      category: toursTable.category,
      duration: toursTable.duration,
      price: toursTable.price,
      heroImage: toursTable.heroImage,
    })
    .from(toursTable)
    .where(eq(toursTable.available, true))
    .orderBy(toursTable.createdAt);

  return (
    <main className="min-h-screen bg-brand-bg">
      <Header />

      {/* Hero banner */}
      <section className="relative flex h-72 items-end overflow-hidden bg-brand-surface sm:h-80 lg:h-96">
        <Image
          src="/images/sigiriya-hero.jpg"
          alt="Panoramic view of Sri Lanka landscapes"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-12 lg:px-12">
          <div className="mb-4 flex items-center gap-3">
            <div className="gold-divider" />
            <span className="text-xs font-medium uppercase tracking-luxury text-gold">
              Curated Experiences
            </span>
          </div>
          <h1 className="font-serif text-3xl leading-tight font-light text-white sm:text-4xl lg:text-5xl">
            Our Signature{" "}
            <span className="text-gold-gradient italic">Tours</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm font-light leading-relaxed text-white/80 sm:text-base">
            Handcrafted itineraries that showcase the very best of Sri Lanka
            &mdash; from ancient kingdoms to pristine coastlines.
          </p>
        </div>
      </section>

      {/* Filter + Grid — fully driven by DB */}
      <ToursClient tours={rows} />

      {/* CTA strip */}
      <section className="bg-brand-surface px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-serif text-2xl font-light text-brand-text sm:text-3xl lg:text-4xl">
            Don&rsquo;t See What You&rsquo;re Looking For?
          </h2>
          <p className="mb-8 text-sm leading-relaxed text-brand-muted sm:text-base">
            Every journey is unique. We craft bespoke itineraries tailored to
            your interests, pace, and budget. Tell us your dream Sri Lanka
            experience and we will make it happen.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/booking"
              className="btn-gold inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold tracking-luxury"
            >
              Request Custom Tour
            </Link>
            <a
              href="https://wa.me/94787829952"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold tracking-luxury"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

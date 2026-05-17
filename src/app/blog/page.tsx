export const revalidate = 60;

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { db } from "@/db";
import { blogPosts as blogPostsTable, user as userTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ArrowRight, Calendar, User, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Travel Journal | Nilmani Ceylon Tours",
  description:
    "Discover Sri Lanka through our travel journal — guides, cultural insights, hidden gems and inspiration for your next luxury journey.",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

interface Post {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  createdAt: Date;
  authorName: string | null;
}

/* ── Featured card — large horizontal split: image left, content right ── */
function FeaturedCard({ post }: { post: Post }) {
  const img = post.coverImage ?? "/images/sigiriya-hero.jpg";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition-all duration-300 hover:border-[#C9A84C]/40 hover:bg-white/[0.06] sm:flex-row lg:min-h-[480px]"
    >
      {/* Left image panel — 45% width on sm+ */}
      <div className="relative h-64 w-full shrink-0 overflow-hidden sm:h-auto sm:w-[45%]">
        <Image
          src={img}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 540px"
          priority
        />
        {/* Subtle right-edge fade into card background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/30 sm:block hidden" />
        {/* Bottom-edge fade on mobile */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 sm:hidden" />

        {/* Featured Story badge — top-left of image */}
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-[#C9A84C]/60 bg-black/50 px-3 py-1.5 backdrop-blur-sm">
          <div className="h-1 w-1 rounded-full bg-[#C9A84C]" />
          <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#C9A84C]">
            Featured Story
          </span>
        </div>
      </div>

      {/* Right content panel */}
      <div className="flex flex-1 flex-col justify-between p-8 lg:p-12">
        {/* Top section */}
        <div>
          {/* Post number */}
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C]/40">
            01
          </span>

          {/* Date + author row */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <span className="flex items-center gap-1.5">
              <Calendar size={11} className="text-[#C9A84C]" />
              <span className="text-[11px] text-white/50">{formatDate(post.createdAt)}</span>
            </span>
            {post.authorName && (
              <span className="flex items-center gap-1.5">
                <User size={11} className="text-[#C9A84C]" />
                <span className="text-[11px] text-white/50">{post.authorName}</span>
              </span>
            )}
          </div>

          {/* Gold divider */}
          <div className="my-4 h-px w-12 bg-gradient-to-r from-[#C9A84C] to-transparent" />

          {/* Title */}
          <h2 className="font-serif text-3xl font-light leading-snug text-white transition-colors duration-300 group-hover:text-[#E8C96A] lg:text-4xl xl:text-5xl">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mt-4 text-sm leading-relaxed text-white/60 line-clamp-4 lg:text-base">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Gold CTA button */}
        <div className="mt-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/50 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C9A84C] transition-all duration-300 group-hover:border-[#C9A84C] group-hover:bg-[#C9A84C]/10 group-hover:gap-3">
            Read Article <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Standard grid card — horizontal split: image left, content right ── */
function GridCard({ post, index }: { post: Post; index: number }) {
  const img = post.coverImage ?? "/images/sigiriya-hero.jpg";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition-all duration-300 hover:border-[#C9A84C]/30 hover:bg-white/[0.06] sm:flex-row"
    >
      {/* Left image panel — full width on mobile, 42% on sm+ */}
      <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-auto sm:w-[42%]">
        <Image
          src={img}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 42vw, 30vw"
        />
        {/* Right-edge fade into card background on sm+ */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 hidden sm:block" />
        {/* Bottom-edge fade on mobile */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 sm:hidden" />
      </div>

      {/* Right content panel */}
      <div className="flex flex-1 flex-col justify-between p-6 lg:p-8">
        {/* Top section */}
        <div>
          {/* Post number badge */}
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
            {String(index + 2).padStart(2, "0")}
          </span>

          {/* Date row */}
          <div className="mt-2 flex items-center gap-1.5">
            <Calendar size={11} className="text-[#C9A84C]" />
            <span className="text-[11px] text-white/50">{formatDate(post.createdAt)}</span>
          </div>

          {/* Gold micro-divider */}
          <div className="my-3 h-px w-8 bg-gradient-to-r from-[#C9A84C] to-transparent" />

          {/* Title */}
          <h3 className="font-serif text-xl font-light leading-snug text-white transition-colors duration-300 group-hover:text-[#E8C96A] line-clamp-2 lg:text-2xl">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mt-2 text-sm leading-relaxed text-white/55 line-clamp-3">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C9A84C] transition-all duration-300 group-hover:gap-3">
            Read Article <ArrowRight size={11} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function BlogPage() {
  const rows = await db
    .select({
      slug: blogPostsTable.slug,
      title: blogPostsTable.title,
      excerpt: blogPostsTable.excerpt,
      coverImage: blogPostsTable.coverImage,
      createdAt: blogPostsTable.createdAt,
      authorName: userTable.name,
    })
    .from(blogPostsTable)
    .leftJoin(userTable, eq(blogPostsTable.authorId, userTable.id))
    .where(eq(blogPostsTable.published, true))
    .orderBy(desc(blogPostsTable.createdAt));

  const [featured, ...rest] = rows;

  return (
    <main className="min-h-screen bg-[#1C1209]">
      <Header />

      {/* ── Page hero banner ── */}
      <section className="relative flex h-72 items-end overflow-hidden sm:h-80 lg:h-96">
        <Image
          src="/images/sigiriya-hero.jpg"
          alt="Sri Lanka landscape"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-12 lg:px-12">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-[#C9A84C] to-transparent" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A84C]">
              Travel Journal
            </span>
          </div>
          <h1 className="font-serif text-4xl font-light leading-tight text-white sm:text-5xl lg:text-6xl">
            Stories &amp;{" "}
            <span
              className="italic"
              style={{
                background: "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Insights
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-sm font-light leading-relaxed text-white/70 sm:text-base">
            Guides, cultural discoveries and travel inspiration curated by our expert team.
          </p>
        </div>
      </section>

      {/* ── Content area ── */}
      <section className="px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">

          {/* Empty state */}
          {rows.length === 0 && (
            <div className="flex justify-center py-16">
              <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 px-10 py-16 text-center backdrop-blur-sm">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10">
                  <BookOpen size={28} className="text-[#C9A84C]" strokeWidth={1.25} />
                </div>
                <div className="mx-auto mb-6 h-px w-10 bg-gradient-to-r from-transparent via-[#C9A84C]/60 to-transparent" />
                <h2 className="mb-3 font-serif text-2xl font-light text-white">
                  Our Journal is Being Crafted
                </h2>
                <p className="mb-8 text-sm leading-relaxed text-white/50">
                  We are preparing exceptional travel stories and guides for you. In the meantime, explore our curated tours.
                </p>
                <Link
                  href="/tours"
                  className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1C1209] transition-all duration-300 hover:bg-[#E8C96A]"
                >
                  Explore Tours <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          )}

          {/* Posts layout */}
          {rows.length > 0 && (
            <div className="space-y-6">

              {/* Section header */}
              <div className="mb-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-gradient-to-r from-[#C9A84C] to-transparent" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A84C]">
                    {rows.length} {rows.length === 1 ? "Story" : "Stories"}
                  </span>
                </div>
                <div className="h-px flex-1 mx-6 bg-white/5" />
                <span className="text-[11px] text-white/25 uppercase tracking-[0.16em]">
                  Sri Lanka
                </span>
              </div>

              {/* Featured post — full width */}
              {featured && <FeaturedCard post={featured} />}

              {/* Remaining posts — responsive grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {rest.map((post, i) => (
                    <GridCard key={post.slug} post={post} index={i} />
                  ))}
                </div>
              )}

              {/* Bottom CTA strip */}
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-8 py-5">
                <div>
                  <p className="font-serif text-lg font-light text-white">
                    Ready to experience Sri Lanka?
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    Let our experts craft your perfect itinerary.
                  </p>
                </div>
                <Link
                  href="/booking"
                  className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1C1209] transition-all duration-300 hover:bg-[#E8C96A]"
                >
                  Book a Tour <ArrowRight size={12} />
                </Link>
              </div>

            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

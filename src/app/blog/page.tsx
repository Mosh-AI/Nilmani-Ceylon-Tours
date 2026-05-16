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

/* ── Hero post — dominant full-width card ── */
function HeroPost({ post }: { post: Post }) {
  const img = post.coverImage ?? "/images/sigiriya-hero.jpg";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex min-h-[520px] overflow-hidden rounded-2xl lg:min-h-[600px]"
    >
      <Image
        src={img}
        alt={post.title}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        sizes="(max-width: 1024px) 100vw, 1200px"
        priority
      />
      {/* gradient — bottom heavy */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10 transition-opacity duration-500 group-hover:from-black/80" />

      {/* eyebrow top-left */}
      <div className="absolute left-8 top-8 flex items-center gap-3">
        <div className="h-px w-6 bg-[#C9A84C]" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C9A84C]">
          Featured Story
        </span>
      </div>

      {/* content pinned to bottom */}
      <div className="relative mt-auto w-full p-8 lg:p-12">
        <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-white/55">
          <span className="flex items-center gap-1.5">
            <Calendar size={11} className="text-[#C9A84C]" />
            {formatDate(post.createdAt)}
          </span>
          {post.authorName && (
            <span className="flex items-center gap-1.5">
              <User size={11} className="text-[#C9A84C]" />
              {post.authorName}
            </span>
          )}
        </div>
        <div className="mb-5 h-px w-14 bg-gradient-to-r from-[#C9A84C] to-transparent" />
        <h2 className="mb-4 max-w-3xl font-serif text-3xl font-light leading-snug text-white transition-colors duration-300 group-hover:text-[#E8C96A] lg:text-5xl">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mb-7 max-w-2xl text-sm leading-relaxed text-white/65 line-clamp-2 lg:text-base">
            {post.excerpt}
          </p>
        )}
        <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/50 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C9A84C] transition-all duration-300 group-hover:border-[#C9A84C] group-hover:bg-[#C9A84C]/10 group-hover:gap-3">
          Read Article <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}

/* ── Standard grid card — tall image with overlay ── */
function GridCard({ post, index }: { post: Post; index: number }) {
  const img = post.coverImage ?? "/images/sigiriya-hero.jpg";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex min-h-[380px] overflow-hidden rounded-2xl"
    >
      <Image
        src={img}
        alt={post.title}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      {/* gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/30 to-transparent transition-opacity duration-500 group-hover:from-black/78" />

      {/* post number badge top-right */}
      <div className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur-sm">
        <span className="text-[10px] font-semibold text-white/70">
          {String(index + 2).padStart(2, "0")}
        </span>
      </div>

      {/* content */}
      <div className="relative mt-auto w-full p-6">
        <div className="mb-3 flex items-center gap-1.5 text-[11px] text-white/50">
          <Calendar size={10} className="text-[#C9A84C]" />
          {formatDate(post.createdAt)}
        </div>
        <div className="mb-3 h-px w-8 bg-gradient-to-r from-[#C9A84C] to-transparent" />
        <h3 className="mb-3 font-serif text-xl font-light leading-snug text-white transition-colors duration-300 group-hover:text-[#E8C96A] line-clamp-2 lg:text-2xl">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mb-4 text-xs leading-relaxed text-white/60 line-clamp-2">
            {post.excerpt}
          </p>
        )}
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C9A84C] transition-all duration-300 group-hover:gap-2.5">
          Read Article <ArrowRight size={11} />
        </span>
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

  const [hero, ...rest] = rows;

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

              {/* Hero post — full width */}
              {hero && <HeroPost post={hero} />}

              {/* Remaining posts — responsive grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

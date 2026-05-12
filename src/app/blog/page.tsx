export const revalidate = 60;

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlogCard } from "@/components/BlogCard";
import { db } from "@/db";
import { blogPosts as blogPostsTable, user as userTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Travel Journal | Nilmani Ceylon Tours",
  description:
    "Discover Sri Lanka through our travel journal — guides, cultural insights, hidden gems and inspiration for your next luxury journey.",
};

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

  return (
    <main className="min-h-screen bg-brand-bg">
      <Header />

      {/* Hero banner */}
      <section className="relative flex h-72 items-end overflow-hidden bg-brand-surface sm:h-80 lg:h-96">
        <Image
          src="/images/sigiriya-hero.jpg"
          alt="Sri Lanka landscape"
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
              Travel Journal
            </span>
          </div>
          <h1 className="font-serif text-3xl leading-tight font-light text-white sm:text-4xl lg:text-5xl">
            Stories from{" "}
            <span className="text-gold-gradient italic">Sri Lanka</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm font-light leading-relaxed text-white/80 sm:text-base">
            Guides, cultural discoveries and travel inspiration curated by our
            expert team.
          </p>
        </div>
      </section>

      {/* Blog grid */}
      <section className="px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          {rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-6 flex items-center gap-3">
                <div className="gold-divider" />
                <span className="text-xs font-medium uppercase tracking-luxury text-gold">
                  Coming Soon
                </span>
                <div className="gold-divider" />
              </div>
              <h2 className="mb-4 font-serif text-3xl font-light text-brand-text sm:text-4xl">
                Our Journal is Being Crafted
              </h2>
              <p className="mb-10 max-w-md text-sm leading-relaxed text-brand-muted">
                We are preparing exceptional travel stories and guides for you.
                In the meantime, explore our curated tours.
              </p>
              <Link
                href="/tours"
                className="btn-gold inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold tracking-luxury"
              >
                Explore Tours
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {rows.map((post) => (
                <BlogCard key={post.slug} {...post} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

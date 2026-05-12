export const revalidate = 60;

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { db } from "@/db";
import { blogPosts as blogPostsTable, user as userTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { Calendar, User, ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const rows = await db
    .select({ slug: blogPostsTable.slug })
    .from(blogPostsTable)
    .where(eq(blogPostsTable.published, true));

  return rows.map((row) => ({ slug: row.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const [post] = await db
    .select({
      title: blogPostsTable.title,
      excerpt: blogPostsTable.excerpt,
      metaTitle: blogPostsTable.metaTitle,
      metaDescription: blogPostsTable.metaDescription,
      coverImage: blogPostsTable.coverImage,
    })
    .from(blogPostsTable)
    .where(and(eq(blogPostsTable.slug, slug), eq(blogPostsTable.published, true)))
    .limit(1);

  if (!post) {
    return { title: "Post Not Found | Nilmani Ceylon Tours" };
  }

  const title = post.metaTitle ?? post.title;
  const description =
    post.metaDescription ?? post.excerpt ?? "Read this travel story from Nilmani Ceylon Tours.";

  return {
    title: `${title} | Nilmani Ceylon Tours`,
    description,
    openGraph: post.coverImage
      ? { images: [{ url: post.coverImage }] }
      : undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const [post] = await db
    .select({
      title: blogPostsTable.title,
      content: blogPostsTable.content,
      excerpt: blogPostsTable.excerpt,
      coverImage: blogPostsTable.coverImage,
      createdAt: blogPostsTable.createdAt,
      updatedAt: blogPostsTable.updatedAt,
      authorName: userTable.name,
    })
    .from(blogPostsTable)
    .leftJoin(userTable, eq(blogPostsTable.authorId, userTable.id))
    .where(and(eq(blogPostsTable.slug, slug), eq(blogPostsTable.published, true)))
    .limit(1);

  if (!post) notFound();

  const imageSrc = post.coverImage ?? "/images/sigiriya-hero.jpg";

  return (
    <main className="min-h-screen bg-brand-bg">
      <Header />

      {/* Hero cover image */}
      <section className="relative flex h-80 items-end overflow-hidden bg-brand-surface sm:h-96 lg:h-[28rem]">
        <Image
          src={imageSrc}
          alt={post.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
        <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-12 lg:px-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="gold-divider" />
            <span className="text-xs font-medium uppercase tracking-luxury text-gold">
              Travel Journal
            </span>
          </div>
          <h1 className="font-serif text-3xl leading-tight font-light text-white sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
        </div>
      </section>

      {/* Article body */}
      <article className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-20">
        {/* Back link + meta */}
        <div className="mb-10 flex flex-col gap-6 border-b border-brand-border pb-8 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-luxury text-brand-muted transition-colors hover:text-gold"
          >
            <ArrowLeft size={13} />
            Back to Journal
          </Link>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-brand-muted">
            <span className="flex items-center gap-1.5">
              <Calendar size={11} className="text-gold" />
              {formatDate(post.createdAt)}
            </span>
            {post.authorName && (
              <span className="flex items-center gap-1.5">
                <User size={11} className="text-gold" />
                {post.authorName}
              </span>
            )}
          </div>
        </div>

        {/* Excerpt lead */}
        {post.excerpt && (
          <p className="mb-10 font-serif text-xl font-light leading-relaxed text-brand-text/80 italic sm:text-2xl">
            {post.excerpt}
          </p>
        )}

        {/* Gold divider */}
        <div className="mb-10 flex items-center gap-3">
          <div className="gold-divider" />
          <span
            className="size-1.5 rounded-full bg-gold/60"
            aria-hidden="true"
          />
          <div className="gold-divider" />
        </div>

        {/* Main content */}
        {post.content ? (
          <div
            className="prose prose-sm sm:prose-base max-w-none
              prose-headings:font-serif prose-headings:font-light prose-headings:text-brand-text
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-brand-muted prose-p:leading-relaxed
              prose-a:text-gold prose-a:no-underline hover:prose-a:underline
              prose-strong:text-brand-text prose-strong:font-semibold
              prose-ul:text-brand-muted prose-ol:text-brand-muted
              prose-li:leading-relaxed
              prose-blockquote:border-l-gold prose-blockquote:text-brand-muted prose-blockquote:italic
              prose-hr:border-brand-border"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : (
          <p className="text-sm italic text-brand-faint">
            No content available for this post.
          </p>
        )}

        {/* Footer CTA */}
        <div className="mt-16 border-t border-brand-border pt-12">
          <div className="rounded-2xl border border-gold/20 bg-brand-surface p-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="gold-divider" />
              <span className="text-xs font-medium uppercase tracking-luxury text-gold">
                Ready to Explore?
              </span>
              <div className="gold-divider" />
            </div>
            <h2 className="mb-3 font-serif text-2xl font-light text-brand-text sm:text-3xl">
              Turn Inspiration into Your Journey
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-brand-muted">
              Let our expert team craft a bespoke Sri Lanka itinerary tailored
              to your interests and pace.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <Link
                href="/booking"
                className="btn-gold inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold tracking-luxury"
              >
                Book Your Tour
              </Link>
              <Link
                href="/blog"
                className="btn-outline-gold inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold tracking-luxury"
              >
                Read More Stories
              </Link>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}

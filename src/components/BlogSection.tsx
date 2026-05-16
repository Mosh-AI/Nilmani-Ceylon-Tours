import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Calendar, User } from "lucide-react";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  createdAt: Date;
  authorName: string | null;
}

interface BlogSectionProps {
  posts: BlogPost[];
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/* ── Full-width hero card (used when there is exactly 1 post) ── */
function HeroCard({ post }: { post: BlogPost }) {
  const image = post.coverImage ?? "/images/sigiriya-hero.jpg";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex min-h-[420px] overflow-hidden rounded-2xl lg:min-h-[500px]"
    >
      {/* Background image */}
      <Image
        src={image}
        alt={post.title}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        sizes="(max-width: 1024px) 100vw, 1200px"
        priority
      />

      {/* Gradient overlay — strong at bottom, subtle top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 transition-opacity duration-500 group-hover:from-black/75" />

      {/* Top-left: eyebrow */}
      <div className="absolute left-6 top-6 flex items-center gap-3">
        <div className="h-px w-6 bg-[#C9A84C]" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C9A84C]">
          Latest from the Journal
        </span>
      </div>

      {/* Bottom content */}
      <div className="relative mt-auto w-full p-6 lg:p-10">
        {/* Meta */}
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

        {/* Gold divider */}
        <div className="mb-4 h-px w-12 bg-gradient-to-r from-[#C9A84C] to-transparent" />

        <h3 className="mb-3 max-w-2xl font-serif text-3xl font-light leading-snug text-white transition-colors duration-300 group-hover:text-[#E8C96A] lg:text-4xl">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mb-6 max-w-xl text-sm leading-relaxed text-white/65 line-clamp-2">
            {post.excerpt}
          </p>
        )}

        <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/50 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C9A84C] transition-all duration-300 group-hover:border-[#C9A84C] group-hover:bg-[#C9A84C]/10 group-hover:gap-3">
          Read Article
          <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}

/* ── Featured card (large left slot in magazine layout) ── */
function FeaturedCard({ post }: { post: BlogPost }) {
  const image = post.coverImage ?? "/images/sigiriya-hero.jpg";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex min-h-[480px] overflow-hidden rounded-2xl"
    >
      <Image
        src={image}
        alt={post.title}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="(max-width: 1024px) 100vw, 60vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 group-hover:from-black/80" />

      <div className="relative mt-auto w-full p-7">
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/60">
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
        <div className="mb-4 h-px w-10 bg-gradient-to-r from-[#C9A84C] to-transparent" />
        <h3 className="mb-3 font-serif text-2xl font-light leading-snug text-white transition-colors duration-300 group-hover:text-[#C9A84C] lg:text-3xl">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mb-5 max-w-lg text-sm leading-relaxed text-white/70 line-clamp-2">
            {post.excerpt}
          </p>
        )}
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C9A84C] transition-all duration-300 group-hover:gap-3">
          Read Article <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}

/* ── Standard card (right column in magazine layout) ── */
function StandardCard({ post }: { post: BlogPost }) {
  const image = post.coverImage ?? "/images/sigiriya-hero.jpg";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 hover:border-[#C9A84C]/30 hover:bg-white/8"
    >
      <div className="relative w-28 shrink-0 overflow-hidden sm:w-32">
        <Image
          src={image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="128px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
        <div>
          <div className="mb-2.5 flex items-center gap-1.5 text-[11px] text-white/50">
            <Calendar size={10} className="shrink-0 text-[#C9A84C]" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <div className="mb-2.5 h-px w-6 bg-gradient-to-r from-[#C9A84C]/70 to-transparent" />
          <h3 className="font-serif text-base font-light leading-snug text-white transition-colors duration-300 group-hover:text-[#C9A84C] line-clamp-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-2 text-xs leading-relaxed text-white/55 line-clamp-2">
              {post.excerpt}
            </p>
          )}
        </div>
        <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#C9A84C] transition-all duration-300 group-hover:gap-2.5">
          Read <ArrowRight size={11} />
        </span>
      </div>
    </Link>
  );
}

/* ── Section ── */
export function BlogSection({ posts }: BlogSectionProps) {
  return (
    <section className="bg-[#1C1209] px-6 py-20 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">

        {/* Section header */}
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-[#C9A84C] to-transparent" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A84C]">
                From the Journal
              </span>
            </div>
            <h2 className="font-serif text-4xl font-light leading-tight text-white md:text-5xl">
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
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/45 sm:text-base">
              Travel guides, cultural discoveries and inspiration for your Sri Lanka journey.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 self-start rounded-full border border-[#C9A84C]/35 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C9A84C] transition-all duration-300 hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 sm:self-end"
          >
            View All Posts <ArrowRight size={13} />
          </Link>
        </div>

        {/* ── Empty state ── */}
        {posts.length === 0 && (
          <div className="flex justify-center py-8">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 px-10 py-14 text-center backdrop-blur-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10">
                <BookOpen size={28} className="text-[#C9A84C]" strokeWidth={1.25} />
              </div>
              <div className="mx-auto mb-6 h-px w-10 bg-gradient-to-r from-transparent via-[#C9A84C]/60 to-transparent" />
              <h3 className="mb-3 font-serif text-2xl font-light text-white">
                Our Travel Journal is Coming Soon
              </h3>
              <p className="mb-8 text-sm leading-relaxed text-white/50">
                Stories, guides and cultural insights for your Sri Lanka journey — arriving shortly.
              </p>
              <Link
                href="/tours"
                className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1C1209] transition-all duration-300 hover:bg-[#E8C96A]"
              >
                Explore Our Tours <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        )}

        {/* ── Single post: full-width hero ── */}
        {posts.length === 1 && (
          <div className="space-y-6">
            <HeroCard post={posts[0]} />

            {/* Teaser strip below hero */}
            <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C9A84C]/25 bg-[#C9A84C]/10">
                  <BookOpen size={14} className="text-[#C9A84C]" strokeWidth={1.5} />
                </div>
                <p className="text-xs text-white/40">
                  More travel stories and Sri Lanka guides <span className="text-[#C9A84C]">coming soon</span>
                </p>
              </div>
              <Link
                href="/tours"
                className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C9A84C]/70 transition-colors duration-200 hover:text-[#C9A84C]"
              >
                Explore Tours →
              </Link>
            </div>
          </div>
        )}

        {/* ── 2–3 posts: magazine layout ── */}
        {posts.length >= 2 && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
            {/* Featured post — large left */}
            <div className="lg:col-span-3">
              <FeaturedCard post={posts[0]} />
            </div>

            {/* Secondary posts — stacked right */}
            <div className="flex flex-col gap-5 lg:col-span-2">
              {posts.slice(1, 3).map((post) => (
                <StandardCard key={post.slug} post={post} />
              ))}

              {posts.slice(1, 3).length < 2 && (
                <div className="flex flex-1 items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] p-8 text-center">
                  <div>
                    <div className="mx-auto mb-3 h-px w-8 bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
                    <p className="text-[11px] uppercase tracking-[0.16em] text-white/25">More stories coming soon</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

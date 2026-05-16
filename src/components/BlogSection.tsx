import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { BlogCard } from "./BlogCard";

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

export function BlogSection({ posts }: BlogSectionProps) {
  return (
    <section className="bg-[#1C1209] px-6 py-20 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">

        {/* Section header */}
        <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            {/* Eyebrow */}
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-[#C9A84C] to-transparent" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">
                From the Journal
              </span>
            </div>

            <h2 className="font-serif text-4xl font-light leading-tight text-white md:text-5xl">
              Stories &amp;{" "}
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
                Insights
              </span>
            </h2>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/50 sm:text-base">
              Stories, guides and cultural discoveries for your Sri Lanka journey.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 self-start rounded-full border border-[#C9A84C]/40 px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#C9A84C] transition-all duration-300 hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 sm:self-end"
          >
            View All Articles
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Empty state */}
        {posts.length === 0 ? (
          <div className="flex justify-center py-8">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 px-10 py-14 text-center backdrop-blur-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10">
                <BookOpen size={28} className="text-[#C9A84C]" strokeWidth={1.25} />
              </div>

              {/* Gold micro-divider */}
              <div className="mx-auto mb-6 h-px w-10 bg-gradient-to-r from-transparent via-[#C9A84C]/60 to-transparent" />

              <h3 className="mb-3 font-serif text-2xl font-light text-white">
                Our Travel Journal is Coming Soon
              </h3>
              <p className="mb-8 text-sm leading-relaxed text-white/50">
                Stories, guides and cultural insights for your Sri Lanka journey — arriving shortly.
              </p>

              <Link
                href="/tours"
                className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-7 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#1C1209] transition-all duration-300 hover:bg-[#E8C96A]"
              >
                Explore Our Tours
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ) : (
          /* Magazine grid */
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
            {/* Featured post — large left column */}
            <div className="lg:col-span-3">
              <BlogCard {...posts[0]} variant="featured" />
            </div>

            {/* Secondary posts — stacked right column */}
            <div className="flex flex-col gap-5 lg:col-span-2">
              {posts.slice(1, 3).map((post) => (
                <BlogCard key={post.slug} {...post} variant="standard" />
              ))}

              {/* Fill remaining space if only 1 secondary post */}
              {posts.slice(1, 3).length < 2 && (
                <div className="flex flex-1 items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] p-8 text-center">
                  <div>
                    <div className="mx-auto mb-4 h-px w-8 bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
                    <p className="text-xs text-white/30 uppercase tracking-[0.15em]">More stories coming soon</p>
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

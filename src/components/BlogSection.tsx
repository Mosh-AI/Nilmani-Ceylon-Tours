import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
  if (posts.length === 0) return null;

  return (
    <section className="bg-brand-surface px-6 py-20 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="gold-divider" />
              <span className="text-xs font-medium uppercase tracking-luxury text-gold">
                From the Journal
              </span>
            </div>
            <h2 className="font-serif text-4xl font-light leading-tight text-brand-text md:text-5xl">
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
            <p className="mt-4 max-w-md text-sm leading-relaxed text-brand-muted sm:text-base">
              Travel guides, cultural discoveries and inspiration for your
              Sri Lanka journey.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 self-start rounded-full border border-brand-border px-6 py-3 text-xs font-semibold tracking-luxury text-brand-text transition-all duration-300 hover:border-gold/50 hover:text-gold sm:self-end"
          >
            View All Posts
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Blog cards grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>
      </div>
    </section>
  );
}

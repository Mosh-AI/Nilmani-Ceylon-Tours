import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  createdAt: Date;
  authorName: string | null;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function BlogCard({
  slug,
  title,
  excerpt,
  coverImage,
  createdAt,
  authorName,
}: BlogCardProps) {
  const imageSrc = coverImage ?? "/images/sigiriya-hero.jpg";

  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-brand-border bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-gold/30 hover:shadow-xl"
    >
      {/* Cover image */}
      <div className="relative h-52 overflow-hidden sm:h-60">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Meta row */}
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-brand-muted">
          <span className="flex items-center gap-1.5">
            <Calendar size={11} className="text-gold" />
            {formatDate(createdAt)}
          </span>
          {authorName && (
            <span className="flex items-center gap-1.5">
              <User size={11} className="text-gold" />
              {authorName}
            </span>
          )}
        </div>

        {/* Gold micro-divider */}
        <div className="mb-4 h-px w-8 bg-gradient-to-r from-gold/60 to-transparent" />

        <h3 className="mb-3 font-serif text-xl font-light leading-snug text-brand-text lg:text-2xl line-clamp-2">
          {title}
        </h3>

        {excerpt && (
          <p className="mb-6 flex-1 text-sm leading-relaxed text-brand-muted line-clamp-3">
            {excerpt}
          </p>
        )}

        <span className="mt-auto inline-flex items-center gap-2 text-xs font-medium uppercase tracking-luxury text-gold transition-all duration-300 group-hover:gap-3">
          Read Article
          <ArrowRight size={13} />
        </span>
      </div>
    </Link>
  );
}

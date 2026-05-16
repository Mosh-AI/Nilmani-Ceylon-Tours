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
  variant?: "featured" | "standard";
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
  variant = "standard",
}: BlogCardProps) {
  const imageSrc = coverImage ?? "/images/sigiriya-hero.jpg";

  if (variant === "featured") {
    return (
      <Link
        href={`/blog/${slug}`}
        className="group relative flex min-h-[480px] overflow-hidden rounded-2xl"
      >
        {/* Full-bleed image */}
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
        />

        {/* Gradient overlay — bottom-up */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 group-hover:from-black/80 group-hover:via-black/30" />

        {/* Content pinned to bottom */}
        <div className="relative mt-auto w-full p-8">
          {/* Meta row */}
          <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/60">
            <span className="flex items-center gap-1.5">
              <Calendar size={11} className="text-[#C9A84C]" />
              {formatDate(createdAt)}
            </span>
            {authorName && (
              <span className="flex items-center gap-1.5">
                <User size={11} className="text-[#C9A84C]" />
                {authorName}
              </span>
            )}
          </div>

          {/* Gold micro-divider */}
          <div className="mb-4 h-px w-10 bg-gradient-to-r from-[#C9A84C] to-transparent" />

          <h3 className="mb-3 font-serif text-2xl font-light leading-snug text-white transition-colors duration-300 group-hover:text-[#C9A84C] lg:text-3xl">
            {title}
          </h3>

          {excerpt && (
            <p className="mb-6 max-w-lg text-sm leading-relaxed text-white/70 line-clamp-2">
              {excerpt}
            </p>
          )}

          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#C9A84C] transition-all duration-300 group-hover:gap-3">
            Read Article
            <ArrowRight size={13} />
          </span>
        </div>
      </Link>
    );
  }

  /* Standard variant — horizontal card */
  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 hover:border-[#C9A84C]/30 hover:bg-white/8"
    >
      {/* Image — left column, fixed width */}
      <div className="relative w-28 shrink-0 overflow-hidden sm:w-32">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="128px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
      </div>

      {/* Text — right column */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
        <div>
          {/* Meta */}
          <div className="mb-2.5 flex items-center gap-1.5 text-[11px] text-white/50">
            <Calendar size={10} className="text-[#C9A84C] shrink-0" />
            <span>{formatDate(createdAt)}</span>
          </div>

          {/* Gold micro-divider */}
          <div className="mb-2.5 h-px w-6 bg-gradient-to-r from-[#C9A84C]/70 to-transparent" />

          <h3 className="font-serif text-base font-light leading-snug text-white transition-colors duration-300 group-hover:text-[#C9A84C] line-clamp-2">
            {title}
          </h3>

          {excerpt && (
            <p className="mt-2 text-xs leading-relaxed text-white/55 line-clamp-2">
              {excerpt}
            </p>
          )}
        </div>

        <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#C9A84C] transition-all duration-300 group-hover:gap-2.5">
          Read
          <ArrowRight size={11} />
        </span>
      </div>
    </Link>
  );
}

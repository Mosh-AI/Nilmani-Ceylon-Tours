import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href
        ? { item: `https://nilmaniceylontours.com${item.href}` }
        : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <nav
        aria-label="Breadcrumb"
        className={`font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground${className ? ` ${className}` : ""}`}
      >
        <ol className="flex items-center gap-1.5 flex-wrap">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={item.label} className="flex items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight
                    className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0"
                    aria-hidden="true"
                  />
                )}
                {isLast ? (
                  <span
                    className="font-semibold text-foreground"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : item.href ? (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

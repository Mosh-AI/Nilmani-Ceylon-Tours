import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nilmaniceylontours.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // ── Static routes ────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/gallery`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/booking`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  // ── Dynamic routes (future: database-driven tours) ───────────────
  //
  // When tours are stored in the database, fetch them here:
  //
  //   const tours = await db.query.tours.findMany({
  //     columns: { slug: true, updatedAt: true },
  //   });
  //
  //   const tourRoutes: MetadataRoute.Sitemap = tours.map((tour) => ({
  //     url: `${BASE_URL}/tours/${tour.slug}`,
  //     lastModified: tour.updatedAt,
  //     changeFrequency: "weekly" as const,
  //     priority: 0.8,
  //   }));
  //
  // Then spread into the return: [...staticRoutes, ...tourRoutes]

  return staticRoutes;
}

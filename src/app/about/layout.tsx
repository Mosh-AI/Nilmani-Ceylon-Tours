import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Nilmani Ceylon Tours and founder Roshan Jayasuriya. Based in Seeduwa, Sri Lanka, we offer personalized private chauffeur-driven tours across the island — cultural heritage, wildlife safaris, hill country, and beach escapes.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | Nilmani Ceylon Tours",
    description:
      "Meet Roshan Jayasuriya and discover why Nilmani Ceylon Tours is the trusted choice for authentic, personalized Sri Lanka travel experiences.",
    url: "https://nilmaniceylontours.com/about",
    images: [
      {
        url: "/images/sigiriya-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Sigiriya Rock Fortress - Nilmani Ceylon Tours",
      },
    ],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://nilmaniceylontours.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "About Us",
      item: "https://nilmaniceylontours.com/about",
    },
  ],
};

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {children}
    </>
  );
}

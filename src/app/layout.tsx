import type { Metadata } from "next";
import { Cormorant, Montserrat } from "next/font/google";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CookieConsent } from "@/components/CookieConsent";
import "./globals.css";

const cormorant = Cormorant({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nilmaniceylontours.com"),
  title: {
    default: "Nilmani Ceylon Tours \u2014 Luxury Sri Lanka Travel",
    template: "%s | Nilmani Ceylon Tours",
  },
  description:
    "Premium Sri Lanka tour experiences with private chauffeurs. Explore ancient temples, pristine beaches, wildlife safaris, and tea country with Nilmani Ceylon Tours.",
  keywords: [
    "sri lanka private driver",
    "sri lanka private tour",
    "luxury sri lanka travel",
    "sri lanka chauffeur service",
    "sri lanka tour packages",
    "sri lanka guided tours",
    "sri lanka holiday packages",
    "sri lanka travel agency",
    "sri lanka safari tours",
    "sri lanka cultural tours",
    "sri lanka beach holidays",
    "nilmani ceylon tours",
  ],
  authors: [{ name: "Nilmani Ceylon Tours" }],
  creator: "Nilmani Ceylon Tours",
  publisher: "Nilmani Ceylon Tours",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nilmani Ceylon Tours",
    title: "Nilmani Ceylon Tours \u2014 Luxury Sri Lanka Travel",
    description:
      "Premium Sri Lanka tour experiences with private chauffeurs. Explore ancient temples, pristine beaches, wildlife safaris, and tea country.",
    url: "https://nilmaniceylontours.com",
    images: [
      {
        url: "/images/sigiriya-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Sigiriya Rock Fortress - Nilmani Ceylon Tours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nilmani Ceylon Tours \u2014 Luxury Sri Lanka Travel",
    description:
      "Premium Sri Lanka tour experiences with private chauffeurs. Explore ancient temples, pristine beaches, wildlife safaris, and tea country.",
    images: ["/images/sigiriya-hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.webmanifest",
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Nilmani Ceylon Tours",
  description:
    "Premium Sri Lanka tour experiences with private chauffeurs. Explore ancient temples, pristine beaches, wildlife safaris, and tea country with personalized itineraries.",
  url: "https://nilmaniceylontours.com",
  telephone: "+94XXXXXXXXXX", // TODO: Replace with real phone number
  email: "info@nilmaniceylontours.com", // TODO: Replace with real email
  address: {
    "@type": "PostalAddress",
    addressLocality: "Seeduwa",
    addressCountry: "LK",
  },
  areaServed: { "@type": "Country", name: "Sri Lanka" },
  priceRange: "$$",
  image: "https://nilmaniceylontours.com/images/logo.png",
  sameAs: [], // TODO: Add social profile URLs
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Nilmani Ceylon Tours",
  url: "https://nilmaniceylontours.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://nilmaniceylontours.com/tours?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable} h-full font-sans`}
    >
      <body className="min-h-screen bg-brand-bg">
        {children}
        <WhatsAppButton />
        <CookieConsent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd).replace(
              /</g,
              "\\u003c"
            ),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}

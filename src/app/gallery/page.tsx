import type { Metadata } from "next";
import { GalleryContent } from "./gallery-content";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description:
    "Explore stunning photos from Sri Lanka — ancient temples, pristine beaches, wildlife safaris, lush tea plantations, and vibrant local culture captured through our tours.",
  openGraph: {
    title: "Photo Gallery | Nilmani Ceylon Tours",
    description:
      "Explore stunning photos from Sri Lanka — ancient temples, pristine beaches, wildlife safaris, lush tea plantations, and vibrant local culture.",
    images: [
      {
        url: "/images/sigiriya-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Sri Lanka Photo Gallery - Nilmani Ceylon Tours",
      },
    ],
  },
};

export default function GalleryPage() {
  return <GalleryContent />;
}

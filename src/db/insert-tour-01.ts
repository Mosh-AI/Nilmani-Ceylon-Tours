/**
 * One-time: insert Tour 01 (Cultural Tour Package) into the database.
 * Run with: npx tsx src/db/insert-tour-01.ts
 */

import "dotenv/config";
import { db } from "./index";
import { tours } from "./schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Inserting Tour 01 — Sri Lanka Cultural Tour Package...");

  await db
    .insert(tours)
    .values({
      slug: "cultural-tour-package-5-days",
      title: "Sri Lanka Cultural Tour Package",
      subtitle: "Sigiriya \u2192 Dambulla \u2192 Kandy \u2192 Ella \u2192 Yala \u2192 Colombo Airport",
      description:
        "Experience the rich heritage, scenic landscapes, and wildlife of Sri Lanka on this carefully designed 5-day cultural journey. " +
        "This tour blends ancient history, hill country beauty, and thrilling wildlife encounters while staying in comfortable 3-star hotels " +
        "with daily breakfast, private chauffeur-guided travel, and seamless service.",
      duration: 5,
      price: 1170,
      difficulty: "Easy",
      maxGroup: 2,
      category: "Cultural",
      featured: true,
      available: true,
      heroImage: "/images/sigiriya-hero.jpg",
      highlights: [
        "Climb the iconic Sigiriya Rock Fortress (UNESCO World Heritage Site)",
        "Enjoy an authentic Sigiriya village tour with local transport and cooking",
        "Explore the Dambulla Cave Temple with golden Buddha statues and ancient murals",
        "Visit the Temple of the Sacred Tooth Relic in the royal city of Kandy",
        "Attend a vibrant Kandy Cultural Dance Show",
        "Tour a tea factory and plantation in the misty Nuwara Eliya highlands",
        "Discover the Buduruwagala rock-carved Buddha statues",
        "Walk across the iconic Nine Arches Bridge in Ella",
        "Hike to Little Adam\u2019s Peak for breathtaking valley panoramas",
        "Marvel at the cascading Ravana Falls",
        "Spot leopards, elephants, crocodiles, and exotic birds at Yala National Park",
        "Seamless airport pick-up and drop-off",
      ],
      whatsIncluded: [
        "Private air-conditioned vehicle with professional chauffeur guide",
        "4 nights accommodation in 3\u2605 hotels",
        "Daily breakfast (BB basis)",
        "Airport pick-up and drop-off",
        "Fuel, parking, and highway charges",
        "Driver accommodation and meals",
        "All government taxes",
      ],
      whatsExcluded: [
        "Entrance fees to attractions (Sigiriya, Dambulla, Kandy, Yala, etc.)",
        "Lunch and dinner",
        "Personal expenses (beverages, laundry, shopping, etc.)",
        "Tips and gratuities",
        "Camera and video permits",
        "Travel insurance",
        "International air tickets",
      ],
      images: ["/images/sigiriya-hero.jpg", "/images/sigiriya.jpg", "/images/ella.jpg", "/images/yala.jpg"],
      metaTitle: "5-Day Sri Lanka Cultural Tour Package | Nilmani Ceylon Tours",
      metaDescription:
        "Private 5-day Sri Lanka cultural tour: Sigiriya, Dambulla, Kandy, Ella & Yala safari. 3-star hotels, daily breakfast, professional chauffeur. $1,170 for 2 persons.",
      focusKeyword: "sri lanka cultural tour package 5 days",
    })
    .onConflictDoNothing();

  // Confirm it's active
  await db
    .update(tours)
    .set({ available: true })
    .where(eq(tours.slug, "cultural-tour-package-5-days"));

  console.log("  \u2713 Tour 01 inserted and set to active.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});

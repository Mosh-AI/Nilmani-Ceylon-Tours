/**
 * Database seed script for Nilmani Ceylon Tours.
 * Run with: npx tsx src/db/seed.ts
 *
 * Seeds: admin user, site settings, sample tours, gallery images, testimonials.
 */

import "dotenv/config";
import { db } from "./index";
import {
  user,
  siteSettings,
  tours,
  destinations,
  tourDestinations,
  galleryImages,
  testimonials,
} from "./schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

/* ── Helpers ────────────────────────────────────────────────────────────── */

function hashPassword(password: string): string {
  // Better Auth uses its own password hashing internally.
  // This seed creates the user record directly with a bcrypt-style placeholder.
  // On first login Better Auth will validate against its own hash store.
  // Proper approach: use Better Auth's admin API or set password via sign-up.
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/* ── Admin User ─────────────────────────────────────────────────────────── */

async function seedAdminUser() {
  console.log("Seeding admin user...");

  const existingAdmin = await db
    .select()
    .from(user)
    .where(eq(user.email, "roshan@nilmaniceylontours.com"))
    .limit(1);

  if (existingAdmin.length > 0) {
    console.log("  Admin user already exists, skipping.");
    return;
  }

  await db.insert(user).values({
    id: crypto.randomUUID(),
    name: "Roshan Jayasuriya",
    email: "roshan@nilmaniceylontours.com",
    emailVerified: true,
    role: "admin",
  });

  console.log("  Admin user created: roshan@nilmaniceylontours.com");
  console.log("  IMPORTANT: Set password via /admin/setup or Better Auth sign-up flow.");
}

/* ── Site Settings ──────────────────────────────────────────────────────── */

async function seedSiteSettings() {
  console.log("Seeding site settings...");

  const settings: Array<{ key: string; value: string }> = [
    { key: "site_name", value: "Nilmani Ceylon Tours" },
    { key: "site_tagline", value: "Luxury Sri Lanka Travel" },
    { key: "contact_email", value: "roshan@nilmaniceylontours.com" },
    { key: "contact_phone", value: "+94 77 XXX XXXX" },
    { key: "whatsapp_number", value: "94XXXXXXXXX" },
    { key: "address", value: "Seeduwa, Sri Lanka" },
    { key: "tripadvisor_url", value: "" },
    { key: "facebook_url", value: "" },
    { key: "instagram_url", value: "" },
    { key: "booking_deposit_percent", value: "20" },
    { key: "currency", value: "USD" },
  ];

  for (const setting of settings) {
    await db
      .insert(siteSettings)
      .values(setting)
      .onConflictDoNothing();
  }

  console.log(`  ${settings.length} settings seeded.`);
}

/* ── Destinations ───────────────────────────────────────────────────────── */

async function seedDestinations() {
  console.log("Seeding destinations...");

  const dests = [
    { slug: "colombo", name: "Colombo", region: "Western", lat: 6.9271, lng: 79.8612 },
    { slug: "kandy", name: "Kandy", region: "Central", lat: 7.2906, lng: 80.6337 },
    { slug: "sigiriya", name: "Sigiriya", region: "North Central", lat: 7.9570, lng: 80.7603 },
    { slug: "ella", name: "Ella", region: "Uva", lat: 6.8667, lng: 81.0465 },
    { slug: "galle", name: "Galle", region: "Southern", lat: 6.0535, lng: 80.2210 },
    { slug: "yala", name: "Yala", region: "Southern", lat: 6.3553, lng: 81.5179 },
    { slug: "nuwara-eliya", name: "Nuwara Eliya", region: "Central", lat: 6.9497, lng: 80.7891 },
    { slug: "anuradhapura", name: "Anuradhapura", region: "North Central", lat: 8.3114, lng: 80.4037 },
    { slug: "dambulla", name: "Dambulla", region: "Central", lat: 7.8742, lng: 80.6511 },
    { slug: "mirissa", name: "Mirissa", region: "Southern", lat: 5.9483, lng: 80.4716 },
  ];

  for (const dest of dests) {
    await db
      .insert(destinations)
      .values({ ...dest })
      .onConflictDoNothing();
  }

  console.log(`  ${dests.length} destinations seeded.`);
}

/* ── Sample Tours ───────────────────────────────────────────────────────── */

async function seedTours() {
  console.log("Seeding sample tours...");

  const sampleTours = [
    {
      slug: "classic-sri-lanka-8-days",
      title: "Classic Sri Lanka",
      subtitle: "The Essential Island Experience",
      description:
        "Discover the highlights of Sri Lanka on this perfectly crafted 8-day journey. " +
        "From the ancient ruins of Sigiriya to the misty tea hills of Ella and the golden beaches of the South Coast.",
      duration: 8,
      price: 1200,
      difficulty: "Easy" as const,
      maxGroup: 8,
      category: "Cultural & Nature",
      featured: true,
      available: true,
      highlights: [
        "Climb Sigiriya Rock Fortress at sunrise",
        "Temple of the Tooth Relic in Kandy",
        "Scenic train ride through tea country",
        "Nine Arches Bridge at Ella",
        "Galle Fort colonial walk",
        "Blue whale watching at Mirissa",
      ],
      heroImage: "/images/sigiriya-hero.jpg",
      metaTitle: "8-Day Classic Sri Lanka Private Tour | Nilmani Ceylon Tours",
      metaDescription:
        "Private 8-day Sri Lanka tour covering Sigiriya, Kandy, Ella, Galle & Mirissa. Expert driver-guide. From $1,200/person.",
    },
    {
      slug: "wildlife-safari-5-days",
      title: "Sri Lanka Wildlife Safari",
      subtitle: "Leopards, Elephants & Whales",
      description:
        "Experience Sri Lanka's incredible biodiversity on this 5-day wildlife-focused safari. " +
        "Track leopards in Yala, watch elephants gather at Minneriya, and spot blue whales off Mirissa.",
      duration: 5,
      price: 850,
      difficulty: "Easy" as const,
      maxGroup: 6,
      category: "Wildlife",
      featured: true,
      available: true,
      highlights: [
        "Yala National Park leopard safari",
        "Minneriya elephant gathering",
        "Blue whale watching boat trip",
        "Udawalawa elephant orphanage",
        "Bird watching in Bundala",
      ],
      heroImage: "/images/yala.jpg",
      metaTitle: "5-Day Sri Lanka Wildlife Safari | Nilmani Ceylon Tours",
      metaDescription:
        "Private 5-day Sri Lanka wildlife safari. Yala leopards, Minneriya elephants, Mirissa blue whales. Expert naturalist guide.",
    },
    {
      slug: "cultural-triangle-4-days",
      title: "Cultural Triangle",
      subtitle: "Ancient Cities of Ceylon",
      description:
        "Explore the UNESCO World Heritage sites of Sri Lanka's Cultural Triangle. " +
        "Anuradhapura, Polonnaruwa, Sigiriya and the magnificent Dambulla Cave Temple await.",
      duration: 4,
      price: 650,
      difficulty: "Moderate" as const,
      maxGroup: 8,
      category: "Cultural & Heritage",
      featured: false,
      available: true,
      highlights: [
        "Sigiriya Rock Fortress (UNESCO)",
        "Dambulla Cave Temple (UNESCO)",
        "Ancient city of Anuradhapura (UNESCO)",
        "Polonnaruwa ruins (UNESCO)",
        "Traditional village experience",
      ],
      heroImage: "/images/sigiriya.jpg",
      metaTitle: "4-Day Sri Lanka Cultural Triangle Tour | Nilmani Ceylon Tours",
      metaDescription:
        "Private 4-day Cultural Triangle tour covering Sigiriya, Anuradhapura, Polonnaruwa and Dambulla. Expert heritage guide.",
    },
  ];

  for (const tour of sampleTours) {
    await db
      .insert(tours)
      .values({
        ...tour,
        whatsIncluded: ["Private air-conditioned vehicle", "English-speaking driver-guide", "Hotel accommodation", "Breakfast daily"],
        whatsExcluded: ["International flights", "Travel insurance", "Entrance fees", "Lunch and dinner"],
        images: [tour.heroImage],
      })
      .onConflictDoNothing();
  }

  console.log(`  ${sampleTours.length} tours seeded.`);
}

/* ── Gallery Images ─────────────────────────────────────────────────────── */

async function seedGallery() {
  console.log("Seeding gallery images...");

  const images = [
    { url: "/images/sigiriya-hero.jpg", alt: "Sigiriya Rock Fortress at sunrise", category: "Landmarks", sortOrder: 1 },
    { url: "/images/sigiriya.jpg", alt: "Sigiriya Lion Rock aerial view", category: "Landmarks", sortOrder: 2 },
    { url: "/images/ella.jpg", alt: "Ella Nine Arches Bridge with train", category: "Landscapes", sortOrder: 3 },
    { url: "/images/galle.jpg", alt: "Galle Fort lighthouse at dusk", category: "Landmarks", sortOrder: 4 },
    { url: "/images/yala.jpg", alt: "Sri Lanka leopard in Yala National Park", category: "Wildlife", sortOrder: 5 },
    { url: "/images/beach-cta.jpg", alt: "Golden beach on the south coast of Sri Lanka", category: "Beaches", sortOrder: 6 },
  ];

  for (const img of images) {
    await db
      .insert(galleryImages)
      .values({ ...img })
      .onConflictDoNothing();
  }

  console.log(`  ${images.length} gallery images seeded.`);
}

/* ── Testimonials ───────────────────────────────────────────────────────── */

async function seedTestimonials() {
  console.log("Seeding testimonials...");

  const items = [
    {
      guestName: "Sarah & James",
      country: "United Kingdom",
      rating: 5,
      text: "Roshan made our honeymoon in Sri Lanka absolutely magical. Every detail was taken care of, the hotels were stunning, and his local knowledge was invaluable. We'll definitely be back!",
      approved: true,
    },
    {
      guestName: "Familie Weber",
      country: "Germany",
      rating: 5,
      text: "Wir haben eine unvergessliche 10-tägige Tour durch Sri Lanka genossen. Roshan war immer pünktlich, sehr professionell und kannte alle versteckten Schätze der Insel.",
      approved: true,
    },
    {
      guestName: "The Andersons",
      country: "Australia",
      rating: 5,
      text: "Best tour operator in Sri Lanka, hands down. Roshan went above and beyond at every step. The wildlife safari in Yala was a once-in-a-lifetime experience.",
      approved: true,
    },
  ];

  for (const item of items) {
    await db
      .insert(testimonials)
      .values({ ...item, tourId: null });
  }

  console.log(`  ${items.length} testimonials seeded.`);
}

/* ── Main ───────────────────────────────────────────────────────────────── */

async function main() {
  console.log("Starting database seed...\n");

  await seedAdminUser();
  await seedSiteSettings();
  await seedDestinations();
  await seedTours();
  await seedGallery();
  await seedTestimonials();

  console.log("\nSeed completed successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

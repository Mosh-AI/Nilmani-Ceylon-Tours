/**
 * Seed real guest testimonials with photos.
 *
 * Run on VPS after deployment:
 *   npx tsx src/db/seed-testimonials.ts
 *
 * Safe to re-run — existing rows are left untouched (insert is skipped
 * if a testimonial with the same guestName already exists).
 * The ALTER TABLE is idempotent (IF NOT EXISTS).
 */

import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "./index";
import { testimonials } from "./schema";

const TESTIMONIAL_DATA = [
  {
    guestName: "Corinne & Randy",
    country: "United States",
    rating: 5,
    text: "One of the best Nilmani Ceylon Tours trip, and it was fabulous!! Our local home-grown guide was Roshan. He picked us up in a large air conditioned 18 person deluxe bus and brought along a dedicated very SAFE driver named Sanju, and another talented gentleman named Malaka who did everything else to make us all comfortable and arrive safely to our next destination. They took care of our bags, communicated with the hotels in advance to make sure everything was set up upon our arrival, helped Amber make any last-minute plans, found plenty of potty stops along the way, and had a plethora of knowledge, advice, and recommendations for anything that we needed during our 13 day adventure. They were so professional in every way, and they really just added to the wonderful experience that everyone had on this journey. They actually became part of our tribe because there were a couple of last-minute cancellations so Amber graciously added them to all the prepaid adventures! I think their hearts were as full as ours when they joined us for zip lining, splashing at the waterfall, catamaran cruise, etc. And, the extra added Temple of the Woman that Roshan suggested along the way was a huge hit. Yes, it's a business, but, their love and caring for us all along our journey is something I will never forget.",
    photoUrl: "/images/testimonials/t1.png",
  },
  {
    guestName: "Martina Waldherr",
    country: "Germany",
    rating: 5,
    text: "We had an unforgettable experience traveling through Sri Lanka with Nilmani Ceylon Tours. From the very beginning, everything was perfectly organized and tailored to our preferences. As a couple visiting from Germany, we truly appreciated the warm hospitality, attention to detail, and the genuine care shown throughout our journey. Our guide, Roshan, was incredibly knowledgeable, friendly, and always made us feel safe and comfortable. Every destination from the cultural sites to the beautiful landscapes was explained with passion and insight, making our trip even more meaningful. The accommodations, transport, and overall service exceeded our expectations. We felt relaxed, well taken care of, and able to fully enjoy every moment of our holiday. We highly recommend Nilmani Ceylon Tours to anyone looking for a reliable, professional, and truly memorable travel experience in Sri Lanka. Thank you for giving us memories we will cherish forever!",
    photoUrl: "/images/testimonials/t2.png",
  },
  {
    guestName: "Lorraine Ostrum",
    country: "Hawaii",
    rating: 5,
    text: "Bravo! This trip exceeded my expectations! Roshan & his capable crew, kept our group safe & joyful throughout our 12 day excursion around the magical island of Sri Lanka! They treated us with kindness & respect & were adaptable to our individual needs. I will, forever, have fond memories of our time on the island. I highly recommend utilizing Nilmani Ceylon Tours on your travels to Sri Lanka. Cheers, Bunny",
    photoUrl: "/images/testimonials/t3.png",
  },
  {
    guestName: "Heidi Hirsh",
    country: "Hawaii",
    rating: 5,
    text: "Roshan and the Nilmani Ceylon Tours team are the greatest. They drove us all around Sri Lanka in their beautiful, spacious and comfortable bus for 12 days. They hauled 10 peoples suitcases in and out of the bus up and downstairs everywhere we went and they were completely professional and supportive. They went out of their way to meet our requests and needs. I highly recommend these guys for your travel needs in Sri Lanka.",
    photoUrl: "/images/testimonials/t4.png",
  },
  {
    guestName: "Tony & Debra",
    country: "Hawaii",
    rating: 5,
    text: "Traveling with Nilmani Ceylon Tours for 13 days was truly an unforgettable experience. From the very beginning, everything was perfectly organized, allowing us to relax and fully enjoy the beauty of Sri Lanka. As part of a group, we were impressed by how smoothly everything was handled. Roshan and his team showed exceptional professionalism, always making sure every detail was taken care of. The itinerary was well-balanced, giving us a wonderful mix of culture, nature, and leisure without ever feeling rushed. What stood out the most was the genuine care and attention we received throughout the journey. Whether it was accommodating special requests or ensuring everyone in the group was comfortable and happy, the team went above and beyond. We created incredible memories, visited breathtaking places, and felt truly welcomed every step of the way. We would highly recommend Nilmani Ceylon Tours to anyone looking for a well-organized, warm, and memorable travel experience in Sri Lanka. Thank you again for an amazing journey!",
    photoUrl: "/images/testimonials/t5.png",
  },
  {
    guestName: "Diana Joy",
    country: "Hawaii",
    rating: 5,
    text: "Our 13-day journey with Nilmani Ceylon Tours was truly unforgettable, not only for the incredible experiences but also for the exceptional care we received throughout. During the trip, I unfortunately twisted my leg, which could have easily disrupted the entire experience. However, Roshan and his team handled the situation with such professionalism, kindness, and genuine concern. They made sure I received proper care immediately and continued to support me every step of the way until the very end of the tour. Despite the incident, I was still able to enjoy the beauty of Sri Lanka thanks to their thoughtful adjustments and constant attention. The team went above and beyond to ensure my comfort, safety, and well-being, which meant so much to me. This level of dedication and heartfelt service truly sets Nilmani Ceylon Tours apart. I'm deeply grateful for their support and would highly recommend them to anyone seeking not just a tour, but a team that truly cares about their guests.",
    photoUrl: "/images/testimonials/t6.png",
  },
  {
    guestName: "Angela L.",
    country: "Singapore",
    rating: 5,
    text: "I had the most amazing experience in Sri Lanka with Roshan as a private guide and driver! As a solo traveller, I always felt safe and well taken care of throughout the 8 days we visited beautiful places in Nuwara Eliya, Ella, Galle and Yala. Highlights include elephant safaris, beautiful tea plantations in the mountains and a historical cave temple among many other stunning locations. Roshan is very responsible, punctual and always ready to share his knowledge about local culture. It was lovely chatting with him on the road and was so happy to have made a wonderful friend in Sri Lanka. Highly recommend Nilmani Tours and Roshan for your next trip to Sri Lanka. You won't regret it!",
    photoUrl: "/images/testimonials/t7.png",
  },
  {
    guestName: "Dario Pastorelli",
    country: "United States",
    rating: 5,
    text: "Working with Nilmani Ceylon Tours has been a seamless and highly rewarding experience. The level of professionalism, attention to detail, and genuine passion for delivering authentic travel experiences clearly sets this company apart. Every aspect of the journey is handled with precision and care, ensuring a smooth, enjoyable, and memorable trip. What stands out most is the personalized approach — each itinerary feels thoughtfully curated rather than transactional. In a market where service often falls short, Nilmani consistently overdelivers. I would confidently recommend their services to anyone seeking a well-organized, high-quality travel experience in Sri Lanka.",
    photoUrl: "/images/testimonials/t8.png",
  },
] as const;

async function main() {
  console.log("🌱 Seeding testimonials...\n");

  // Add photo_url column if it doesn't exist yet (idempotent)
  await db.execute(
    sql`ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS photo_url text`
  );
  console.log("✅ Column photo_url ensured\n");

  let inserted = 0;
  let skipped = 0;

  for (const t of TESTIMONIAL_DATA) {
    // Check if already exists
    const existing = await db.execute(
      sql`SELECT id FROM testimonials WHERE guest_name = ${t.guestName} LIMIT 1`
    );

    if ((existing as unknown as { rows: unknown[] }).rows?.length > 0 || (Array.isArray(existing) && existing.length > 0)) {
      console.log(`⏭️  Skipping "${t.guestName}" (already exists)`);
      skipped++;
      continue;
    }

    await db.insert(testimonials).values({
      guestName: t.guestName,
      country: t.country,
      rating: t.rating,
      text: t.text,
      photoUrl: t.photoUrl,
      approved: true,
    });

    console.log(`✅ Inserted: ${t.guestName} (${t.country})`);
    inserted++;
  }

  console.log(`\n🎉 Done — ${inserted} inserted, ${skipped} skipped`);
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

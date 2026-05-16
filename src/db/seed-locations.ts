// Run with: npx tsx src/db/seed-locations.ts

import { db } from "./index";
import { locations } from "./schema";
import { SRI_LANKA_LOCATIONS } from "@/data/sri-lanka-locations";

async function main() {
  console.log("Seeding locations…");

  await db
    .insert(locations)
    .values(
      SRI_LANKA_LOCATIONS.map((loc) => ({
        slug: loc.slug,
        name: loc.name,
        region: loc.region,
        mapX: loc.mapX,
        mapY: loc.mapY,
        lat: loc.lat,
        lng: loc.lng,
      }))
    )
    .onConflictDoNothing();

  console.log(`Done — seeded up to ${SRI_LANKA_LOCATIONS.length} locations.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

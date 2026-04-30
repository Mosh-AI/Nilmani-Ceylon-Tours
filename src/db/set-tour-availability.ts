/**
 * One-time script: set all tours to available=false EXCEPT cultural-tour-package-5-days.
 * Run with: npx tsx src/db/set-tour-availability.ts
 */

import "dotenv/config";
import { db } from "./index";
import { tours } from "./schema";
import { eq, ne } from "drizzle-orm";

async function main() {
  console.log("Deactivating all tours except cultural-tour-package-5-days...");

  // Deactivate all other tours
  const deactivated = await db
    .update(tours)
    .set({ available: false })
    .where(ne(tours.slug, "cultural-tour-package-5-days"))
    .returning({ slug: tours.slug });

  // Ensure Tour 01 is active
  await db
    .update(tours)
    .set({ available: true })
    .where(eq(tours.slug, "cultural-tour-package-5-days"));

  console.log(`  Deactivated ${deactivated.length} tours:`, deactivated.map(t => t.slug));
  console.log("  cultural-tour-package-5-days → active ✓");
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});

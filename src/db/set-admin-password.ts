/**
 * One-time: set admin password for roshan@nilmaniceylontours.com
 * Run with: npx tsx src/db/set-admin-password.ts
 */

import "dotenv/config";
import { db } from "./index";
import { user, account } from "./schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

// Better Auth uses: <salt>:<hash> with scrypt
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${hash.toString("hex")}`;
}

const ADMIN_EMAIL = "roshan@nilmaniceylontours.com";
const ADMIN_PASSWORD = "NilmaniAdmin2024!";

async function main() {
  console.log(`Setting password for ${ADMIN_EMAIL}...`);

  // Find admin user
  const [adminUser] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, ADMIN_EMAIL))
    .limit(1);

  if (!adminUser) {
    console.error("Admin user not found. Run seed first.");
    process.exit(1);
  }

  const hashed = await hashPassword(ADMIN_PASSWORD);

  // Upsert credential account record
  const [existing] = await db
    .select({ id: account.id })
    .from(account)
    .where(eq(account.userId, adminUser.id))
    .limit(1);

  if (existing) {
    await db
      .update(account)
      .set({ password: hashed, updatedAt: new Date() })
      .where(eq(account.userId, adminUser.id));
    console.log("  Password updated on existing account record.");
  } else {
    await db.insert(account).values({
      id: crypto.randomUUID(),
      userId: adminUser.id,
      accountId: adminUser.id,
      providerId: "credential",
      password: hashed,
    });
    console.log("  New credential account record created.");
  }

  console.log("\n✅ Admin credentials:");
  console.log(`   Email   : ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log("\n  Login at: https://nilmaniceylontours.com/login");
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});

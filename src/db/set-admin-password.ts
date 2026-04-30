/**
 * One-time: set admin password using Better Auth's exact scrypt parameters.
 * Run with: npx tsx src/db/set-admin-password.ts
 */

import "dotenv/config";
import { db } from "./index";
import { user, account } from "./schema";
import { eq } from "drizzle-orm";
import { randomBytes, scrypt } from "node:crypto";
import crypto from "crypto";

// Exact parameters from @better-auth/utils/dist/password.node.mjs
const SCRYPT_CONFIG = { N: 16384, r: 16, p: 1, dkLen: 64 };

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const key = await new Promise<Buffer>((resolve, reject) => {
    scrypt(
      password.normalize("NFKC"),
      salt,
      SCRYPT_CONFIG.dkLen,
      {
        N: SCRYPT_CONFIG.N,
        r: SCRYPT_CONFIG.r,
        p: SCRYPT_CONFIG.p,
        maxmem: 128 * SCRYPT_CONFIG.N * SCRYPT_CONFIG.r * 2,
      },
      (err, key) => (err ? reject(err) : resolve(key as Buffer))
    );
  });
  return `${salt}:${key.toString("hex")}`;
}

const ADMIN_EMAIL = "roshan@nilmaniceylontours.com";
const ADMIN_PASSWORD = "NilmaniAdmin2024!";

async function main() {
  console.log(`Setting password for ${ADMIN_EMAIL}...`);

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
    console.log("  Password updated.");
  } else {
    await db.insert(account).values({
      id: crypto.randomUUID(),
      userId: adminUser.id,
      accountId: adminUser.id,
      providerId: "credential",
      password: hashed,
    });
    console.log("  Credential account created.");
  }

  console.log("\n✅ Done:");
  console.log(`   Email   : ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});

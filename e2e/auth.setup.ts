import { test as setup, expect } from "@playwright/test";
import path from "path";

export const ADMIN_STATE_FILE = path.join(__dirname, ".auth/admin.json");

const ADMIN_EMAIL = process.env.ADMIN_TEST_EMAIL ?? "testadmin@nilmani.test";
const ADMIN_PASSWORD = process.env.ADMIN_TEST_PASSWORD ?? "TestAdmin@2026";

setup("authenticate as admin", async ({ page }) => {
  await page.goto("/login", { waitUntil: "networkidle" });
  await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
  await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(/\/(dashboard|admin)/, { timeout: 15_000 });

  // Verify we're logged in
  await expect(page).not.toHaveURL(/\/login/);

  // Save session to file
  await page.context().storageState({ path: ADMIN_STATE_FILE });
});

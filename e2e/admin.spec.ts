import { test, expect } from "@playwright/test";
import { navigateTo } from "./helpers";

/**
 * Admin E2E Tests
 * Pre-condition: test DB has admin user seeded via globalSetup
 * These tests use storageState from auth.setup.ts (once implemented)
 */

test.describe("Admin Dashboard", () => {
  test("unauthenticated user is redirected from /admin to /login", async ({ page }) => {
    await page.goto("/admin");
    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
  });

  test("admin login page has sign-in form", async ({ page }) => {
    await navigateTo(page, "/login");
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test("admin bookings page is protected", async ({ page }) => {
    await page.goto("/admin/bookings");
    await expect(page).toHaveURL(/\/login/);
  });

  test("admin tours page is protected", async ({ page }) => {
    await page.goto("/admin/tours");
    await expect(page).toHaveURL(/\/login/);
  });
});

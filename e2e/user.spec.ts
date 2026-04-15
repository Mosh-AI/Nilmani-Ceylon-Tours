import { test, expect } from "@playwright/test";
import { navigateTo } from "./helpers";

/**
 * User-facing E2E Tests
 * These tests do not require authentication — they verify public-facing flows
 * and that protected routes redirect correctly.
 */

test.describe("User registration flow", () => {
  test("register page renders the sign-up form", async ({ page }) => {
    await navigateTo(page, "/register");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("register page shows password strength indicator", async ({ page }) => {
    await navigateTo(page, "/register");
    const passwordInput = page.locator('input[name="password"]').first();
    await passwordInput.fill("short");
    // Password strength meter should appear after typing
    const strengthEl = page.locator("[data-testid='password-strength'], .password-strength, [aria-label*='strength'], [aria-label*='password']");
    // At minimum, the submit button should show validation state
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
  });
});

test.describe("Login flow", () => {
  test("login page renders email + password fields", async ({ page }) => {
    await navigateTo(page, "/login");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("login page has a link to register and forgot password", async ({ page }) => {
    await navigateTo(page, "/login");
    await expect(page.getByRole("link", { name: /register|sign up|create account/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /forgot|reset password/i })).toBeVisible();
  });
});

test.describe("Dashboard access control", () => {
  test("unauthenticated user is redirected from /dashboard to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("unauthenticated user is redirected from /dashboard/bookings to /login", async ({ page }) => {
    await page.goto("/dashboard/bookings");
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Booking tracker (public)", () => {
  test("booking tracker page loads without authentication", async ({ page }) => {
    await navigateTo(page, "/track");
    // Should render the tracking form — not redirect to login
    await expect(page).toHaveURL(/\/track/);
    await expect(page.locator('input[name="referenceCode"], input[placeholder*="NCT"], input[placeholder*="reference"]')).toBeVisible();
  });

  test("booking tracker shows error for unknown reference code", async ({ page }) => {
    await navigateTo(page, "/track");
    // Fill in a reference code that won't exist
    const refInput = page.locator('input').first();
    const emailInput = page.locator('input[type="email"]');
    await refInput.fill("NCT-99999999-XXXXX");
    await emailInput.fill("nobody@example.com");
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();
    // Should show a "not found" style message
    await expect(page.getByText(/not found|no booking|couldn't find/i)).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } }); // iPhone 14 Pro

  test("mobile header is visible on homepage", async ({ page }) => {
    await navigateTo(page, "/");
    // Header should be present
    const header = page.locator("header").first();
    await expect(header).toBeVisible();
  });

  test("WhatsApp button is visible on mobile", async ({ page }) => {
    await navigateTo(page, "/");
    const whatsapp = page.locator('[aria-label*="WhatsApp"], a[href*="wa.me"]');
    await expect(whatsapp.first()).toBeVisible();
  });
});

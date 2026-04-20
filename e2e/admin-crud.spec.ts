/**
 * Admin CRUD E2E Tests
 * Tests full create / read / update / delete flows for every admin section.
 * Uses storageState from auth.setup.ts — no login overhead per test.
 */
import { test, expect } from "@playwright/test";
import { ADMIN_STATE_FILE } from "../playwright.config";

test.use({ storageState: ADMIN_STATE_FILE });

// ─── TOURS ───────────────────────────────────────────────────────────────────

test.describe("Tours CRUD", () => {
  const TOUR_TITLE = `E2E Test Tour ${Date.now()}`;
  const TOUR_TITLE_EDITED = `E2E Test Tour Edited ${Date.now()}`;
  let tourEditUrl = "";

  test("create a new tour", async ({ page }) => {
    await page.goto("/admin/tours/new", { waitUntil: "networkidle" });

    // Fill required fields
    await page.getByLabel("Title *").fill(TOUR_TITLE);
    // Slug is auto-generated — verify it got set
    await expect(page.getByLabel("Slug *")).not.toHaveValue("");

    // Fill description
    await page.getByLabel("Description *").fill(
      "A beautiful E2E test tour through the scenic highlands of Sri Lanka."
    );

    // Pricing & logistics
    await page.getByLabel("Duration (days) *").fill("7");
    await page.getByLabel("Price (USD) *").fill("1200");

    // Submit
    await page.getByRole("button", { name: /Create Tour/i }).click();

    // Should redirect back to tours list
    await expect(page).toHaveURL(/\/admin\/tours$/, { timeout: 10_000 });

    // New tour should appear in the list
    await expect(page.getByText(TOUR_TITLE)).toBeVisible();
  });

  test("edit an existing tour", async ({ page }) => {
    await page.goto("/admin/tours", { waitUntil: "networkidle" });

    // Find the tour we just created and click Edit
    const row = page.getByText(TOUR_TITLE);
    await expect(row).toBeVisible();
    const editLink = page.getByText(TOUR_TITLE).locator("..").locator("..").getByRole("link", { name: /Edit/i });
    await editLink.click();

    await page.waitForURL(/\/admin\/tours\/.+\/edit/, { timeout: 10_000 });
    tourEditUrl = page.url();

    // Change the title
    const titleInput = page.getByLabel("Title *");
    await titleInput.clear();
    await titleInput.fill(TOUR_TITLE_EDITED);

    await page.getByRole("button", { name: /Save Changes/i }).click();

    // Redirect to tours list
    await expect(page).toHaveURL(/\/admin\/tours$/, { timeout: 10_000 });

    // Updated title visible
    await expect(page.getByText(TOUR_TITLE_EDITED)).toBeVisible();
  });

  test("toggle tour availability", async ({ page }) => {
    await page.goto("/admin/tours", { waitUntil: "networkidle" });

    // Find the edited tour row
    const row = page.getByText(TOUR_TITLE_EDITED).locator("../..").first();
    const toggle = row.getByRole("button", { name: /Enable tour|Disable tour/i });
    const initialLabel = await toggle.getAttribute("aria-label");

    await toggle.click();
    await page.waitForTimeout(500);

    // Label should have flipped
    const newLabel = await toggle.getAttribute("aria-label");
    expect(newLabel).not.toBe(initialLabel);
  });

  test("delete a tour from its edit page", async ({ page }) => {
    // Navigate directly to the edit page we saved earlier
    if (!tourEditUrl) {
      // Fallback: find via list
      await page.goto("/admin/tours", { waitUntil: "networkidle" });
      await page.getByText(TOUR_TITLE_EDITED).locator("..").locator("..").getByRole("link", { name: /Edit/i }).click();
      await page.waitForURL(/\/admin\/tours\/.+\/edit/, { timeout: 10_000 });
    } else {
      await page.goto(tourEditUrl, { waitUntil: "networkidle" });
    }

    // Click Delete button
    await page.getByRole("button", { name: /Delete Tour/i }).click();

    // Confirm the dialog
    page.on("dialog", (d) => d.accept());
    // Some implementations use window.confirm — handle it
    await page.evaluate(() => {
      window.confirm = () => true;
    });
    await page.getByRole("button", { name: /Delete Tour/i }).click();

    await expect(page).toHaveURL(/\/admin\/tours$/, { timeout: 10_000 });
    await expect(page.getByText(TOUR_TITLE_EDITED)).not.toBeVisible();
  });
});

// ─── BOOKINGS ────────────────────────────────────────────────────────────────

test.describe("Bookings CRUD", () => {
  test("bookings list loads and shows table or empty state", async ({ page }) => {
    await page.goto("/admin/bookings", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: "Bookings" })).toBeVisible();

    const hasTable = await page.locator("table").isVisible().catch(() => false);
    if (hasTable) {
      await expect(page.getByRole("columnheader", { name: "Reference" })).toBeVisible();
    } else {
      await expect(page.getByText(/will appear here|no bookings/i)).toBeVisible();
    }
  });

  test("can open booking detail and update status + notes", async ({ page }) => {
    await page.goto("/admin/bookings", { waitUntil: "networkidle" });

    const hasTable = await page.locator("table").isVisible().catch(() => false);
    if (!hasTable) {
      test.skip(); // No bookings to test with
      return;
    }

    // Click first booking's View link (the reference code link)
    const firstRef = page.locator("tbody tr").first().getByRole("link").first();
    await firstRef.click();
    await page.waitForURL(/\/admin\/bookings\/.+/, { timeout: 10_000 });

    // Page shows guest info section
    await expect(page.getByText("Guest Information")).toBeVisible();

    // Change status
    const statusSelect = page.locator("select").first();
    await statusSelect.selectOption("quoted");

    // Add admin notes
    const notesArea = page.getByPlaceholder(/internal notes/i);
    await notesArea.fill("E2E test note — please ignore.");

    // Save
    await page.getByRole("button", { name: /Save Changes/i }).click();
    await expect(page.getByText("Saved!")).toBeVisible({ timeout: 5_000 });
  });
});

// ─── BLOG ─────────────────────────────────────────────────────────────────────

test.describe("Blog CRUD", () => {
  const POST_TITLE = `E2E Test Post ${Date.now()}`;
  const POST_TITLE_EDITED = `E2E Edited Post ${Date.now()}`;
  let postEditUrl = "";

  test("create a new blog post", async ({ page }) => {
    await page.goto("/admin/blog/new", { waitUntil: "networkidle" });

    // Fill title (auto-generates slug)
    await page.getByLabel("Title *").fill(POST_TITLE);
    await expect(page.getByLabel("Slug *")).not.toHaveValue("");

    // Fill content
    await page.getByLabel("Content").fill(
      "<p>This is an E2E test blog post. It should be deleted after testing.</p>"
    );

    // Fill excerpt
    await page.getByLabel("Excerpt").fill("E2E test excerpt for the blog post.");

    // Submit
    await page.getByRole("button", { name: /Create Post/i }).click();

    // Redirect to blog list
    await expect(page).toHaveURL(/\/admin\/blog$/, { timeout: 10_000 });

    // Post appears in list
    await expect(page.getByText(POST_TITLE)).toBeVisible();
  });

  test("edit a blog post", async ({ page }) => {
    await page.goto("/admin/blog", { waitUntil: "networkidle" });

    // Find edit link for our post
    const editLink = page.getByText(POST_TITLE).locator("..").locator("..").getByRole("link", { name: /Edit/i });
    await editLink.click();
    await page.waitForURL(/\/admin\/blog\/.+\/edit/, { timeout: 10_000 });
    postEditUrl = page.url();

    // Edit title
    const titleInput = page.getByLabel("Title *");
    await titleInput.clear();
    await titleInput.fill(POST_TITLE_EDITED);

    await page.getByRole("button", { name: /Save Changes/i }).click();

    // Back to blog list with updated title
    await expect(page).toHaveURL(/\/admin\/blog$/, { timeout: 10_000 });
    await expect(page.getByText(POST_TITLE_EDITED)).toBeVisible();
  });

  test("publish and unpublish a blog post", async ({ page }) => {
    if (!postEditUrl) {
      await page.goto("/admin/blog", { waitUntil: "networkidle" });
      await page.getByText(POST_TITLE_EDITED).locator("..").locator("..").getByRole("link", { name: /Edit/i }).click();
      await page.waitForURL(/\/admin\/blog\/.+\/edit/, { timeout: 10_000 });
    } else {
      await page.goto(postEditUrl, { waitUntil: "networkidle" });
    }

    // Check current published state and toggle it
    const publishCheckbox = page.getByLabel(/Publish this post/i);
    const wasChecked = await publishCheckbox.isChecked();
    await publishCheckbox.setChecked(!wasChecked);

    await page.getByRole("button", { name: /Save Changes/i }).click();
    await expect(page).toHaveURL(/\/admin\/blog$/, { timeout: 10_000 });
  });

  test("delete a blog post", async ({ page }) => {
    await page.goto("/admin/blog", { waitUntil: "networkidle" });

    // Use the Delete button in the blog list row
    const row = page.getByText(POST_TITLE_EDITED).locator("../..").first();
    const deleteBtn = row.getByRole("button", { name: /Delete/i });

    // Handle confirm dialog
    page.once("dialog", (d) => d.accept());
    await deleteBtn.click();

    // Post should be gone
    await expect(page.getByText(POST_TITLE_EDITED)).not.toBeVisible({ timeout: 5_000 });
  });
});

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

test.describe("Testimonials CRUD", () => {
  test("testimonials list loads", async ({ page }) => {
    await page.goto("/admin/testimonials", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: "Testimonials" })).toBeVisible();
  });

  test("can toggle testimonial approved/hidden", async ({ page }) => {
    await page.goto("/admin/testimonials", { waitUntil: "networkidle" });

    const firstToggle = page.getByRole("button", { name: /Approved|Hidden/i }).first();
    const count = await firstToggle.count();
    if (count === 0) {
      test.skip(); // No testimonials seeded
      return;
    }

    const initialText = await firstToggle.innerText();
    await firstToggle.click();
    await page.waitForTimeout(600);

    // Text should have flipped
    const newText = await firstToggle.innerText();
    expect(newText.trim()).not.toBe(initialText.trim());

    // Toggle back to original state
    await firstToggle.click();
    await page.waitForTimeout(600);
  });
});

// ─── SETTINGS ─────────────────────────────────────────────────────────────────

test.describe("Settings CRUD", () => {
  test("settings form loads all field groups", async ({ page }) => {
    await page.goto("/admin/settings", { waitUntil: "networkidle" });

    await expect(page.getByRole("heading", { name: "Site Settings" })).toBeVisible();
    await expect(page.getByLabel("Contact Email")).toBeVisible();
    await expect(page.getByLabel("Phone Number")).toBeVisible();
    await expect(page.getByLabel("WhatsApp Number")).toBeVisible();
    await expect(page.getByLabel("Site Name")).toBeVisible();
  });

  test("can update and save a setting", async ({ page }) => {
    await page.goto("/admin/settings", { waitUntil: "networkidle" });

    // Update site tagline with a test value then revert
    const taglineInput = page.getByLabel("Tagline");
    const original = await taglineInput.inputValue();

    await taglineInput.clear();
    await taglineInput.fill("E2E Test Tagline");

    await page.getByRole("button", { name: /Save Settings/i }).click();
    await expect(page.getByText("Saved!")).toBeVisible({ timeout: 5_000 });

    // Revert to original
    await taglineInput.clear();
    await taglineInput.fill(original);
    await page.getByRole("button", { name: /Save Settings/i }).click();
    await expect(page.getByText("Saved!")).toBeVisible({ timeout: 5_000 });
  });
});

// ─── GALLERY ──────────────────────────────────────────────────────────────────

test.describe("Gallery CRUD", () => {
  test("gallery page loads with upload button", async ({ page }) => {
    await page.goto("/admin/gallery", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: "Gallery" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Upload Photos/i })).toBeVisible();
  });

  test("upload button triggers file input", async ({ page }) => {
    await page.goto("/admin/gallery", { waitUntil: "networkidle" });

    // The upload button is a label over a hidden file input
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
  });

  test("existing gallery images show delete buttons", async ({ page }) => {
    await page.goto("/admin/gallery", { waitUntil: "networkidle" });

    const images = page.locator("img[src]").filter({ hasNot: page.locator("[alt='logo']") });
    const count = await images.count();
    if (count > 0) {
      // Delete buttons should be visible for each image
      const deleteButtons = page.getByRole("button").filter({ has: page.locator("svg") });
      expect(await deleteButtons.count()).toBeGreaterThan(0);
    }
    // Empty state is also acceptable
  });
});

import { test, expect } from "@playwright/test";
import { VALID_BOOKING } from "./fixtures";
import {
  navigateTo,
  fillByLabel,
  selectByLabel,
  clickButton,
  expectSuccessMessage,
  expectValidationError,
} from "./helpers";

test.describe("Booking form", () => {
  test.beforeEach(async ({ page }) => {
    await navigateTo(page, "/booking");
  });

  test("completes all 3 steps with valid data", async ({ page }) => {
    // Step 1 — Trip details
    await selectByLabel(page, "Tour type", VALID_BOOKING.tourType);
    await fillByLabel(page, "Start date", VALID_BOOKING.startDate);
    await fillByLabel(page, "End date", VALID_BOOKING.endDate);
    await selectByLabel(page, "Adults", VALID_BOOKING.adults);
    await selectByLabel(page, "Children", VALID_BOOKING.children);

    await clickButton(page, "Next");

    // Step 2 — Personal info
    await fillByLabel(page, "First name", VALID_BOOKING.firstName);
    await fillByLabel(page, "Last name", VALID_BOOKING.lastName);
    await fillByLabel(page, "Email", VALID_BOOKING.email);
    await fillByLabel(page, "Phone", VALID_BOOKING.phone);
    await fillByLabel(page, "Nationality", VALID_BOOKING.nationality);
    await fillByLabel(
      page,
      "Special requests",
      VALID_BOOKING.specialRequests,
    );

    await clickButton(page, "Next");

    // Step 3 — Review & confirm
    // Verify key details are displayed on the review screen
    await expect(page.getByText(VALID_BOOKING.tourType)).toBeVisible();
    await expect(page.getByText(VALID_BOOKING.firstName)).toBeVisible();
    await expect(page.getByText(VALID_BOOKING.email)).toBeVisible();

    await clickButton(page, "Confirm");

    // Verify success — should show a booking reference code
    await expectSuccessMessage(page, "Booking confirmed");
    await expect(page.getByText(/REF-/)).toBeVisible({ timeout: 10_000 });
  });

  test("validates required fields on each step", async ({ page }) => {
    // Try to advance Step 1 without filling anything
    await clickButton(page, "Next");

    await expectValidationError(page, "Tour type is required");
    await expectValidationError(page, "Start date is required");

    // Verify we're still on Step 1 (not advanced)
    await expect(
      page.getByRole("heading", { name: /trip details/i }),
    ).toBeVisible();
  });
});

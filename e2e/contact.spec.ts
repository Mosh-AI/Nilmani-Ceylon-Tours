import { test, expect } from "@playwright/test";
import { VALID_CONTACT } from "./fixtures";
import {
  navigateTo,
  fillByLabel,
  clickButton,
  expectSuccessMessage,
  expectValidationError,
} from "./helpers";

test.describe("Contact form", () => {
  test.beforeEach(async ({ page }) => {
    await navigateTo(page, "/contact");
  });

  test("submits successfully with valid data", async ({ page }) => {
    await fillByLabel(page, "Name", VALID_CONTACT.name);
    await fillByLabel(page, "Email", VALID_CONTACT.email);
    await fillByLabel(page, "Phone", VALID_CONTACT.phone);
    await fillByLabel(page, "Subject", VALID_CONTACT.subject);
    await fillByLabel(page, "Message", VALID_CONTACT.message);

    await clickButton(page, "Send");

    await expectSuccessMessage(
      page,
      "Thank you! Your message has been sent.",
    );
  });

  test("shows validation errors for invalid input", async ({ page }) => {
    // Submit the form without filling any fields
    await clickButton(page, "Send");

    // Expect required-field validation errors
    await expectValidationError(page, "Name is required");
    await expectValidationError(page, "Email is required");
    await expectValidationError(page, "Message is required");

    // Verify the success message is NOT shown
    await expect(
      page.getByText("Thank you! Your message has been sent."),
    ).not.toBeVisible();
  });
});

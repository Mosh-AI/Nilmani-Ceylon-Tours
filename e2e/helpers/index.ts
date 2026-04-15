import { type Page, expect } from "@playwright/test";

/** Navigate to a page and wait for it to be fully loaded. */
export async function navigateTo(page: Page, path: string) {
  await page.goto(path, { waitUntil: "networkidle" });
}

/** Fill a form field identified by its label text. */
export async function fillByLabel(page: Page, label: string, value: string) {
  await page.getByLabel(label).fill(value);
}

/** Fill a form field identified by its placeholder text. */
export async function fillByPlaceholder(
  page: Page,
  placeholder: string,
  value: string,
) {
  await page.getByPlaceholder(placeholder).fill(value);
}

/** Click a button identified by its accessible name. */
export async function clickButton(page: Page, name: string) {
  await page.getByRole("button", { name }).click();
}

/** Assert that a success message is visible on the page. */
export async function expectSuccessMessage(page: Page, text: string) {
  await expect(page.getByText(text)).toBeVisible({ timeout: 10_000 });
}

/** Assert that a validation error is visible on the page. */
export async function expectValidationError(page: Page, text: string) {
  await expect(page.getByText(text)).toBeVisible();
}

/** Select an option from a dropdown/select identified by its label. */
export async function selectByLabel(
  page: Page,
  label: string,
  option: string,
) {
  await page.getByLabel(label).selectOption(option);
}

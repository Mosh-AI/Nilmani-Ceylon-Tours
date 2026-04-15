/* ── Honeypot Bot Detection ── */

/**
 * Check if a hidden honeypot field was filled by a bot.
 * Real users never see or fill these fields.
 */
export function isBot(formData: Record<string, unknown>): boolean {
  const honeypotFields = ["website", "url_field", "company_url"];
  return honeypotFields.some((field) => {
    const value = formData[field];
    return typeof value === "string" && value.trim().length > 0;
  });
}

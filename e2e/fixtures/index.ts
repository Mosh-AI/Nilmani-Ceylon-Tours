// Test data constants for E2E tests

export const VALID_CONTACT = {
  name: "Jane Perera",
  email: "jane.perera@example.com",
  phone: "+94 77 123 4567",
  subject: "Safari tour availability",
  message:
    "Hi, I would like to inquire about a 5-day wildlife safari tour for 2 adults in July 2026. Could you share available dates and pricing?",
} as const;

export const VALID_BOOKING = {
  // Step 1 — Trip details
  tourType: "Wildlife Safari",
  startDate: "2026-08-15",
  endDate: "2026-08-20",
  adults: "2",
  children: "0",

  // Step 2 — Personal info
  firstName: "James",
  lastName: "Fernando",
  email: "james.fernando@example.com",
  phone: "+94 71 987 6543",
  nationality: "Sri Lanka",
  specialRequests: "Vegetarian meals preferred.",

  // Step 3 is the review/confirm step — no new input
} as const;

export const INVALID_CONTACT = {
  emptyName: "",
  badEmail: "not-an-email",
  emptyMessage: "",
} as const;

export const INVALID_BOOKING = {
  emptyFirstName: "",
  badEmail: "bad@",
  missingDate: "",
} as const;

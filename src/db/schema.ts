/* ── Drizzle ORM Schema for Nilmani Ceylon Tours ── */

import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uuid,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

/* ────────────────────────────────────────────────────
 * Auth tables (managed by Better Auth, defined here
 * so Drizzle migrations own the DDL)
 * ──────────────────────────────────────────────────── */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: text("role", { enum: ["admin", "user"] }).notNull().default("user"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("user_email_idx").on(table.email),
]);

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("session_token_idx").on(table.token),
  index("session_user_id_idx").on(table.userId),
]);

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("account_user_id_idx").on(table.userId),
]);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("verification_identifier_idx").on(table.identifier),
]);

/* ────────────────────────────────────────────────────
 * Application tables
 * ──────────────────────────────────────────────────── */

export const tours = pgTable("tours", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  description: text("description").notNull(),
  duration: integer("duration").notNull(),
  price: integer("price").notNull(),
  priceUnit: text("price_unit").notNull().default("USD"),
  difficulty: text("difficulty", { enum: ["Easy", "Moderate", "Challenging"] }),
  maxGroup: integer("max_group"),
  category: text("category"),
  itinerary: jsonb("itinerary"),
  highlights: jsonb("highlights").$type<string[]>(),
  whatsIncluded: jsonb("whats_included").$type<string[]>(),
  whatsExcluded: jsonb("whats_excluded").$type<string[]>(),
  faqs: jsonb("faqs"),
  images: jsonb("images").$type<string[]>(),
  heroImage: text("hero_image"),
  featured: boolean("featured").notNull().default(false),
  available: boolean("available").notNull().default(true),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  focusKeyword: text("focus_keyword"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("tours_slug_idx").on(table.slug),
  index("tours_category_idx").on(table.category),
  index("tours_featured_idx").on(table.featured),
]);

export const destinations = pgTable("destinations", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
  region: text("region"),
  lat: real("lat"),
  lng: real("lng"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("destinations_slug_idx").on(table.slug),
  index("destinations_region_idx").on(table.region),
]);

export const tourDestinations = pgTable("tour_destinations", {
  tourId: uuid("tour_id").notNull().references(() => tours.id, { onDelete: "cascade" }),
  destinationId: uuid("destination_id").notNull().references(() => destinations.id, { onDelete: "cascade" }),
  dayNumber: integer("day_number"),
}, (table) => [
  primaryKey({ columns: [table.tourId, table.destinationId] }),
]);

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  referenceCode: text("reference_code").notNull(),
  tourId: uuid("tour_id").references(() => tours.id, { onDelete: "set null" }),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  guestName: text("guest_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  guests: integer("guests").notNull().default(1),
  specialRequests: text("special_requests"),
  status: text("status", {
    enum: [
      "inquiry",
      "quoted",
      "deposit_paid",
      "confirmed",
      "in_progress",
      "completed",
      "cancelled",
    ],
  }).notNull().default("inquiry"),
  totalPrice: integer("total_price"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("bookings_reference_code_idx").on(table.referenceCode),
  index("bookings_status_idx").on(table.status),
  index("bookings_email_idx").on(table.email),
  index("bookings_user_id_idx").on(table.userId),
  index("bookings_tour_id_idx").on(table.tourId),
]);

export const bookingStatusHistory = pgTable("booking_status_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
  status: text("status").notNull(),
  note: text("note"),
  changedBy: text("changed_by").references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("booking_status_history_booking_id_idx").on(table.bookingId),
]);

export const galleryImages = pgTable("gallery_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: text("url").notNull(),
  alt: text("alt"),
  category: text("category"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("gallery_images_category_idx").on(table.category),
]);

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  content: text("content"),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"),
  published: boolean("published").notNull().default(false),
  authorId: text("author_id").references(() => user.id, { onDelete: "set null" }),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  focusKeyword: text("focus_keyword"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("blog_posts_slug_idx").on(table.slug),
  index("blog_posts_published_idx").on(table.published),
]);

export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  guestName: text("guest_name").notNull(),
  country: text("country"),
  rating: integer("rating").notNull(),
  text: text("text").notNull(),
  tourId: uuid("tour_id").references(() => tours.id, { onDelete: "set null" }),
  approved: boolean("approved").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("testimonials_approved_idx").on(table.approved),
  index("testimonials_tour_id_idx").on(table.tourId),
]);

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id").references(() => bookings.id, { onDelete: "cascade" }),
  senderId: text("sender_id").references(() => user.id, { onDelete: "set null" }),
  senderRole: text("sender_role", { enum: ["admin", "user", "guest"] }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("messages_booking_id_idx").on(table.bookingId),
  index("messages_sender_id_idx").on(table.senderId),
]);

export const favorites = pgTable("favorites", {
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  tourId: uuid("tour_id").notNull().references(() => tours.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.tourId] }),
]);

export const contactSubmissions = pgTable("contact_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("contact_submissions_email_idx").on(table.email),
]);

/* ────────────────────────────────────────────────────
 * Relations
 * ──────────────────────────────────────────────────── */

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  bookings: many(bookings),
  blogPosts: many(blogPosts),
  messages: many(messages),
  favorites: many(favorites),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const toursRelations = relations(tours, ({ many }) => ({
  tourDestinations: many(tourDestinations),
  bookings: many(bookings),
  testimonials: many(testimonials),
  favorites: many(favorites),
}));

export const destinationsRelations = relations(destinations, ({ many }) => ({
  tourDestinations: many(tourDestinations),
}));

export const tourDestinationsRelations = relations(tourDestinations, ({ one }) => ({
  tour: one(tours, { fields: [tourDestinations.tourId], references: [tours.id] }),
  destination: one(destinations, { fields: [tourDestinations.destinationId], references: [destinations.id] }),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  tour: one(tours, { fields: [bookings.tourId], references: [tours.id] }),
  user: one(user, { fields: [bookings.userId], references: [user.id] }),
  statusHistory: many(bookingStatusHistory),
  messages: many(messages),
}));

export const bookingStatusHistoryRelations = relations(bookingStatusHistory, ({ one }) => ({
  booking: one(bookings, { fields: [bookingStatusHistory.bookingId], references: [bookings.id] }),
  changedByUser: one(user, { fields: [bookingStatusHistory.changedBy], references: [user.id] }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(user, { fields: [blogPosts.authorId], references: [user.id] }),
}));

export const testimonialsRelations = relations(testimonials, ({ one }) => ({
  tour: one(tours, { fields: [testimonials.tourId], references: [tours.id] }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  booking: one(bookings, { fields: [messages.bookingId], references: [bookings.id] }),
  sender: one(user, { fields: [messages.senderId], references: [user.id] }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(user, { fields: [favorites.userId], references: [user.id] }),
  tour: one(tours, { fields: [favorites.tourId], references: [tours.id] }),
}));

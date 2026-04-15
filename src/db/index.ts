/* ── Drizzle Database Client ── */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Singleton database connection.
 *
 * In development Next.js hot-reloads modules, which would otherwise
 * create a new connection pool on every reload. We store the client
 * on `globalThis` to guarantee a single pool per process.
 */

const globalForDb = globalThis as unknown as {
  pgClient: ReturnType<typeof postgres> | undefined;
};

function getConnectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
      "Please add it to your .env file."
    );
  }
  return url;
}

const client = globalForDb.pgClient ?? postgres(getConnectionString(), {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

if (process.env.NODE_ENV !== "production") {
  globalForDb.pgClient = client;
}

export const db = drizzle(client, { schema });

export { schema };

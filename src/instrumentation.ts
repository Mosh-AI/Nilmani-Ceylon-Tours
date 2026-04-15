export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      await import("../sentry.server.config");
    } catch {
      // @sentry/nextjs not installed yet — skip silently.
      // Sentry will activate once the package is added.
    }
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    try {
      await import("../sentry.edge.config");
    } catch {
      // @sentry/nextjs not installed yet — skip silently.
    }
  }
}

// onRequestError hook — extend this when Sentry DSN is configured.
// export async function onRequestError(...) { ... }

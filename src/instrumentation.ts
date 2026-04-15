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

export async function onRequestError(
  ...args: Parameters<NonNullable<typeof onRequestError>>
) {
  try {
    const Sentry = await import("@sentry/nextjs");
    if (typeof Sentry.captureRequestError === "function") {
      Sentry.captureRequestError(...args);
    }
  } catch {
    // @sentry/nextjs not installed — skip.
  }
}

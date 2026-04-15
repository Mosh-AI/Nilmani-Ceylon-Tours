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
  err: Error,
  request: { path: string; method: string },
  context: { routerKind: string; routePath: string; routeType: string }
) {
  try {
    const Sentry = await import("@sentry/nextjs");
    if (typeof Sentry.captureRequestError === "function") {
      Sentry.captureRequestError(err, request, context);
    }
  } catch {
    // @sentry/nextjs not installed — skip.
  }
}

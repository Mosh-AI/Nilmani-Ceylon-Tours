// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a user loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { sentryConfig, scrubPii } from "@/lib/sentry";

Sentry.init({
  ...sentryConfig,

  // Client-only: capture session replays on errors
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  beforeSend(event) {
    // Scrub PII from request data
    if (event.request?.data && typeof event.request.data === "object") {
      event.request.data = scrubPii(
        event.request.data as Record<string, unknown>,
      );
    }

    // Scrub PII from breadcrumb data
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
        if (breadcrumb.data && typeof breadcrumb.data === "object") {
          return {
            ...breadcrumb,
            data: scrubPii(breadcrumb.data as Record<string, unknown>),
          };
        }
        return breadcrumb;
      });
    }

    return event;
  },
});

// Set initial scope with page URL
Sentry.getCurrentScope().setTag("page_url", window.location.href);

// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { sentryConfig, scrubPii } from "@/lib/sentry";

Sentry.init({
  ...sentryConfig,

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

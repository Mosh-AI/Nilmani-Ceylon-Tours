// This file configures the initialization of Sentry for edge runtimes.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { sentryConfig } from "@/lib/sentry";

Sentry.init({
  dsn: sentryConfig.dsn,
  environment: sentryConfig.environment,
  tracesSampleRate: sentryConfig.tracesSampleRate,
});

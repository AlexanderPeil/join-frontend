import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import * as Sentry from "@sentry/angular-ivy";
import { enableProdMode } from "@angular/core";


Sentry.init({
  dsn: "https://c42bda94b931405f0f847c7b6fa844dc@o4506851606724608.ingest.us.sentry.io/4506851817095169",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});


enableProdMode();
platformBrowserDynamic()
.bootstrapModule(AppModule)
.then((success) => console.log('Bootstrap success'))
  .catch(err => console.error(err));

  
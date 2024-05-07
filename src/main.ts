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
  tracesSampleRate: 1.0,
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  replaysSessionSampleRate: 0.1, 
  replaysOnErrorSampleRate: 1.0, 
});

setTimeout(() => {
  try {
    // Fehler erzeugen
    throw new Error("Sentry test-error!");
  } catch (error) {
    // Fehler an Sentry senden
    Sentry.captureException(error);
  }
}, 5000);

enableProdMode();
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then((success) => console.log('Bootstrap success'))
  .catch(err => {
    Sentry.captureException(err);
});

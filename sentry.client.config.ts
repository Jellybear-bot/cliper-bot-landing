import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://f7feb134d544bb7d45e8c1b8fed6c85a@o4511360416546816.ingest.us.sentry.io/4511360447610880',
  tracesSampleRate: 0.2,
  enableLogs: true,
})

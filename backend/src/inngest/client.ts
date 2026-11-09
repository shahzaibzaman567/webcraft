import { Inngest } from 'inngest';
import { env } from '../config/env';

export const inngest = new Inngest({
  id: env.inngest.appId,
  eventKey: env.inngest.eventKey || undefined,
  baseUrl: env.inngest.baseUrl || undefined,
  isDev: env.inngest.isDev,
});

export function isInngestEnabled(): boolean {
  return Boolean(env.inngest.eventKey || env.inngest.isDev);
}

export function isInngestConfigured(): boolean {
  return Boolean(env.inngest.eventKey || env.inngest.signingKey || env.inngest.isDev);
}

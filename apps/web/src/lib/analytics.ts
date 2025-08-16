export type AnalyticsEvent = {
  name: string;
  ts?: number;
  props?: Record<string, any>;
};

const STORAGE_KEY = 'dn_analytics_events';

export function track(name: string, props?: Record<string, any>): void {
  const evt: AnalyticsEvent = { name, ts: Date.now(), props };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    arr.push(evt);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr).slice(-5000));
  } catch {}
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log('[analytics]', evt);
  }
  // fire-and-forget to backend
  try {
    fetch('/api/v1/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, props })
    });
  } catch {}
}

export function drain(): AnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
  } catch {
    return [];
  }
}



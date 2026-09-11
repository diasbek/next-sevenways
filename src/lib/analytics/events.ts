/** Lightweight client analytics hook (YM/GA via SiteAnalytics). */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    const w = window as Window & {
      ym?: (id: number, method: string, goal: string, params?: object) => void;
      gtag?: (...args: unknown[]) => void;
    };
    const ymId = process.env.NEXT_PUBLIC_YM_ID;
    if (ymId && typeof w.ym === "function") {
      w.ym(Number(ymId), "reachGoal", name, params);
    }
    if (typeof w.gtag === "function") {
      w.gtag("event", name, params);
    }
  } catch {
    // ignore
  }
}

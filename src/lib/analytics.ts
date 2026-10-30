/**
 * The only analytics calls the site may make. Events carry a name and nothing
 * else: never answers, never ticked boxes.
 *
 * With no provider configured (site.analytics.provider is '') this is a no-op.
 * Plausible exposes window.plausible when its script is loaded; Cloudflare Web
 * Analytics records page views only and ignores custom events.
 */
export type AnalyticsEvent = 'check_started' | 'check_result_fit' | 'check_result_not_fit' | 'cta_book' | 'cta_call';

declare global {
  interface Window {
    plausible?: (event: string) => void;
  }
}

export function track(event: AnalyticsEvent): void {
  try {
    if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
      window.plausible(event);
    }
  } catch {
    // Analytics must never break the page.
  }
}

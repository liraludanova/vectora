// src/lib/analytics.ts

export type AnalyticsEvent =
    | "page_view"
    | "contact_submit"
    | "contact_error"
    | "audit_run"
    | "cta_click"
    | "demo_interaction";

export type AnalyticsParams = Record<string, unknown>;

/**
 * Extend global Window with optional gtag
 */

function isBrowser(): boolean {
    return typeof window !== "undefined";
}

function hasGtag(): boolean {
    return Boolean(isBrowser() && typeof window.gtag === "function");
}

/**
 * Track GA4 event via gtag.
 * Safe: does nothing if gtag not loaded.
 */
export function trackEvent(event: AnalyticsEvent, params?: AnalyticsParams) {
    if (!hasGtag()) return;

    window.gtag?.("event", event, params || {});
}

/**
 * Track GA4 page view for SPA navigation (App Router).
 * GA4 config can also send_page_view automatically,
 * but explicit page_view on route change is more reliable.
 */
export function trackPageView(url: string, locale?: string) {
    if (!hasGtag()) return;

    window.gtag?.("event", "page_view", {
        page_location: url,
        page_path: safePathname(url),
        ...(locale ? { locale } : {}),
    });
}

function safePathname(url: string) {
    try {
        const u = new URL(url);
        return u.pathname + u.search;
    } catch {
        return url;
    }
}

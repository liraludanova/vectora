// src/app/api/audit/route.ts
import { NextResponse } from "next/server";

type Strategy = "mobile" | "desktop";

type AuditInput = {
    url: string;
    includeDesktop?: boolean;
};

type LighthouseAudit = {
    id?: string;
    title?: string;
    description?: string;
    score?: number | null;
    numericValue?: number;
    displayValue?: string;
};

type LighthouseCategory = { score?: number };

type LighthouseResult = {
    finalUrl?: string;
    categories?: Record<string, LighthouseCategory>;
    audits?: Record<string, LighthouseAudit>;
};

type LoadingExperience = {
    overall_category?: string;
    metrics?: Record<
        string,
        {
            percentile?: number;
            distributions?: Array<{
                min?: number;
                max?: number;
                proportion?: number;
            }>;
            category?: string;
        }
    >;
};

type PSIResponse = {
    lighthouseResult?: LighthouseResult;
    loadingExperience?: LoadingExperience;
    originLoadingExperience?: LoadingExperience;
};

type HtmlBasics = {
    status: number;
    finalUrl: string;
    isHtml: boolean;
    title: string | null;
    description: string | null;
    canonical: string | null;
    robots: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
};

type CachedItem<T> = { value: T; expiresAt: number };
const PSI_TTL_MS = 24 * 60 * 60 * 1000; // 24h

// In-memory cache (ok for demo/dev; in prod лучше Redis/Upstash)
const psiCache = new Map<string, CachedItem<PSIResponse>>();

function cacheKey(strategy: Strategy, url: string) {
    return `${strategy}:${url}`;
}

function getCached(strategy: Strategy, url: string): PSIResponse | null {
    const key = cacheKey(strategy, url);
    const item = psiCache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
        psiCache.delete(key);
        return null;
    }
    return item.value;
}

function setCached(strategy: Strategy, url: string, value: PSIResponse) {
    const key = cacheKey(strategy, url);
    psiCache.set(key, { value, expiresAt: Date.now() + PSI_TTL_MS });
}

function isHttpUrl(raw: string): boolean {
    try {
        const u = new URL(raw);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
}

function normalizeUrl(raw: string): string {
    const trimmed = raw.trim();
    const withProtocol = /^https?:\/\//i.test(trimmed)
        ? trimmed
        : `https://${trimmed}`;
    const u = new URL(withProtocol);
    u.hash = "";
    return u.toString();
}

function envPSIKey(): string | null {
    const k =
        process.env.PAGESPEED_API_KEY ||
        process.env.NEXT_PUBLIC_PAGESPEED_API_KEY ||
        null;
    return k && k.trim().length > 0 ? k.trim() : null;
}

async function fetchPSI(url: string, strategy: Strategy): Promise<PSIResponse> {
    const cached = getCached(strategy, url);
    if (cached) return cached;

    const key = envPSIKey();
    const endpoint = new URL(
        "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
    );

    endpoint.searchParams.set("url", url);
    endpoint.searchParams.set("strategy", strategy);

    endpoint.searchParams.set("category", "performance");
    endpoint.searchParams.append("category", "seo");
    endpoint.searchParams.append("category", "best-practices");
    endpoint.searchParams.append("category", "accessibility");

    if (key) endpoint.searchParams.set("key", key);

    const res = await fetch(endpoint.toString(), {
        method: "GET",
        headers: { Accept: "application/json" },
        // дополнительный кэш Next (поверх нашего) — помогает в проде
        next: { revalidate: 3600 }, // 1 час
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        const err = new Error(
            `PSI ${strategy} failed: ${res.status} ${res.statusText} ${text}`.slice(
                0,
                600,
            ),
        );
        // @ts-expect-error attach status
        err.status = res.status;
        throw err;
    }

    const json = (await res.json()) as PSIResponse;
    setCached(strategy, url, json);
    return json;
}

function roundScore(score: unknown): number | null {
    if (typeof score !== "number") return null;
    return Math.round(score * 100);
}

function pickAudit(
    audits: Record<string, LighthouseAudit> | undefined,
    id: string,
) {
    const x = audits?.[id];
    return {
        score: typeof x?.score === "number" ? x.score : null,
        numericValue:
            typeof x?.numericValue === "number" ? x.numericValue : null,
        displayValue: x?.displayValue ?? null,
        title: x?.title ?? null,
        description: x?.description ?? null,
    };
}

async function fetchHtmlBasics(url: string): Promise<HtmlBasics> {
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "User-Agent":
                "Mozilla/5.0 (compatible; VectoraAuditBot/1.0; +https://example.com)",
            Accept: "text/html,application/xhtml+xml",
        },
        redirect: "follow",
        next: { revalidate: 3600 },
    });

    const status = res.status;
    const finalUrl = res.url;
    const contentType = res.headers.get("content-type") || "";

    if (!contentType.includes("text/html")) {
        return {
            status,
            finalUrl,
            isHtml: false,
            title: null,
            description: null,
            canonical: null,
            robots: null,
            ogTitle: null,
            ogDescription: null,
            ogImage: null,
        };
    }

    const html = await res.text();

    const title =
        /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1]?.trim() ?? null;

    const description =
        /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i
            .exec(html)?.[1]
            ?.trim() ??
        /<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i
            .exec(html)?.[1]
            ?.trim() ??
        null;

    const canonical =
        /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i
            .exec(html)?.[1]
            ?.trim() ??
        /<link[^>]+href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i
            .exec(html)?.[1]
            ?.trim() ??
        null;

    const robots =
        /<meta[^>]+name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i
            .exec(html)?.[1]
            ?.trim() ??
        /<meta[^>]+content=["']([^"']*)["'][^>]*name=["']robots["'][^>]*>/i
            .exec(html)?.[1]
            ?.trim() ??
        null;

    const ogTitle =
        /<meta[^>]+property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i
            .exec(html)?.[1]
            ?.trim() ?? null;

    const ogDescription =
        /<meta[^>]+property=["']og:description["'][^>]*content=["']([^"']*)["'][^>]*>/i
            .exec(html)?.[1]
            ?.trim() ?? null;

    const ogImage =
        /<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']*)["'][^>]*>/i
            .exec(html)?.[1]
            ?.trim() ?? null;

    return {
        status,
        finalUrl,
        isHtml: true,
        title,
        description,
        canonical,
        robots,
        ogTitle,
        ogDescription,
        ogImage,
    };
}

function publicWarn(locale: "ua" | "en", strategy: Strategy, e: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const status = (e as any)?.status;
    if (status === 429) {
        return locale === "ua"
            ? `Квота PageSpeed Insights перевищена для ${strategy}. Спробуйте пізніше або використайте власний API key.`
            : `PageSpeed Insights quota exceeded for ${strategy}. Try later or use your own API key.`;
    }
    const msg = e instanceof Error ? e.message : "Unknown error";
    return locale === "ua"
        ? `Помилка PSI (${strategy}): ${msg}`
        : `PSI error (${strategy}): ${msg}`;
}

export async function POST(req: Request) {
    let body: AuditInput | null = null;

    try {
        body = (await req.json()) as AuditInput;
    } catch {
        return NextResponse.json(
            { ok: false, error: "Invalid JSON body" },
            { status: 400 },
        );
    }

    const rawUrl = body?.url ?? "";
    const includeDesktop = Boolean(body?.includeDesktop);

    if (typeof rawUrl !== "string" || rawUrl.trim().length === 0) {
        return NextResponse.json(
            { ok: false, error: "Missing url" },
            { status: 400 },
        );
    }

    const normalized = normalizeUrl(rawUrl);
    if (!isHttpUrl(normalized)) {
        return NextResponse.json(
            { ok: false, error: "URL must be http/https" },
            { status: 400 },
        );
    }

    const acceptLang = (req.headers.get("accept-language") || "").toLowerCase();
    const localeHint: "ua" | "en" = acceptLang.includes("uk") ? "ua" : "en";

    const warnings: string[] = [];

    const htmlPromise = fetchHtmlBasics(normalized);
    const mobilePromise = fetchPSI(normalized, "mobile");
    const desktopPromise = includeDesktop
        ? fetchPSI(normalized, "desktop")
        : null;

    const [htmlRes, mobileRes, desktopRes] = await Promise.allSettled([
        htmlPromise,
        mobilePromise,
        desktopPromise ?? Promise.resolve(null),
    ]);

    const html: HtmlBasics =
        htmlRes.status === "fulfilled"
            ? htmlRes.value
            : {
                  status: 0,
                  finalUrl: normalized,
                  isHtml: false,
                  title: null,
                  description: null,
                  canonical: null,
                  robots: null,
                  ogTitle: null,
                  ogDescription: null,
                  ogImage: null,
              };

    const mobile: PSIResponse | null =
        mobileRes.status === "fulfilled" ? mobileRes.value : null;
    if (mobileRes.status === "rejected") {
        warnings.push(publicWarn(localeHint, "mobile", mobileRes.reason));
    }

    const desktop: PSIResponse | null =
        desktopRes.status === "fulfilled"
            ? (desktopRes.value as PSIResponse | null)
            : null;
    if (includeDesktop && desktopRes.status === "rejected") {
        warnings.push(publicWarn(localeHint, "desktop", desktopRes.reason));
    }

    if (!mobile && !desktop) {
        return NextResponse.json(
            {
                ok: false,
                error:
                    localeHint === "ua"
                        ? "Не вдалося отримати дані PSI (mobile/desktop). Спробуйте пізніше або підключіть API key."
                        : "Failed to fetch PSI data (mobile/desktop). Try later or set an API key.",
                warnings,
            },
            { status: 502 },
        );
    }

    const mLR = mobile?.lighthouseResult;
    const dLR = desktop?.lighthouseResult;

    const mCats = mLR?.categories ?? {};
    const dCats = dLR?.categories ?? {};

    const mAudits = mLR?.audits;
    const dAudits = dLR?.audits;

    const resolvedUrl =
        mLR?.finalUrl ?? dLR?.finalUrl ?? html.finalUrl ?? normalized;

    return NextResponse.json(
        {
            ok: true,
            inputUrl: normalized,
            resolvedUrl,

            html,

            lighthouse: {
                mobile: mobile
                    ? {
                          scores: {
                              performance: roundScore(
                                  mCats["performance"]?.score,
                              ),
                              seo: roundScore(mCats["seo"]?.score),
                              bestPractices: roundScore(
                                  mCats["best-practices"]?.score,
                              ),
                              accessibility: roundScore(
                                  mCats["accessibility"]?.score,
                              ),
                          },
                          coreWebVitals: {
                              lcp: pickAudit(
                                  mAudits,
                                  "largest-contentful-paint",
                              ),
                              cls: pickAudit(
                                  mAudits,
                                  "cumulative-layout-shift",
                              ),
                              inp: pickAudit(
                                  mAudits,
                                  "interactive-to-next-paint",
                              ),
                          },
                      }
                    : null,

                desktop: desktop
                    ? {
                          scores: {
                              performance: roundScore(
                                  dCats["performance"]?.score,
                              ),
                              seo: roundScore(dCats["seo"]?.score),
                              bestPractices: roundScore(
                                  dCats["best-practices"]?.score,
                              ),
                              accessibility: roundScore(
                                  dCats["accessibility"]?.score,
                              ),
                          },
                          coreWebVitals: {
                              lcp: pickAudit(
                                  dAudits,
                                  "largest-contentful-paint",
                              ),
                              cls: pickAudit(
                                  dAudits,
                                  "cumulative-layout-shift",
                              ),
                              inp: pickAudit(
                                  dAudits,
                                  "interactive-to-next-paint",
                              ),
                          },
                      }
                    : null,
            },

            fieldData: {
                url:
                    mobile?.loadingExperience ??
                    desktop?.loadingExperience ??
                    null,
                origin:
                    mobile?.originLoadingExperience ??
                    desktop?.originLoadingExperience ??
                    null,
            },

            source: {
                pageSpeedInsights: true,
                fetchedAt: new Date().toISOString(),
                note: "Metrics come from Google PageSpeed Insights (Lighthouse). Field data may be missing for low-traffic sites.",
            },

            warnings,
            meta: {
                includeDesktop,
                cacheTtlHours: 24,
            },
        },
        { status: 200 },
    );
}

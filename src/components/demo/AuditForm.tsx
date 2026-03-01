"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { Card } from "@/components/ui/Card";
import { cx, withLocale } from "@/lib/utils";
import Link from "next/link";
import AuditResult from "./AuditResult";
import { trackEvent } from "@/lib/analytics";

type Props = { locale: Locale };

type LighthouseAudit = {
    score: number | null;
    numericValue: number | null;
    displayValue: string | null;
    title: string | null;
    description: string | null;
};

type AuditBlock = {
    scores: {
        performance: number | null;
        seo: number | null;
        bestPractices: number | null;
        accessibility: number | null;
    };
    coreWebVitals: {
        lcp: LighthouseAudit;
        cls: LighthouseAudit;
        inp: LighthouseAudit;
    };
};

type AuditApiOk = {
    ok: true;
    inputUrl: string;
    resolvedUrl: string;
    html: {
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
    lighthouse: {
        mobile: AuditBlock | null;
        desktop: AuditBlock | null;
    };
    fieldData: {
        url: unknown | null;
        origin: unknown | null;
    };
    source: {
        pageSpeedInsights: boolean;
        fetchedAt: string;
        note: string;
    };
    warnings: string[];
    meta: {
        includeDesktop: boolean;
        cacheTtlHours: number;
    };
};

type AuditApiError = { ok: false; error: string; warnings?: string[] };
type AuditApiResponse = AuditApiOk | AuditApiError;

function normalizeUrl(raw: string) {
    const v = raw.trim();
    if (!v) return "";
    if (/^https?:\/\//i.test(v)) return v;
    return `https://${v}`;
}

function isLikelyUrl(value: string) {
    const v = value.trim();
    if (!v) return false;
    const candidate = normalizeUrl(v);
    try {
        const u = new URL(candidate);
        return Boolean(u.hostname && u.hostname.includes("."));
    } catch {
        return false;
    }
}

async function postAudit(url: string, includeDesktop: boolean) {
    const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, includeDesktop }),
    });

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
        const text = await res.text().catch(() => "");
        throw new Error(
            `Expected JSON, got ${res.status}. Body starts with: ${text
                .slice(0, 120)
                .replace(/\s+/g, " ")}`,
        );
    }

    const json = (await res.json()) as AuditApiResponse;

    if (!res.ok || !json || (json as AuditApiError).ok === false) {
        const msg =
            (json as AuditApiError)?.error ||
            `Audit failed with status ${res.status}`;
        const warnings = (json as AuditApiError)?.warnings ?? [];
        const err = new Error(msg);
        // @ts-expect-error attach warnings
        err.warnings = warnings;
        throw err;
    }

    return json as AuditApiOk;
}

export default function AuditForm({ locale }: Props) {
    const [urlRaw, setUrlRaw] = useState("");
    const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);

    const [status, setStatus] = useState<"idle" | "running" | "done" | "error">(
        "idle",
    );
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [data, setData] = useState<AuditApiOk | null>(null);

    const urlValid = useMemo(() => isLikelyUrl(urlRaw), [urlRaw]);
    const urlNormalized = useMemo(() => normalizeUrl(urlRaw), [urlRaw]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!urlValid) return;

        trackEvent("audit_run", {
            locale,
            phase: "start",
            device: "mobile",
            input: urlNormalized,
        });

        setStatus("running");
        setErrorMsg(null);
        setSubmittedUrl(null);
        setData(null);

        try {
            const json = await postAudit(urlNormalized, false); // MOBILE ONLY
            setSubmittedUrl(urlNormalized);
            setData(json);
            setStatus("done");

            const perf = json.lighthouse.mobile?.scores.performance ?? null;
            const seo = json.lighthouse.mobile?.scores.seo ?? null;

            trackEvent("audit_run", {
                locale,
                phase: "success",
                device: "mobile",
                input: json.inputUrl,
                resolved: json.resolvedUrl,
                html_status: json.html.status,
                perf,
                seo,
                warnings_count: json.warnings?.length ?? 0,
            });
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error";
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const warnings = (err as any)?.warnings as string[] | undefined;

            const base =
                locale === "ua"
                    ? `Помилка мережі/сервера: ${msg}`
                    : `Network/server error: ${msg}`;

            const extra =
                warnings && warnings.length ? `\n${warnings.join("\n")}` : "";

            setErrorMsg(base + extra);
            setStatus("error");

            trackEvent("audit_run", {
                locale,
                phase: "error",
                device: "mobile",
                input: urlNormalized,
                message: msg,
                warnings_count: warnings?.length ?? 0,
            });
        }
    }

    async function fetchDesktop() {
        if (!submittedUrl || !data) return;

        if (data.lighthouse.desktop) return;

        trackEvent("audit_run", {
            locale,
            phase: "start",
            device: "desktop",
            input: submittedUrl,
        });

        setErrorMsg(null);
        setStatus("running");

        try {
            const json = await postAudit(submittedUrl, true);
            setData((prev) => {
                if (!prev) return json;
                return {
                    ...prev,
                    lighthouse: {
                        mobile:
                            prev.lighthouse.mobile ?? json.lighthouse.mobile,
                        desktop:
                            json.lighthouse.desktop ?? prev.lighthouse.desktop,
                    },
                    warnings: Array.from(
                        new Set([
                            ...(prev.warnings ?? []),
                            ...(json.warnings ?? []),
                        ]),
                    ),
                    source: json.source ?? prev.source,
                };
            });
            setStatus("done");

            const deskPerf =
                json.lighthouse.desktop?.scores.performance ?? null;
            const deskSeo = json.lighthouse.desktop?.scores.seo ?? null;

            trackEvent("audit_run", {
                locale,
                phase: "success",
                device: "desktop",
                input: json.inputUrl,
                resolved: json.resolvedUrl,
                html_status: json.html.status,
                perf: deskPerf,
                seo: deskSeo,
                warnings_count: json.warnings?.length ?? 0,
            });
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error";
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const warnings = (err as any)?.warnings as string[] | undefined;

            const base =
                locale === "ua"
                    ? `Desktop недоступний: ${msg}`
                    : `Desktop unavailable: ${msg}`;

            const extra =
                warnings && warnings.length ? `\n${warnings.join("\n")}` : "";

            setErrorMsg(base + extra);
            setStatus("done");

            trackEvent("audit_run", {
                locale,
                phase: "error",
                device: "desktop",
                input: submittedUrl,
                message: msg,
                warnings_count: warnings?.length ?? 0,
            });
        }
    }

    function reset() {
        setSubmittedUrl(null);
        setData(null);
        setErrorMsg(null);
        setStatus("idle");
    }

    return (
        <div className="space-y-4">
            <Card className="p-6">
                <form className="space-y-4" onSubmit={onSubmit} noValidate>
                    <div>
                        <label className="block">
                            <span className="text-xs font-semibold uppercase tracking-wide text-white/60">
                                {locale === "ua"
                                    ? "Адреса сайту"
                                    : "Website URL"}
                            </span>

                            <input
                                type="url"
                                inputMode="url"
                                autoComplete="url"
                                placeholder={
                                    locale === "ua"
                                        ? "Напр., https://example.com"
                                        : "e.g., https://example.com"
                                }
                                value={urlRaw}
                                onChange={(e) => setUrlRaw(e.target.value)}
                                className={cx(
                                    "mt-2 w-full rounded-xl border bg-black/30 px-4 py-3 text-sm text-white outline-none",
                                    "border-white/10 focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/20",
                                )}
                            />
                        </label>

                        {!urlValid && urlRaw.trim().length > 0 ? (
                            <p className="mt-2 text-xs text-red-300/90">
                                {locale === "ua"
                                    ? "Схоже, адреса некоректна. Спробуйте домен або повний URL (краще з https://)."
                                    : "This doesn’t look like a valid URL. Try a domain or a full URL (prefer https://)."}
                            </p>
                        ) : null}

                        {errorMsg ? (
                            <p className="mt-2 whitespace-pre-line text-xs text-red-300/90">
                                {errorMsg}
                            </p>
                        ) : null}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <button
                            type="submit"
                            disabled={!urlValid || status === "running"}
                            className={cx(
                                "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold",
                                urlValid && status !== "running"
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"
                                    : "cursor-not-allowed bg-white/10 text-white/40",
                                "transition focus:outline-none focus:ring-2 focus:ring-blue-400/60",
                            )}
                        >
                            {status === "running"
                                ? locale === "ua"
                                    ? "Перевіряємо…"
                                    : "Running…"
                                : locale === "ua"
                                  ? "Запустити міні-аудит (Mobile)"
                                  : "Run mini audit (Mobile)"}
                        </button>

                        <Link
                            href={withLocale(locale, "/demo")}
                            onClick={() =>
                                trackEvent("cta_click", {
                                    locale,
                                    location: "audit_form",
                                    cta: "all_demos",
                                    to: `/${locale}/demo`,
                                })
                            }
                            className="text-sm text-white/70 hover:text-white"
                        >
                            {locale === "ua" ? "← Усі демо" : "← All demos"}
                        </Link>

                        <button
                            type="button"
                            onClick={reset}
                            className="text-sm text-white/70 hover:text-white"
                        >
                            {locale === "ua" ? "Скинути" : "Reset"}
                        </button>
                    </div>

                    <p className="text-xs text-white/50">
                        {locale === "ua"
                            ? "За замовчуванням міряємо Mobile (економимо квоту). Desktop можна запитати окремо після результату."
                            : "By default we measure Mobile (saves quota). Desktop can be requested separately after results."}
                    </p>
                </form>
            </Card>

            {submittedUrl && data ? (
                <AuditResult
                    locale={locale}
                    url={submittedUrl}
                    data={data}
                    onReset={reset}
                    onFetchDesktop={fetchDesktop}
                    busy={status === "running"}
                />
            ) : null}
        </div>
    );
}

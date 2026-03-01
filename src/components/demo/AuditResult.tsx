"use client";

import type { Locale } from "@/lib/i18n";
import { Card } from "@/components/ui/Card";
import { cx, withLocale } from "@/lib/utils";
import Link from "next/link";
import { useMemo, useState } from "react";

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

type Props = {
    locale: Locale;
    url: string;
    data: AuditApiOk;
    onReset: () => void;
    onFetchDesktop: () => Promise<void>;
    busy: boolean;
};

function scoreBadge(value: number | null) {
    if (value === null) return "bg-white/5 text-white/75 ring-1 ring-white/15";
    if (value >= 90)
        return "bg-green-500/15 text-green-200 ring-1 ring-green-500/25";
    if (value >= 75)
        return "bg-green-500/10 text-green-200/90 ring-1 ring-green-500/20";
    if (value >= 55)
        return "bg-yellow-500/15 text-yellow-200 ring-1 ring-yellow-500/25";
    return "bg-white/5 text-white/75 ring-1 ring-white/15";
}

function fmtScore(value: number | null) {
    return value === null ? "—" : `${value}/100`;
}

function fmtDate(iso: string, locale: Locale) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString(locale === "ua" ? "uk-UA" : "en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function toSecondsFromMs(ms: number | null) {
    if (ms === null) return null;
    return ms / 1000;
}

function fmtSecondsFromMs(ms: number | null) {
    const s = toSecondsFromMs(ms);
    if (s === null) return "—";
    return `${s.toFixed(2)}s`;
}

function fmtCLS(n: number | null) {
    if (n === null) return "—";
    return n.toFixed(3);
}

function metricHint(locale: Locale, key: "lcp" | "inp" | "cls") {
    const ua = {
        lcp: "LCP: швидкість завантаження найбільшого елемента (краще нижче).",
        inp: "INP: затримка реакції на взаємодію (краще нижче).",
        cls: "CLS: стабільність верстки (краще нижче).",
    };
    const en = {
        lcp: "LCP: time to render the largest element (lower is better).",
        inp: "INP: interaction latency (lower is better).",
        cls: "CLS: layout stability (lower is better).",
    };
    return locale === "ua" ? ua[key] : en[key];
}

export default function AuditResult({
    locale,
    url,
    data,
    onReset,
    onFetchDesktop,
    busy,
}: Props) {
    const [tab, setTab] = useState<"mobile" | "desktop">("mobile");

    const hasMobile = Boolean(data.lighthouse.mobile);
    const hasDesktop = Boolean(data.lighthouse.desktop);

    const resolved = data.resolvedUrl || data.html.finalUrl || url;

    const current =
        tab === "mobile" ? data.lighthouse.mobile : data.lighthouse.desktop;

    // если пользователь выбрал desktop, но его нет — удерживаемся на mobile
    if (tab === "desktop" && !hasDesktop && hasMobile) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        setTimeout(() => setTab("mobile"), 0);
    }

    const seoChecks = useMemo(() => {
        const h = data.html;
        const hasTitle = Boolean(h.title && h.title.trim().length > 0);
        const hasDesc = Boolean(
            h.description && h.description.trim().length > 0,
        );
        const hasCanonical = Boolean(
            h.canonical && h.canonical.trim().length > 0,
        );
        const robotsNoindex = Boolean(
            h.robots && h.robots.toLowerCase().includes("noindex"),
        );
        const hasOG = Boolean(h.ogTitle || h.ogDescription || h.ogImage);
        return { hasTitle, hasDesc, hasCanonical, robotsNoindex, hasOG };
    }, [data.html]);

    const warningsText = (data.warnings || []).join("\n");

    return (
        <Card className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-white/90">
                        {locale === "ua"
                            ? "Результат (реальні дані)"
                            : "Result (real data)"}
                    </p>
                    <p className="mt-1 text-sm text-white/60 break-all">
                        {resolved}
                    </p>
                    <p className="mt-2 text-xs text-white/45">
                        {locale === "ua" ? "Джерело:" : "Source:"} Google
                        PageSpeed Insights (Lighthouse)
                        {" · "}
                        {locale === "ua" ? "Виміряно:" : "Measured:"}{" "}
                        {fmtDate(data.source.fetchedAt, locale)}
                        {" · "}
                        {locale === "ua" ? "Кеш:" : "Cache:"}{" "}
                        {data.meta.cacheTtlHours}h
                    </p>

                    {warningsText ? (
                        <p className="mt-3 whitespace-pre-line text-xs text-yellow-200/80">
                            {warningsText}
                        </p>
                    ) : null}
                </div>

                <div className="flex flex-col items-start gap-2 sm:items-end">
                    <div className="inline-flex rounded-2xl border border-white/10 bg-black/30 p-1">
                        <button
                            type="button"
                            onClick={() => setTab("mobile")}
                            disabled={!hasMobile}
                            className={cx(
                                "rounded-xl px-3 py-2 text-xs font-semibold transition",
                                tab === "mobile"
                                    ? "bg-white/10 text-white"
                                    : "text-white/70 hover:text-white",
                                !hasMobile
                                    ? "opacity-40 cursor-not-allowed"
                                    : "",
                            )}
                        >
                            {locale === "ua" ? "Мобільний" : "Mobile"}
                        </button>

                        <button
                            type="button"
                            onClick={() => hasDesktop && setTab("desktop")}
                            disabled={!hasDesktop}
                            className={cx(
                                "rounded-xl px-3 py-2 text-xs font-semibold transition",
                                tab === "desktop"
                                    ? "bg-white/10 text-white"
                                    : "text-white/70 hover:text-white",
                                !hasDesktop
                                    ? "opacity-40 cursor-not-allowed"
                                    : "",
                            )}
                            title={
                                !hasDesktop
                                    ? locale === "ua"
                                        ? "Desktop ще не запитували або недоступний"
                                        : "Desktop not requested or unavailable"
                                    : undefined
                            }
                        >
                            {locale === "ua" ? "Десктоп" : "Desktop"}
                        </button>
                    </div>

                    {!hasDesktop ? (
                        <button
                            type="button"
                            onClick={onFetchDesktop}
                            disabled={busy || !hasMobile}
                            className={cx(
                                "inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold",
                                "border border-white/15 bg-white/5 text-white/90 backdrop-blur",
                                busy
                                    ? "opacity-60 cursor-not-allowed"
                                    : "hover:bg-white/10",
                                "transition focus:outline-none focus:ring-2 focus:ring-white/30",
                            )}
                        >
                            {busy
                                ? locale === "ua"
                                    ? "Запитуємо Desktop…"
                                    : "Fetching Desktop…"
                                : locale === "ua"
                                  ? "Запросити Desktop (додатково)"
                                  : "Fetch Desktop (extra)"}
                        </button>
                    ) : null}
                </div>
            </div>

            {current ? (
                <div className="mt-5 grid gap-4 lg:grid-cols-12">
                    <div className="lg:col-span-6">
                        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                                {locale === "ua"
                                    ? "Оцінки Lighthouse"
                                    : "Lighthouse scores"}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                                <span
                                    className={cx(
                                        "rounded-full px-3 py-1 text-xs font-semibold",
                                        scoreBadge(current.scores.performance),
                                    )}
                                >
                                    {locale === "ua"
                                        ? "Швидкість"
                                        : "Performance"}
                                    : {fmtScore(current.scores.performance)}
                                </span>
                                <span
                                    className={cx(
                                        "rounded-full px-3 py-1 text-xs font-semibold",
                                        scoreBadge(current.scores.seo),
                                    )}
                                >
                                    SEO: {fmtScore(current.scores.seo)}
                                </span>
                                <span
                                    className={cx(
                                        "rounded-full px-3 py-1 text-xs font-semibold",
                                        scoreBadge(
                                            current.scores.bestPractices,
                                        ),
                                    )}
                                >
                                    {locale === "ua" ? "Практики" : "Best"}:{" "}
                                    {fmtScore(current.scores.bestPractices)}
                                </span>
                                <span
                                    className={cx(
                                        "rounded-full px-3 py-1 text-xs font-semibold",
                                        scoreBadge(
                                            current.scores.accessibility,
                                        ),
                                    )}
                                >
                                    {locale === "ua" ? "Доступність" : "A11y"}:{" "}
                                    {fmtScore(current.scores.accessibility)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                                Core Web Vitals
                            </p>

                            <div className="mt-3 space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-white/85">
                                            LCP
                                        </p>
                                        <p className="text-xs text-white/50">
                                            {metricHint(locale, "lcp")}
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold text-white/85">
                                        {current.coreWebVitals.lcp
                                            .displayValue ??
                                            fmtSecondsFromMs(
                                                current.coreWebVitals.lcp
                                                    .numericValue,
                                            )}
                                    </p>
                                </div>

                                <div className="h-px bg-white/10" />

                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-white/85">
                                            INP
                                        </p>
                                        <p className="text-xs text-white/50">
                                            {metricHint(locale, "inp")}
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold text-white/85">
                                        {current.coreWebVitals.inp
                                            .displayValue ??
                                            fmtSecondsFromMs(
                                                current.coreWebVitals.inp
                                                    .numericValue,
                                            )}
                                    </p>
                                </div>

                                <div className="h-px bg-white/10" />

                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-white/85">
                                            CLS
                                        </p>
                                        <p className="text-xs text-white/50">
                                            {metricHint(locale, "cls")}
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold text-white/85">
                                        {current.coreWebVitals.cls
                                            .displayValue ??
                                            fmtCLS(
                                                current.coreWebVitals.cls
                                                    .numericValue,
                                            )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-6">
                        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                                {locale === "ua"
                                    ? "SEO перевірки (HTML)"
                                    : "SEO checks (HTML)"}
                            </p>

                            <ul className="mt-3 space-y-2 text-sm text-white/75">
                                <li className="flex items-center justify-between gap-3">
                                    <span className="text-white/70">
                                        &lt;title&gt;
                                    </span>
                                    <span
                                        className={cx(
                                            "rounded-full px-3 py-1 text-xs font-semibold",
                                            seoChecks.hasTitle
                                                ? "bg-green-500/15 text-green-200 ring-1 ring-green-500/25"
                                                : "bg-white/5 text-white/70 ring-1 ring-white/15",
                                        )}
                                    >
                                        {seoChecks.hasTitle
                                            ? "OK"
                                            : locale === "ua"
                                              ? "Немає"
                                              : "Missing"}
                                    </span>
                                </li>

                                <li className="flex items-center justify-between gap-3">
                                    <span className="text-white/70">
                                        meta description
                                    </span>
                                    <span
                                        className={cx(
                                            "rounded-full px-3 py-1 text-xs font-semibold",
                                            seoChecks.hasDesc
                                                ? "bg-green-500/15 text-green-200 ring-1 ring-green-500/25"
                                                : "bg-white/5 text-white/70 ring-1 ring-white/15",
                                        )}
                                    >
                                        {seoChecks.hasDesc
                                            ? "OK"
                                            : locale === "ua"
                                              ? "Немає"
                                              : "Missing"}
                                    </span>
                                </li>

                                <li className="flex items-center justify-between gap-3">
                                    <span className="text-white/70">
                                        canonical
                                    </span>
                                    <span
                                        className={cx(
                                            "rounded-full px-3 py-1 text-xs font-semibold",
                                            seoChecks.hasCanonical
                                                ? "bg-green-500/15 text-green-200 ring-1 ring-green-500/25"
                                                : "bg-white/5 text-white/70 ring-1 ring-white/15",
                                        )}
                                    >
                                        {seoChecks.hasCanonical
                                            ? "OK"
                                            : locale === "ua"
                                              ? "Немає"
                                              : "Missing"}
                                    </span>
                                </li>

                                <li className="flex items-center justify-between gap-3">
                                    <span className="text-white/70">
                                        robots meta
                                    </span>
                                    <span
                                        className={cx(
                                            "rounded-full px-3 py-1 text-xs font-semibold",
                                            seoChecks.robotsNoindex
                                                ? "bg-yellow-500/15 text-yellow-200 ring-1 ring-yellow-500/25"
                                                : "bg-green-500/15 text-green-200 ring-1 ring-green-500/25",
                                        )}
                                    >
                                        {seoChecks.robotsNoindex
                                            ? locale === "ua"
                                                ? "noindex?"
                                                : "noindex?"
                                            : "OK"}
                                    </span>
                                </li>

                                <li className="flex items-center justify-between gap-3">
                                    <span className="text-white/70">
                                        Open Graph
                                    </span>
                                    <span
                                        className={cx(
                                            "rounded-full px-3 py-1 text-xs font-semibold",
                                            seoChecks.hasOG
                                                ? "bg-green-500/15 text-green-200 ring-1 ring-green-500/25"
                                                : "bg-white/5 text-white/70 ring-1 ring-white/15",
                                        )}
                                    >
                                        {seoChecks.hasOG
                                            ? "OK"
                                            : locale === "ua"
                                              ? "Немає"
                                              : "Missing"}
                                    </span>
                                </li>
                            </ul>

                            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
                                <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                                    {locale === "ua" ? "Знайдено" : "Detected"}
                                </p>
                                <div className="mt-2 space-y-2 text-xs text-white/70">
                                    <div className="break-words">
                                        <span className="text-white/50">
                                            Title:
                                        </span>{" "}
                                        {data.html.title ?? "—"}
                                    </div>
                                    <div className="break-words">
                                        <span className="text-white/50">
                                            Description:
                                        </span>{" "}
                                        {data.html.description ?? "—"}
                                    </div>
                                    <div className="break-words">
                                        <span className="text-white/50">
                                            Canonical:
                                        </span>{" "}
                                        {data.html.canonical ?? "—"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                                {locale === "ua"
                                    ? "Наступні кроки"
                                    : "Next steps"}
                            </p>
                            <ul className="mt-3 space-y-2 text-sm text-white/75">
                                <li className="flex items-start gap-2">
                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-300/80" />
                                    <span>
                                        {locale === "ua"
                                            ? "Додайте GA4 події (CTA, форма, месенджер) — тоді демо стане повністю «end-to-end»."
                                            : "Add GA4 events (CTA, form, messenger) to make the demo fully end-to-end."}
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-300/80" />
                                    <span>
                                        {locale === "ua"
                                            ? "Підключіть антиспам (Turnstile) + миттєвий роутинг заявок у Telegram/CRM."
                                            : "Add anti-spam (Turnstile) + instant lead routing to Telegram/CRM."}
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-300/80" />
                                    <span>
                                        {locale === "ua"
                                            ? "Для економії квоти: Desktop запитуйте тільки коли потрібно (кнопка вище)."
                                            : "To save quota: request Desktop only when needed (button above)."}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
                    <p className="text-sm text-white/70">
                        {locale === "ua"
                            ? "Немає даних Lighthouse. Спробуйте інший сайт або повторіть пізніше."
                            : "No Lighthouse data available. Try another site or retry later."}
                    </p>
                </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                    href={withLocale(locale, "/demo/automation")}
                    className={cx(
                        "inline-flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold",
                        "bg-blue-600 text-white shadow-lg shadow-blue-600/20",
                        "transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/60",
                    )}
                >
                    {locale === "ua"
                        ? "Подивитись автоматизацію заявок"
                        : "See lead automation"}
                </Link>

                <button
                    type="button"
                    onClick={onReset}
                    className={cx(
                        "inline-flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold",
                        "border border-white/15 bg-white/5 text-white/90 backdrop-blur",
                        "transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30",
                    )}
                >
                    {locale === "ua"
                        ? "Перевірити інший сайт"
                        : "Check another site"}
                </button>
            </div>
        </Card>
    );
}

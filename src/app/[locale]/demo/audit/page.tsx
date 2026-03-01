// src/app/[locale]/demo/audit/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import Section from "@/components/ui/Section";
import Heading from "@/components/ui/Heading";
import AuditForm from "@/components/demo/AuditForm";
import {
    buildAlternates,
    buildSocial,
    defaultRobots,
    siteUrl,
} from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

function isLocale(v: string): v is Locale {
    return (locales as readonly string[]).includes(v);
}

const copy: Record<
    Locale,
    {
        title: string;
        description: string;
        breadcrumbHome: string;
        breadcrumbDemo: string;
        breadcrumbThis: string;
        pageName: string;
        kicker: string;
        hTitle: string;
        subtitle: string;
        serviceName: string;
        serviceDescription: string;
    }
> = {
    ua: {
        title: "Міні-аудит — демо — Vectora Systems",
        description:
            "Демо міні-аудит: швидкість, базове SEO, конверсія та точки втрати заявок. Отримайте зрозумілі рекомендації і наступні кроки.",
        breadcrumbHome: "Головна",
        breadcrumbDemo: "Демо",
        breadcrumbThis: "Міні-аудит",
        pageName: "Демо: міні-аудит",
        kicker: "Демо: міні-аудит",
        hTitle: "Швидко покажемо, що заважає заявкам — і що виправити в першу чергу",
        subtitle:
            "Введіть адресу сайту. У демо-режимі ви отримаєте приклад зрозумілого результату: ключові проблеми, пріоритети та наступні кроки.",
        serviceName: "Міні-аудит сайту (демо)",
        serviceDescription:
            "Швидкий демо-аудит: продуктивність, базове SEO, конверсія та точки втрати заявок із пріоритетами й наступними кроками.",
    },
    en: {
        title: "Mini audit — demo — Vectora Systems",
        description:
            "Demo mini-audit: performance, basic SEO, conversion and lead drop-off points. Get clear recommendations and next steps.",
        breadcrumbHome: "Home",
        breadcrumbDemo: "Demo",
        breadcrumbThis: "Mini audit",
        pageName: "Demo: mini audit",
        kicker: "Demo: mini audit",
        hTitle: "Quickly reveal what blocks leads — and what to fix first",
        subtitle:
            "Enter your website URL. In demo mode you’ll see a clear outcome format: key issues, priorities, and next steps.",
        serviceName: "Website mini-audit (demo)",
        serviceDescription:
            "Fast demo audit: performance, basic SEO, conversion and lead drop-off points with priorities and next steps.",
    },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    const m = copy[locale];
    const { canonical, languages } = buildAlternates(locale, "/demo/audit");

    return {
        title: m.title,
        description: m.description,
        robots: defaultRobots(),
        alternates: { canonical, languages },
        ...buildSocial({
            locale,
            canonical,
            title: m.title,
            description: m.description,
            ogImagePath: "/og-demo-audit.jpg",
            ogAlt: "Vectora Systems — Mini audit demo",
        }),
    };
}

function schema(locale: Locale) {
    const base = siteUrl();
    const m = copy[locale];

    const homeUrl = new URL(`/${locale}`, base).toString();
    const demoUrl = new URL(`/${locale}/demo`, base).toString();
    const pageUrl = new URL(`/${locale}/demo/audit`, base).toString();

    return [
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: m.breadcrumbHome,
                    item: homeUrl,
                },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: m.breadcrumbDemo,
                    item: demoUrl,
                },
                {
                    "@type": "ListItem",
                    position: 3,
                    name: m.breadcrumbThis,
                    item: pageUrl,
                },
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: m.pageName,
            url: pageUrl,
            description: m.description,
        },
        {
            "@context": "https://schema.org",
            "@type": "Service",
            name: m.serviceName,
            url: pageUrl,
            provider: {
                "@type": "Organization",
                name: "Vectora Systems",
                url: homeUrl,
            },
            description: m.serviceDescription,
            serviceType: [
                "Website audit",
                "Performance audit",
                "SEO basics review",
                "Conversion review",
            ],
        },
    ];
}

export default async function AuditPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    return (
        <>
            <Script
                id="schema-demo-audit"
                type="application/ld+json"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(schema(locale)),
                }}
            />
            <main className="min-h-dvh">
                <Section>
                    <Heading
                        kicker={copy[locale].kicker}
                        title={copy[locale].hTitle}
                        subtitle={copy[locale].subtitle}
                    />
                </Section>

                <Section variant="muted">
                    <div className="mx-auto max-w-4xl">
                        <AuditForm locale={locale} />
                    </div>
                </Section>
            </main>
        </>
    );
}

// src/app/[locale]/demo/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import DemoHubPageClient from "@/components/sections/demo/DemoHubPageClient";
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
        breadcrumbThis: string;
        pageName: string;
        listName: string;
        items: Array<{ name: string; path: string }>;
    }
> = {
    ua: {
        title: "Демо — Vectora Systems",
        description:
            "Спробуйте демо: міні-аудит сайту, автоматизація заявок та AI-агент. Подивіться підхід і формат результату ще до старту роботи.",
        breadcrumbHome: "Головна",
        breadcrumbThis: "Демо",
        pageName: "Демо",
        listName: "Демо-інструменти",
        items: [
            { name: "Міні-аудит", path: "/demo/audit" },
            { name: "Автоматизація заявок", path: "/demo/automation" },
            { name: "AI-агент", path: "/demo/ai-agent" },
        ],
    },
    en: {
        title: "Demo — Vectora Systems",
        description:
            "Try our demos: website mini audit, lead automation and an AI agent. Preview the approach and outcome format before we start.",
        breadcrumbHome: "Home",
        breadcrumbThis: "Demo",
        pageName: "Demo",
        listName: "Demo tools",
        items: [
            { name: "Mini audit", path: "/demo/audit" },
            { name: "Lead automation", path: "/demo/automation" },
            { name: "AI agent", path: "/demo/ai-agent" },
        ],
    },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    const m = copy[locale];
    const { canonical, languages } = buildAlternates(locale, "/demo");

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
            ogImagePath: "/og-demo.jpg",
            ogAlt: "Vectora Systems — Demo",
        }),
    };
}

function demoSchema(locale: Locale) {
    const base = siteUrl();
    const m = copy[locale];

    const homeUrl = new URL(`/${locale}`, base).toString();
    const pageUrl = new URL(`/${locale}/demo`, base).toString();

    // ItemList must reflect REAL, existing pages (truthful schema)
    const itemListElement = m.items.map((it, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: it.name,
        url: new URL(`/${locale}${it.path}`, base).toString(),
    }));

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
            "@type": "ItemList",
            name: m.listName,
            itemListOrder: "https://schema.org/ItemListOrderAscending",
            numberOfItems: itemListElement.length,
            itemListElement,
        },
    ];
}

export default async function DemoHubPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    return (
        <>
            <Script
                id="schema-demo"
                type="application/ld+json"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(demoSchema(locale)),
                }}
            />
            <DemoHubPageClient locale={locale} />
        </>
    );
}

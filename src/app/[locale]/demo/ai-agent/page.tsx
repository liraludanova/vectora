// src/app/[locale]/demo/ai-agent/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import AIAgentPreview from "@/components/demo/AIAgentPreview";
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
    }
> = {
    ua: {
        title: "AI-агент — демо — Vectora Systems",
        description:
            "Демо AI-агента для бізнесу: приймає заявки, фільтрує спам, ставить уточнення і формує структурований наступний крок для менеджера.",
        breadcrumbHome: "Головна",
        breadcrumbDemo: "Демо",
        breadcrumbThis: "AI-агент",
        pageName: "Демо: AI-агент",
    },
    en: {
        title: "AI agent — demo — Vectora Systems",
        description:
            "Demo AI agent for business: captures leads, filters spam, asks clarifying questions and prepares a structured next step for your team.",
        breadcrumbHome: "Home",
        breadcrumbDemo: "Demo",
        breadcrumbThis: "AI agent",
        pageName: "Demo: AI agent",
    },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    const m = copy[locale];
    const { canonical, languages } = buildAlternates(locale, "/demo/ai-agent");

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
            ogImagePath: "/og-demo-ai-agent.jpg",
            ogAlt: "Vectora Systems — AI agent demo",
        }),
    };
}

function schema(locale: Locale) {
    const base = siteUrl();
    const m = copy[locale];

    const homeUrl = new URL(`/${locale}`, base).toString();
    const demoUrl = new URL(`/${locale}/demo`, base).toString();
    const pageUrl = new URL(`/${locale}/demo/ai-agent`, base).toString();

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
            "@type": "SoftwareApplication",
            name: "Vectora AI Agent (Demo)",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            url: pageUrl,
            description: m.description,
            publisher: {
                "@type": "Organization",
                name: "Vectora Systems",
                url: homeUrl,
            },
        },
    ];
}

export default async function AIAgentDemoPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    return (
        <>
            <Script
                id="schema-demo-ai-agent"
                type="application/ld+json"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(schema(locale)),
                }}
            />
            <main className="min-h-dvh">
                <AIAgentPreview locale={locale} />
            </main>
        </>
    );
}

import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import AISolutionsPageClient from "@/components/sections/ai-solutions/AISolutionsPageClient";
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
        serviceName: string;
        serviceDescription: string;
    }
> = {
    ua: {
        title: "AI-рішення — Vectora Systems",
        description:
            "Практичні AI-помічники для бізнесу: швидші відповіді, менше втрат заявок, автоматизація рутини та контроль якості комунікацій.",
        breadcrumbHome: "Головна",
        breadcrumbThis: "AI-рішення",
        serviceName: "AI-рішення для бізнесу",
        serviceDescription:
            "AI-помічники для бізнесу: відповіді клієнтам, кваліфікація лідів, автоматизація рутини та контроль якості комунікацій.",
    },
    en: {
        title: "AI Solutions — Vectora Systems",
        description:
            "Practical AI assistants for SMBs: faster replies, fewer lost leads, routine automation and communication quality control.",
        breadcrumbHome: "Home",
        breadcrumbThis: "AI Solutions",
        serviceName: "AI solutions for SMBs",
        serviceDescription:
            "Practical AI assistants: faster replies, fewer lost leads, routine automation and communication quality control.",
    },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    const m = copy[locale];
    const { canonical, languages } = buildAlternates(locale, "/ai-solutions");

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
            ogImagePath: "/og-ai.jpg",
            ogAlt: "Vectora Systems — AI Solutions",
        }),
    };
}

function aiSchema(locale: Locale) {
    const base = siteUrl();
    const m = copy[locale];

    const homeUrl = new URL(`/${locale}`, base).toString();
    const pageUrl = new URL(`/${locale}/ai-solutions`, base).toString();

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
                "AI agent",
                "Lead qualification",
                "Support automation",
                "Website chatbot",
                "CRM integrations",
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: m.title,
            url: pageUrl,
            description: m.description,
        },
    ];
}

export default async function AISolutionsPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    return (
        <>
            <Script
                id="schema-ai-solutions"
                type="application/ld+json"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(aiSchema(locale)),
                }}
            />
            <AISolutionsPageClient locale={locale} />
        </>
    );
}

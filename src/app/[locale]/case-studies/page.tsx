import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import CaseStudiesPageClient from "@/components/sections/case-studies/CaseStudiesPageClient";
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
    }
> = {
    ua: {
        title: "Кейси — Vectora Systems",
        description:
            "Приклади результатів у форматі «було → зробили → стало»: швидкість і UX, SEO-основа, аналітика, автоматизація заявок. Підхід для малого бізнесу в Україні.",
        breadcrumbHome: "Головна",
        breadcrumbThis: "Кейси",
    },
    en: {
        title: "Case studies — Vectora Systems",
        description:
            "Examples of outcomes in a clear “before → work → after” format: performance & UX, SEO foundations, analytics, lead automation. Built for SMBs.",
        breadcrumbHome: "Home",
        breadcrumbThis: "Case studies",
    },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    const m = copy[locale];
    const { canonical, languages } = buildAlternates(locale, "/case-studies");

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
            ogImagePath: "/og-cases.jpg",
            ogAlt: "Vectora Systems — Case studies",
        }),
    };
}

function casesSchema(locale: Locale) {
    const base = siteUrl();
    const m = copy[locale];

    const homeUrl = new URL(`/${locale}`, base).toString();
    const pageUrl = new URL(`/${locale}/case-studies`, base).toString();

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
            "@type": "CollectionPage",
            name: m.title,
            url: pageUrl,
            description: m.description,
        },
    ];
}

export default async function CaseStudiesPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    return (
        <>
            <Script
                id="schema-case-studies"
                type="application/ld+json"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(casesSchema(locale)),
                }}
            />
            <CaseStudiesPageClient locale={locale} />
        </>
    );
}

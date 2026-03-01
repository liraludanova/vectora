// src/app/[locale]/page.tsx
import Script from "next/script";
import { notFound } from "next/navigation";

import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";

import Hero from "@/components/sections/hero/Hero";
import HowWeWorkSection from "@/components/sections/how-we-work/HowWeWorkSection";
import ProblemsSection from "@/components/sections/problems/ProblemsSection";
import FAQSection from "@/components/sections/faq/FAQSection";
import TransformationSection from "@/components/sections/transformation/TransformationSection";
import ResultsSection from "@/components/sections/results/ResultsSection";
import FinalCTA from "@/components/sections/cta/FinalCTA";

import { siteUrl } from "@/lib/seo";

type Props = {
    params: { locale: string };
};

function isLocale(value: string): value is Locale {
    return (locales as readonly string[]).includes(value);
}

function homeSchema(locale: Locale) {
    const base = siteUrl();

    const homeUrl = new URL(`/${locale}`, base).toString();

    const pageName =
        locale === "ua"
            ? "Головна — Vectora Systems"
            : "Home — Vectora Systems";

    const description =
        locale === "ua"
            ? "AI-рішення для бізнесу: прийом заявок, автоматизація, аналітика та покращення конверсії."
            : "AI solutions for business: lead capture, automation, analytics, and conversion improvements.";

    return [
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: locale === "ua" ? "Головна" : "Home",
                    item: homeUrl,
                },
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Vectora Systems",
            url: homeUrl,
        },
        {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: pageName,
            url: homeUrl,
            description,
        },
    ];
}

export default async function HomePage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    return (
        <>
            {/* Home schema (FAQ schema остаётся в FAQSection) */}
            <Script
                id="schema-home"
                type="application/ld+json"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(homeSchema(locale)),
                }}
            />

            <main className="min-h-dvh">
                <Hero locale={locale} />

                <HowWeWorkSection locale={locale} />
                <ProblemsSection locale={locale} />

                <TransformationSection locale={locale} />
                <ResultsSection locale={locale} />

                <FAQSection locale={locale} />

                <FinalCTA locale={locale} />
            </main>
        </>
    );
}

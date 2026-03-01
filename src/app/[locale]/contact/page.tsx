import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import ContactPageClient from "@/components/sections/contact/ContactPageClient";
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
    }
> = {
    ua: {
        title: "Контакти — Vectora Systems",
        description:
            "Опишіть задачу — запропонуємо 2–3 найшвидші кроки з найбільшим ефектом: швидкість, SEO-основа, аналітика, автоматизація заявок та AI-помічники для малого бізнесу.",
        breadcrumbHome: "Головна",
        breadcrumbThis: "Контакти",
        pageName: "Контакти",
    },
    en: {
        title: "Contact — Vectora Systems",
        description:
            "Describe your goal — we’ll suggest 2–3 fastest high-impact steps: performance, SEO foundations, analytics, lead automation and practical AI assistants for SMBs.",
        breadcrumbHome: "Home",
        breadcrumbThis: "Contact",
        pageName: "Contact",
    },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    const m = copy[locale];
    const { canonical, languages } = buildAlternates(locale, "/contact");

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
            ogImagePath: "/og-contact.jpg",
            ogAlt: "Vectora Systems — Contact",
        }),
    };
}

function contactSchema(locale: Locale) {
    const base = siteUrl();
    const m = copy[locale];

    const homeUrl = new URL(`/${locale}`, base).toString();
    const pageUrl = new URL(`/${locale}/contact`, base).toString();

    const org = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Vectora Systems",
        url: homeUrl,
    };

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
            "@type": "ContactPage",
            name: m.pageName,
            url: pageUrl,
            description: m.description,
            about: org,
        },
        org,
    ];
}

export default async function ContactPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    return (
        <>
            <Script
                id="schema-contact"
                type="application/ld+json"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(contactSchema(locale)),
                }}
            />
            <ContactPageClient locale={locale} />
        </>
    );
}

import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import ServicesPageClient from "@/components/sections/services/ServicesPageClient";
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
        title: "Послуги — Vectora Systems",
        description:
            "Робимо сайт швидким і зрозумілим для клієнтів та Google: швидкість, SEO-основа, аналітика, автоматизація заявок і AI-помічники для малого бізнесу в Україні.",
        breadcrumbHome: "Головна",
        breadcrumbThis: "Послуги",
        serviceName: "Послуги для малого бізнесу",
        serviceDescription:
            "Розробка сайтів, технічне SEO, аналітика, автоматизація заявок та AI-помічники для малого бізнесу.",
    },
    en: {
        title: "Services — Vectora Systems",
        description:
            "Make your website faster and clearer for customers and Google: performance, SEO foundations, analytics, lead automation and practical AI assistants for SMBs.",
        breadcrumbHome: "Home",
        breadcrumbThis: "Services",
        serviceName: "Services for SMBs",
        serviceDescription:
            "Website development, technical SEO, analytics setup, lead automation and practical AI assistants for SMBs.",
    },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    const m = copy[locale];
    const { canonical, languages } = buildAlternates(locale, "/services");

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
            ogImagePath: "/og-services.jpg",
            ogAlt: "Vectora Systems — Services",
        }),
    };
}

function servicesSchema(locale: Locale) {
    const base = siteUrl();
    const m = copy[locale];

    const homeUrl = new URL(`/${locale}`, base).toString();
    const pageUrl = new URL(`/${locale}/services`, base).toString();

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
                "Website development",
                "Technical SEO",
                "Web analytics",
                "Lead automation",
                "AI assistants",
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

export default async function ServicesPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    return (
        <>
            <Script
                id="schema-services"
                type="application/ld+json"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(servicesSchema(locale)),
                }}
            />
            <ServicesPageClient locale={locale} />
        </>
    );
}

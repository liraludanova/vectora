// src/app/[locale]/demo/automation/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import AutomationFlow from "@/components/demo/AutomationFlow";
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
        serviceName: string;
        serviceDescription: string;
    }
> = {
    ua: {
        title: "Автоматизація заявок — демо — Vectora Systems",
        description:
            "Демо потоку: форма → Telegram/CRM → статуси → нагадування → контроль. Менше втрачених заявок і швидша відповідь клієнту.",
        breadcrumbHome: "Головна",
        breadcrumbDemo: "Демо",
        breadcrumbThis: "Автоматизація",
        pageName: "Демо: автоматизація заявок",
        serviceName: "Автоматизація заявок (демо)",
        serviceDescription:
            "Демо-процес: форма → Telegram/CRM → статуси → нагадування → контроль, щоб зменшити втрати заявок і прискорити відповідь.",
    },
    en: {
        title: "Lead automation — demo — Vectora Systems",
        description:
            "Demo flow: form → Telegram/CRM → statuses → reminders → control. Fewer lost leads and faster responses.",
        breadcrumbHome: "Home",
        breadcrumbDemo: "Demo",
        breadcrumbThis: "Automation",
        pageName: "Demo: lead automation",
        serviceName: "Lead automation (demo)",
        serviceDescription:
            "Demo process: form → Telegram/CRM → statuses → reminders → control to reduce lost leads and speed up responses.",
    },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    const m = copy[locale];
    const { canonical, languages } = buildAlternates(
        locale,
        "/demo/automation",
    );

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
            ogImagePath: "/og-demo-automation.jpg",
            ogAlt: "Vectora Systems — Lead automation demo",
        }),
    };
}

function schema(locale: Locale) {
    const base = siteUrl();
    const m = copy[locale];

    const homeUrl = new URL(`/${locale}`, base).toString();
    const demoUrl = new URL(`/${locale}/demo`, base).toString();
    const pageUrl = new URL(`/${locale}/demo/automation`, base).toString();

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
                "Lead automation",
                "CRM integration",
                "Telegram integration",
                "Workflow automation",
            ],
        },
    ];
}

export default async function AutomationDemoPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    return (
        <>
            <Script
                id="schema-demo-automation"
                type="application/ld+json"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(schema(locale)),
                }}
            />
            <main className="min-h-dvh">
                <AutomationFlow locale={locale} />
            </main>
        </>
    );
}

import type { ReactNode } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

type Props = {
    children: ReactNode;
    params: Promise<{ locale: string }>;
};

function isLocale(v: string): v is Locale {
    return (locales as readonly string[]).includes(v);
}

function siteUrl(): URL {
    const raw =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.VERCEL_URL ||
        "http://localhost:3000";

    const normalized = raw.startsWith("http") ? raw : `https://${raw}`;
    return new URL(normalized);
}

function t(locale: Locale) {
    if (locale === "ua") {
        return {
            siteName: "Vectora Systems",
            titleDefault: "Vectora Systems — AI-рішення для бізнесу",
            titleTemplate: "%s — Vectora Systems",
            description:
                "AI-агент для бізнесу: заявки, фільтрація спаму, кваліфікація лідів і наступні кроки. Розробка, інтеграції, автоматизація.",
        };
    }
    return {
        siteName: "Vectora Systems",
        titleDefault: "Vectora Systems — AI solutions for business",
        titleTemplate: "%s — Vectora Systems",
        description:
            "AI agent for business: captures leads, filters spam, qualifies prospects, and suggests next steps. Development, integrations, automation.",
    };
}

export async function generateMetadata(props: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await props.params;
    if (!isLocale(locale)) notFound();

    const base = siteUrl();
    const copy = t(locale);

    const canonical = new URL(`/${locale}`, base);

    return {
        metadataBase: base,
        title: {
            default: copy.titleDefault,
            template: copy.titleTemplate,
        },
        description: copy.description,
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
                "max-snippet": -1,
                "max-video-preview": -1,
            },
        },
        alternates: {
            canonical,
            languages: {
                "x-default": new URL("/ua", base),
                uk: new URL("/ua", base),
                en: new URL("/en", base),
            },
        },
        openGraph: {
            type: "website",
            siteName: copy.siteName,
            url: canonical,
            locale: locale === "ua" ? "uk_UA" : "en_US",
            title: copy.titleDefault,
            description: copy.description,
            images: [
                {
                    url: new URL("/og.jpg", base),
                    width: 1200,
                    height: 630,
                    alt: copy.siteName,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: copy.titleDefault,
            description: copy.description,
            images: [new URL("/og.jpg", base)],
        },
        icons: {
            icon: "/favicon.ico",
            shortcut: "/favicon.ico",
            apple: "/apple-touch-icon.png",
        },
    };
}

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    return (
        <html lang={locale === "ua" ? "uk" : "en"} suppressHydrationWarning>
            <body className="bg-black text-white">
                {/* GA4: load gtag.js */}
                {GA_ID ? (
                    <>
                        <Script
                            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                            strategy="afterInteractive"
                        />
                        <Script id="ga-init" strategy="afterInteractive">
                            {`
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                window.gtag = gtag;
                                gtag('js', new Date());
                                gtag('config', '${GA_ID}', {
                                    send_page_view: false
                                });
                            `}
                        </Script>
                    </>
                ) : null}

                {/* SPA page_view on route change */}
                <AnalyticsProvider locale={locale} />

                <Header locale={locale} />
                {children}
                <Footer locale={locale} />
            </body>
        </html>
    );
}

// src/lib/seo.ts
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";

export function siteUrl(): URL {
    const raw =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.VERCEL_URL ||
        "http://localhost:3000";

    const normalized = raw.startsWith("http") ? raw : `https://${raw}`;
    return new URL(normalized);
}

export function ogLocale(locale: Locale): "uk_UA" | "en_US" {
    return locale === "ua" ? "uk_UA" : "en_US";
}

export function htmlLang(locale: Locale): "uk" | "en" {
    return locale === "ua" ? "uk" : "en";
}

/**
 * `locale` here is your route-locale: "ua" | "en"
 * hreflang keys must be valid language tags: "uk" / "en"
 * URLs must match your actual routes: /ua/... and /en/...
 */
export function buildAlternates(locale: Locale, path: string) {
    const base = siteUrl();
    const canonical = new URL(`/${locale}${path}`, base);

    const languages: Record<string, URL> = {
        "x-default": new URL(`/ua${path}`, base),
        uk: new URL(`/ua${path}`, base),
        en: new URL(`/en${path}`, base),
    };

    return { canonical, languages };
}

export function defaultRobots(): NonNullable<Metadata["robots"]> {
    return {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    };
}

export function buildSocial(args: {
    locale: Locale;
    canonical: URL;
    title: string;
    description: string;
    ogImagePath: string; // e.g. "/og-services.jpg"
    ogAlt: string;
}): Pick<Metadata, "openGraph" | "twitter"> {
    const base = siteUrl();
    const ogImage = new URL(args.ogImagePath, base);

    return {
        openGraph: {
            type: "website",
            url: args.canonical,
            title: args.title,
            description: args.description,
            locale: ogLocale(args.locale),
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: args.ogAlt,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: args.title,
            description: args.description,
            images: [ogImage],
        },
    };
}

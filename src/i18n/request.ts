import { getRequestConfig } from "next-intl/server";

const supportedLocales = ["ua", "en"] as const;
type SupportedLocale = (typeof supportedLocales)[number];

function isSupportedLocale(value: string): value is SupportedLocale {
    return (supportedLocales as readonly string[]).includes(value);
}

export default getRequestConfig(async ({ locale }) => {
    const raw = locale ?? "ua";
    const safeLocale: SupportedLocale = isSupportedLocale(raw) ? raw : "ua";

    return {
        locale: safeLocale,
        messages: (await import(`../messages/${safeLocale}.json`)).default,
    };
});

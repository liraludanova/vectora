"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { trackPageView } from "@/lib/analytics";

type Props = {
    locale: Locale;
};

export default function AnalyticsProvider({ locale }: Props) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const qs = searchParams?.toString();
        const url =
            typeof window !== "undefined"
                ? `${window.location.origin}${pathname}${qs ? `?${qs}` : ""}`
                : `${pathname}${qs ? `?${qs}` : ""}`;

        trackPageView(url, locale);
    }, [pathname, searchParams, locale]);

    return null;
}

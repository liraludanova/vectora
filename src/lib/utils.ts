import { clsx, type ClassValue } from "clsx";
import type { Locale } from "@/lib/i18n";
export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export function localePath(locale: Locale, path: string) {
    return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}

export function withLocale(locale: Locale, path: string) {
    const clean = path.startsWith("/") ? path : `/${path}`;
    return `/${locale}${clean}`;
}

export function cx(...classes: Array<string | undefined | false | null>) {
    return classes.filter(Boolean).join(" ");
}

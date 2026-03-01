// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["ua", "en"] as const;
type Locale = (typeof locales)[number];

function hasLocale(pathname: string): boolean {
    const seg = pathname.split("/").filter(Boolean)[0];
    return seg === "ua" || seg === "en";
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // ВАЖНО: исключаем системные и API пути
    if (
        pathname.startsWith("/api") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon.ico") ||
        pathname.startsWith("/robots.txt") ||
        pathname.startsWith("/sitemap.xml") ||
        pathname.startsWith("/manifest.webmanifest")
    ) {
        return NextResponse.next();
    }

    if (hasLocale(pathname)) return NextResponse.next();

    // default locale
    const url = req.nextUrl.clone();
    url.pathname = `/ua${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
}

export const config = {
    matcher: [
        // матчим всё, КРОМЕ api/_next/static/_next/image и файлов
        "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest).*)",
    ],
};

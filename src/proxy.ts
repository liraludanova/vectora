import createMiddleware from "next-intl/middleware";

export default createMiddleware({
    locales: ["ua", "en"],
    defaultLocale: "ua",
});

export const config = {
    matcher: ["/", "/(ua|en)/:path*"],
};

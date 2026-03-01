"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
    useMemo,
    useTransition,
    useCallback,
    useEffect,
    useState,
} from "react";
import type { Locale } from "@/lib/i18n";
import { withLocale, cx } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

type Props = {
    locale: Locale;
};

const labels = {
    ua: {
        services: "Послуги",
        ai: "AI-рішення",
        cases: "Кейси",
        contact: "Контакти",
        audit: "Міні-аудит",

        how: "Як ми працюємо",
        problems: "Проблеми",
        faq: "FAQ",

        topAria: "Повернутися нагору",

        langUA: "UA",
        langEN: "EN",
        langAria: "Перемкнути мову",
    },
    en: {
        services: "Services",
        ai: "AI solutions",
        cases: "Case studies",
        contact: "Contact",
        audit: "Free mini audit",

        how: "How we work",
        problems: "Problems",
        faq: "FAQ",

        topAria: "Back to top",

        langUA: "UA",
        langEN: "EN",
        langAria: "Switch language",
    },
} as const;

const HOME_ANCHORS = ["how-we-work", "problems", "faq"] as const;
type HomeAnchor = (typeof HOME_ANCHORS)[number];

function otherLocale(locale: Locale): Locale {
    return locale === "ua" ? "en" : "ua";
}

function switchLocaleInPath(pathname: string, nextLocale: Locale): string {
    const normalized =
        pathname && pathname.startsWith("/") ? pathname : `/${pathname || ""}`;
    const parts = normalized.split("/").filter(Boolean);

    if (parts.length === 0) return `/${nextLocale}`;

    const first = parts[0];
    if (first === "ua" || first === "en") {
        parts[0] = nextLocale;
        return "/" + parts.join("/");
    }

    return `/${nextLocale}${normalized === "/" ? "" : normalized}`;
}

function isHomePath(pathname: string | null | undefined, locale: Locale) {
    if (!pathname) return false;
    return pathname === `/${locale}` || pathname === `/${locale}/`;
}

function LanguageToggle({ locale }: { locale: Locale }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const next = useMemo(() => otherLocale(locale), [locale]);
    const nextPath = useMemo(
        () => switchLocaleInPath(pathname || "/", next),
        [pathname, next],
    );

    return (
        <button
            type="button"
            onClick={() => {
                trackEvent("demo_interaction", {
                    locale,
                    action: "switch_language",
                    to: next,
                });

                startTransition(() => {
                    router.push(nextPath);
                });
            }}
            aria-label={labels[locale].langAria}
            className={cx(
                "inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2",
                "text-xs font-semibold text-white/80 backdrop-blur transition hover:bg-white/10",
                "focus:outline-none focus:ring-2 focus:ring-white/25",
                isPending ? "opacity-70" : "opacity-100",
            )}
        >
            <span
                className={cx(
                    "rounded-lg px-2 py-1",
                    locale === "ua"
                        ? "bg-white/10 text-white"
                        : "text-white/70",
                )}
            >
                {labels[locale].langUA}
            </span>
            <span className="text-white/40">/</span>
            <span
                className={cx(
                    "rounded-lg px-2 py-1",
                    locale === "en"
                        ? "bg-white/10 text-white"
                        : "text-white/70",
                )}
            >
                {labels[locale].langEN}
            </span>
        </button>
    );
}

function BackToTopButton({ locale }: { locale: Locale }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 700);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const onClick = useCallback(() => {
        trackEvent("demo_interaction", {
            locale,
            action: "back_to_top",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [locale]);

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={labels[locale].topAria}
            className={cx(
                "fixed bottom-5 right-5 z-50",
                "inline-flex items-center justify-center",
                "h-11 w-11 rounded-2xl",
                "border border-white/15 bg-black/60 backdrop-blur",
                "text-white/80 shadow-lg shadow-black/40",
                "transition-all duration-200",
                "hover:bg-white/10 hover:text-white",
                "focus:outline-none focus:ring-2 focus:ring-blue-400/60",
                visible
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 translate-y-2 pointer-events-none",
            )}
        >
            <span aria-hidden="true" className="text-lg leading-none">
                ↑
            </span>
        </button>
    );
}

function useActiveHomeAnchor(enabled: boolean) {
    const [active, setActive] = useState<HomeAnchor | "">("");

    useEffect(() => {
        if (!enabled) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActive("");
            return;
        }

        const hash = window.location.hash?.replace("#", "");
        if (
            hash &&
            (HOME_ANCHORS as readonly string[]).includes(hash as string)
        ) {
            setActive(hash as HomeAnchor);
        }

        const elements: Array<HTMLElement> = [];
        for (const id of HOME_ANCHORS) {
            const el = document.getElementById(id);
            if (el) elements.push(el);
        }
        if (elements.length === 0) return;

        let raf = 0;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => {
                        const at = (a.target as HTMLElement).offsetTop;
                        const bt = (b.target as HTMLElement).offsetTop;
                        return at - bt;
                    });

                if (visible.length === 0) return;

                const id = (visible[0].target as HTMLElement).id as HomeAnchor;

                cancelAnimationFrame(raf);
                raf = window.requestAnimationFrame(() => {
                    setActive((prev) => (prev === id ? prev : id));

                    if (window.location.hash !== `#${id}`) {
                        window.history.replaceState(null, "", `#${id}`);
                    }
                });
            },
            {
                root: null,
                rootMargin: "-120px 0px -55% 0px",
                threshold: [0.01, 0.1, 0.25],
            },
        );

        elements.forEach((el) => observer.observe(el));

        return () => {
            cancelAnimationFrame(raf);
            observer.disconnect();
        };
    }, [enabled]);

    return active;
}

export default function Header({ locale }: Props) {
    const t = labels[locale];
    const pathname = usePathname();
    const router = useRouter();

    const home = isHomePath(pathname, locale);
    const activeAnchor = useActiveHomeAnchor(home);

    const ctaHref = withLocale(locale, "/demo/audit");

    const goToAnchor = useCallback(
        (id: HomeAnchor) => {
            trackEvent("demo_interaction", {
                locale,
                action: "nav_anchor",
                anchor: id,
                from: pathname || "",
            });

            if (home) {
                const el = document.getElementById(id);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                    window.history.replaceState(null, "", `#${id}`);
                    return;
                }
                window.history.replaceState(null, "", `#${id}`);
                return;
            }

            router.push(withLocale(locale, `/#${id}`));
        },
        [home, router, locale, pathname],
    );

    const navLinkClass = (active?: boolean) =>
        cx(
            "text-sm transition",
            active ? "text-white" : "text-white/70 hover:text-white",
        );

    const anchorBtnClass = (active?: boolean) =>
        cx(
            "text-sm transition",
            active ? "text-white" : "text-white/70 hover:text-white",
            "focus:outline-none focus:ring-2 focus:ring-white/20 rounded-lg px-1 py-1",
        );

    const activePath = pathname || "";
    const isServices = activePath.includes("/services");
    const isAi = activePath.includes("/ai-solutions");
    const isCases = activePath.includes("/case-studies");
    const isContact = activePath.includes("/contact");

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
                    <Link
                        href={withLocale(locale, "/")}
                        onClick={() =>
                            trackEvent("cta_click", {
                                locale,
                                location: "header",
                                cta: "logo",
                                to: `/${locale}`,
                            })
                        }
                        className="flex items-center gap-2"
                        aria-label="Vectora Systems"
                    >
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                            <span className="text-sm font-semibold tracking-tight text-white">
                                V
                            </span>
                        </span>
                        <span className="text-sm font-semibold text-white/90">
                            Vectora Systems
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-6 md:flex">
                        <button
                            type="button"
                            onClick={() => goToAnchor("how-we-work")}
                            className={anchorBtnClass(
                                home && activeAnchor === "how-we-work",
                            )}
                            aria-current={
                                home && activeAnchor === "how-we-work"
                                    ? "page"
                                    : undefined
                            }
                        >
                            {t.how}
                        </button>

                        <button
                            type="button"
                            onClick={() => goToAnchor("problems")}
                            className={anchorBtnClass(
                                home && activeAnchor === "problems",
                            )}
                            aria-current={
                                home && activeAnchor === "problems"
                                    ? "page"
                                    : undefined
                            }
                        >
                            {t.problems}
                        </button>

                        <button
                            type="button"
                            onClick={() => goToAnchor("faq")}
                            className={anchorBtnClass(
                                home && activeAnchor === "faq",
                            )}
                            aria-current={
                                home && activeAnchor === "faq"
                                    ? "page"
                                    : undefined
                            }
                        >
                            {t.faq}
                        </button>

                        <span className="h-5 w-px bg-white/10" />

                        <Link
                            className={navLinkClass(isServices)}
                            href={withLocale(locale, "/services")}
                            aria-current={isServices ? "page" : undefined}
                            onClick={() =>
                                trackEvent("cta_click", {
                                    locale,
                                    location: "header_nav",
                                    cta: "services",
                                    to: `/${locale}/services`,
                                })
                            }
                        >
                            {t.services}
                        </Link>

                        <Link
                            className={navLinkClass(isAi)}
                            href={withLocale(locale, "/ai-solutions")}
                            aria-current={isAi ? "page" : undefined}
                            onClick={() =>
                                trackEvent("cta_click", {
                                    locale,
                                    location: "header_nav",
                                    cta: "ai_solutions",
                                    to: `/${locale}/ai-solutions`,
                                })
                            }
                        >
                            {t.ai}
                        </Link>

                        <Link
                            className={navLinkClass(isCases)}
                            href={withLocale(locale, "/case-studies")}
                            aria-current={isCases ? "page" : undefined}
                            onClick={() =>
                                trackEvent("cta_click", {
                                    locale,
                                    location: "header_nav",
                                    cta: "case_studies",
                                    to: `/${locale}/case-studies`,
                                })
                            }
                        >
                            {t.cases}
                        </Link>

                        <Link
                            className={navLinkClass(isContact)}
                            href={withLocale(locale, "/contact")}
                            aria-current={isContact ? "page" : undefined}
                            onClick={() =>
                                trackEvent("cta_click", {
                                    locale,
                                    location: "header_nav",
                                    cta: "contact",
                                    to: `/${locale}/contact`,
                                })
                            }
                        >
                            {t.contact}
                        </Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        <LanguageToggle locale={locale} />

                        <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                        >
                            <Link
                                href={ctaHref}
                                onClick={() =>
                                    trackEvent("cta_click", {
                                        locale,
                                        location: "header",
                                        cta: "mini_audit",
                                        to: `/${locale}/demo/audit`,
                                    })
                                }
                                className={cx(
                                    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
                                    "bg-blue-600 text-white shadow-lg shadow-blue-600/20",
                                    "transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/60",
                                )}
                            >
                                {t.audit}
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </header>

            <BackToTopButton locale={locale} />
        </>
    );
}

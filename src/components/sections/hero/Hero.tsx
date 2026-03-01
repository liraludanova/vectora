"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import HeroStats from "./HeroStats";
import HeroVisual from "./HeroVisual";
import { withLocale } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

type Locale = "ua" | "en";
type Props = { locale: Locale };

const copy: Record<
    Locale,
    {
        pill: string;
        title1: string;
        titleAccent1: string;
        title2: string;
        titleAccent2: string;
        title3: string;
        subtitle: string;
        ctaPrimary: string;
        ctaSecondary: string;
        bullets: [string, string, string, string];
    }
> = {
    ua: {
        pill: "Допомагаємо малому бізнесу отримувати більше заявок онлайн",

        title1: "Сайт, який реально",
        titleAccent1: "приводить клієнтів",
        title2: "і працює",
        titleAccent2: "на ваш прибуток",
        title3: ".",

        subtitle:
            "Прибираємо технічні проблеми, підвищуємо видимість у Google, налаштовуємо аналітику та автоматизуємо заявки. Менше втрат, менше хаосу — більше передбачуваних звернень.",

        ctaPrimary: "Отримати безкоштовний міні-аудит",
        ctaSecondary: "Переглянути послуги",

        bullets: [
            "Сайт відкривається швидко — клієнти не йдуть до конкурентів",
            "Google бачить вас краще — зростає органічний трафік",
            "Заявки автоматично потрапляють у CRM / Telegram / пошту",
            "Зрозумілий звіт: що змінилося і як це вплинуло на результат",
        ],
    },

    en: {
        pill: "Helping small businesses generate more leads online",

        title1: "A website that actually",
        titleAccent1: "brings customers",
        title2: "and works",
        titleAccent2: "for your profit",
        title3: ".",

        subtitle:
            "We fix technical issues, improve Google visibility, set up analytics, and automate lead flow. Fewer losses, less chaos — more predictable inquiries.",

        ctaPrimary: "Get a free mini audit",
        ctaSecondary: "View services",

        bullets: [
            "Fast loading site — fewer visitors leave",
            "Better Google visibility — more organic traffic",
            "Leads automatically go to CRM / Telegram / email",
            "Clear report: what changed and how it improved results",
        ],
    },
};

export default function Hero({ locale }: Props) {
    const t = copy[locale];
    const reduceMotion = useReducedMotion();

    const enterY = reduceMotion ? 0 : 20;

    return (
        <section className="relative overflow-hidden">
            {/* Background gradients */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-[-260px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
                <div className="absolute right-[-240px] top-[120px] h-[520px] w-[520px] rounded-full bg-purple-600/20 blur-3xl" />
                <div className="absolute bottom-[-260px] left-[-260px] h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-3xl" />
            </div>

            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:gap-14 lg:py-24">
                    {/* Left content */}
                    <div className="space-y-8">
                        <motion.div
                            initial={
                                reduceMotion ? false : { opacity: 0, y: enterY }
                            }
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur"
                        >
                            <span className="h-2 w-2 rounded-full bg-green-400" />
                            {t.pill}
                        </motion.div>

                        <motion.h1
                            initial={
                                reduceMotion ? false : { opacity: 0, y: enterY }
                            }
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, delay: 0.05 }}
                            className="text-balance text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
                        >
                            {t.title1}{" "}
                            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                                {t.titleAccent1}
                            </span>
                            <br />
                            {t.title2}{" "}
                            <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                                {t.titleAccent2}
                            </span>
                            {t.title3}
                        </motion.h1>

                        <motion.p
                            initial={
                                reduceMotion ? false : { opacity: 0, y: enterY }
                            }
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
                        >
                            {t.subtitle}
                        </motion.p>

                        <motion.div
                            initial={
                                reduceMotion ? false : { opacity: 0, y: 10 }
                            }
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex flex-col gap-3 sm:flex-row sm:items-center"
                        >
                            <Link
                                href={withLocale(locale, "/demo/audit")}
                                onClick={() =>
                                    trackEvent("cta_click", {
                                        locale,
                                        location: "hero",
                                        cta: "mini_audit",
                                        to: `/${locale}/demo/audit`,
                                    })
                                }
                                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                            >
                                {t.ctaPrimary}
                            </Link>

                            <Link
                                href={withLocale(locale, "/services")}
                                onClick={() =>
                                    trackEvent("cta_click", {
                                        locale,
                                        location: "hero",
                                        cta: "services",
                                        to: `/${locale}/services`,
                                    })
                                }
                                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
                            >
                                {t.ctaSecondary}
                            </Link>
                        </motion.div>

                        <motion.ul
                            initial={reduceMotion ? false : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="grid gap-3 text-sm text-white/70 sm:grid-cols-2"
                        >
                            {t.bullets.map((item, idx) => (
                                <li
                                    key={item}
                                    className="flex items-start gap-2"
                                    onClick={() =>
                                        trackEvent("demo_interaction", {
                                            locale,
                                            location: "hero_bullets",
                                            index: idx + 1,
                                        })
                                    }
                                >
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-300/80" />
                                    {item}
                                </li>
                            ))}
                        </motion.ul>

                        <HeroStats />
                    </div>

                    {/* Right visual */}
                    <HeroVisual />
                </div>
            </div>
        </section>
    );
}

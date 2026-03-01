"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/utils";
import Section from "@/components/ui/Section";

type Props = { locale: Locale };

const copy = {
    ua: {
        title: "Хочеш швидко зрозуміти, що саме «тече» у твоєму сайті?",
        subtitle:
            "Запусти міні-аудит: отримаєш список вузьких місць і пріоритети, що дають найбільший ефект.",
        cta: "Запустити міні-аудит",
    },
    en: {
        title: "Want to quickly see what’s leaking leads on your website?",
        subtitle:
            "Run a mini audit: get bottlenecks + prioritized fixes with the highest impact.",
        cta: "Run a mini audit",
    },
} as const;

export default function FinalCTA({ locale }: Props) {
    const t = copy[locale];

    return (
        <Section variant="muted" className="overflow-hidden">
            <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-10">
                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
                <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />

                <motion.h2
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5 }}
                    className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl"
                >
                    {t.title}
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.55, delay: 0.05 }}
                    className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-white/70 sm:text-base"
                >
                    {t.subtitle}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.45, delay: 0.1 }}
                    className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
                >
                    <Link
                        href={withLocale(locale, "/demo/audit")}
                        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                    >
                        {t.cta}
                    </Link>

                    <Link
                        href={withLocale(locale, "/contact")}
                        className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
                    >
                        {locale === "en" ? "Ask a question" : "Задати питання"}
                    </Link>
                </motion.div>
            </div>
        </Section>
    );
}

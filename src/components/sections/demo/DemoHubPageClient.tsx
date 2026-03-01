"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import Section from "@/components/ui/Section";
import Heading from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { withLocale, cx } from "@/lib/utils";

type Props = { locale: Locale };

const copy = {
    ua: {
        kicker: "Демо-інструменти",
        title: "Подивіться наш підхід на живих демо — без складних термінів",
        subtitle:
            "Це короткі інтерактивні приклади, які показують головне: що саме ми зробимо і який результат ви отримаєте. Ідеально для власників малого бізнесу.",
        cards: [
            {
                title: "Міні-аудит сайту",
                desc: "Покаже 3–5 найсильніших точок росту: швидкість, SEO-основа, конверсія та «де губляться заявки».",
                href: "/demo/audit",
                cta: "Запустити міні-аудит",
                bullets: [
                    "Зрозумілою мовою",
                    "Результат + next steps",
                    "Без «води»",
                ],
            },
            {
                title: "Автоматизація заявок",
                desc: "Як зробити так, щоб заявки не губилися: форма → Telegram/CRM → статуси → нагадування → контроль.",
                href: "/demo/automation",
                cta: "Подивитись сценарій",
                bullets: [
                    "Менше втрат",
                    "Швидше відповідь",
                    "Контроль для власника",
                ],
            },
            {
                title: "AI-агент",
                desc: "Демо-діалог: ставить уточнення, відсіює спам, готує короткий бриф менеджеру і підказує наступний крок.",
                href: "/demo/ai-agent",
                cta: "Відкрити демо",
                bullets: [
                    "Менше рутини",
                    "Краще якість лідів",
                    "Прозорий сценарій",
                ],
            },
        ],
        noteTitle: "Що ви отримаєте після демо",
        noteItems: [
            "Чітке розуміння, що робити в першу чергу (і чому).",
            "Формат результату: звіт/план/схема процесу.",
            "Без «технічної лекції» — тільки те, що впливає на заявки та витрати.",
        ],
        ctaTitle: "Хочете — зробимо так само під ваш бізнес",
        ctaSubtitle:
            "Почнемо з міні-аудиту, а потім (за потреби) підключимо автоматизації та AI без хаосу у впровадженні.",
        ctaPrimary: "Запустити міні-аудит",
        ctaSecondary: "Написати нам",
    },
    en: {
        kicker: "Demo tools",
        title: "See our approach on live demos — no technical overload",
        subtitle:
            "Short interactive examples that show the core: what we do and what outcome you’ll get. Built for SMB owners.",
        cards: [
            {
                title: "Website mini audit",
                desc: "Highlights 3–5 strongest growth levers: speed, SEO foundations, conversion and where leads drop off.",
                href: "/demo/audit",
                cta: "Run mini audit",
                bullets: ["Plain language", "Outcome + next steps", "No fluff"],
            },
            {
                title: "Lead automation",
                desc: "How to stop losing leads: form → Telegram/CRM → statuses → reminders → control.",
                href: "/demo/automation",
                cta: "View scenario",
                bullets: [
                    "Less loss",
                    "Faster replies",
                    "Owner-friendly control",
                ],
            },
            {
                title: "AI agent",
                desc: "Demo chat: clarifies needs, filters spam, drafts a manager brief and suggests the next step.",
                href: "/demo/ai-agent",
                cta: "Open demo",
                bullets: [
                    "Less routine",
                    "Higher lead quality",
                    "Transparent flow",
                ],
            },
        ],
        noteTitle: "What you get after the demo",
        noteItems: [
            "A clear priority list (what to do first and why).",
            "An outcome format: report / plan / workflow map.",
            "No technical lecture — only what impacts leads and costs.",
        ],
        ctaTitle: "Want this for your business?",
        ctaSubtitle:
            "Start with a mini audit, then add automation and AI (only if it makes sense) — without implementation chaos.",
        ctaPrimary: "Run mini audit",
        ctaSecondary: "Contact us",
    },
} as const;

const fade = {
    hidden: { opacity: 0, y: 14 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, delay: 0.06 * i },
    }),
};

export default function DemoHubPageClient({ locale }: Props) {
    const t = copy[locale];
    const reduceMotion = useReducedMotion();

    return (
        <main className="min-h-dvh">
            <Section>
                <Heading
                    kicker={t.kicker}
                    title={t.title}
                    subtitle={t.subtitle}
                />
            </Section>

            <Section variant="muted">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {t.cards.map((c, i) => (
                        <motion.div
                            key={c.title}
                            variants={reduceMotion ? undefined : fade}
                            initial={reduceMotion ? undefined : "hidden"}
                            whileInView={reduceMotion ? undefined : "show"}
                            viewport={
                                reduceMotion
                                    ? undefined
                                    : { once: true, amount: 0.2 }
                            }
                            custom={i}
                        >
                            <Card className="h-full p-6">
                                <h3 className="text-base font-semibold text-white">
                                    {c.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-white/70">
                                    {c.desc}
                                </p>

                                <ul className="mt-4 space-y-2 text-sm text-white/70">
                                    {c.bullets.map((b) => (
                                        <li
                                            key={b}
                                            className="flex items-start gap-2"
                                        >
                                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-300/80" />
                                            <span>{b}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-5">
                                    <Link
                                        href={withLocale(locale, c.href)}
                                        className={cx(
                                            "inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold",
                                            "bg-blue-600 text-white shadow-lg shadow-blue-600/20",
                                            "transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/60",
                                        )}
                                    >
                                        {c.cta}
                                    </Link>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 grid gap-4 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                        <Card className="p-6">
                            <p className="text-sm font-semibold text-white/90">
                                {t.noteTitle}
                            </p>
                            <ul className="mt-3 space-y-2 text-sm text-white/70">
                                {t.noteItems.map((x) => (
                                    <li
                                        key={x}
                                        className="flex items-start gap-2"
                                    >
                                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-green-300/80" />
                                        <span>{x}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                            <p className="text-base font-semibold text-white">
                                {t.ctaTitle}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-white/70">
                                {t.ctaSubtitle}
                            </p>

                            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={withLocale(locale, "/demo/audit")}
                                    className={cx(
                                        "inline-flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold",
                                        "bg-blue-600 text-white shadow-lg shadow-blue-600/20",
                                        "transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/60",
                                    )}
                                >
                                    {t.ctaPrimary}
                                </Link>
                                <Link
                                    href={withLocale(locale, "/contact")}
                                    className={cx(
                                        "inline-flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold",
                                        "border border-white/15 bg-white/5 text-white/90 backdrop-blur",
                                        "transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30",
                                    )}
                                >
                                    {t.ctaSecondary}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
        </main>
    );
}

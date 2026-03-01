"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import Section from "@/components/ui/Section";
import Heading from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { withLocale, cx } from "@/lib/utils";

type Props = { locale: Locale };

const copy = {
    ua: {
        kicker: "Інтеграції",
        title: "Підключаємо AI та автоматизації туди, де у вас реально живуть заявки",
        subtitle:
            "Збираємо процес під вас: заявка → уточнення → передача менеджеру → статуси → контроль → звітність.",
        items: [
            {
                title: "Telegram",
                desc: "Нотифікації, бот-форма, швидка реакція команди.",
            },
            {
                title: "Email",
                desc: "Автовідповіді, алерти, ланцюжки follow-up.",
            },
            {
                title: "Google Sheets",
                desc: "Швидкий старт без CRM: таблиця як база заявок.",
            },
            { title: "CRM", desc: "Ліди, стадії, задачі, SLA, відповідальні." },
            {
                title: "Looker Studio",
                desc: "Дашборди: заявки, джерела, конверсії, витрати.",
            },
            {
                title: "Форми сайту",
                desc: "Маркування, дедуплікація, антиспам, маршрутизація.",
            },
        ],
        ctaTitle: "Хочете подивитися демо прямо зараз?",
        ctaSubtitle:
            "Запустіть AI-агента або демо-аудит — і ми покажемо, як виглядає логіка, інтеграції та результат.",
        ctaPrimary: "Демо AI-агента",
        ctaSecondary: "Демо-аудит",
    },
    en: {
        kicker: "Integrations",
        title: "We connect AI and automations where your leads actually live",
        subtitle:
            "We tailor the workflow: lead → clarification → manager handoff → statuses → QA → reporting.",
        items: [
            {
                title: "Telegram",
                desc: "Notifications, bot form, faster team response.",
            },
            {
                title: "Email",
                desc: "Auto replies, alerts, follow-up sequences.",
            },
            {
                title: "Google Sheets",
                desc: "Fast start without CRM: Sheets as a lead base.",
            },
            { title: "CRM", desc: "Leads, stages, tasks, SLA, assignments." },
            {
                title: "Looker Studio",
                desc: "Dashboards: leads, sources, conversion, spend.",
            },
            {
                title: "Website forms",
                desc: "Tagging, dedup, anti-spam and routing.",
            },
        ],
        ctaTitle: "Want to see the demo now?",
        ctaSubtitle:
            "Run the AI agent or the demo audit — we’ll show the logic, integrations, and outcomes.",
        ctaPrimary: "AI agent demo",
        ctaSecondary: "Demo audit",
    },
} as const;

const fade = {
    hidden: { opacity: 0, y: 12 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, delay: 0.05 * i },
    }),
};

export default function IntegrationsGrid({ locale }: Props) {
    const t = copy[locale];
    const reduceMotion = useReducedMotion();

    return (
        <Section id="ai-integrations">
            <Heading kicker={t.kicker} title={t.title} subtitle={t.subtitle} />

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {t.items.map((it, i) => (
                    <motion.div
                        key={it.title}
                        variants={reduceMotion ? undefined : fade}
                        initial={reduceMotion ? undefined : "hidden"}
                        whileInView={reduceMotion ? undefined : "show"}
                        viewport={
                            reduceMotion
                                ? undefined
                                : { once: true, amount: 0.25 }
                        }
                        custom={i}
                    >
                        <Card className="h-full p-5">
                            <p className="text-base font-semibold text-white">
                                {it.title}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-white/70">
                                {it.desc}
                            </p>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10">
                <p className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    {t.ctaTitle}
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
                    {t.ctaSubtitle}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                        href={withLocale(locale, "/demo/ai-agent")}
                        className={cx(
                            "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold",
                            "bg-blue-600 text-white shadow-lg shadow-blue-600/20",
                            "transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/60",
                        )}
                    >
                        {t.ctaPrimary}
                    </Link>
                    <Link
                        href={withLocale(locale, "/demo/audit")}
                        className={cx(
                            "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold",
                            "border border-white/15 bg-white/5 text-white/90 backdrop-blur",
                            "transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30",
                        )}
                    >
                        {t.ctaSecondary}
                    </Link>
                </div>
            </div>
        </Section>
    );
}

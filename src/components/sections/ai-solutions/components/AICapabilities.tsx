"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import Section from "@/components/ui/Section";
import Heading from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";

type Props = { locale: Locale };

const copy = {
    ua: {
        kicker: "Можливості",
        title: "Що може включати AI-рішення (від простого старту до системи)",
        subtitle:
            "Починаємо з того, що дає користь швидко: відповіді, первинні питання, маршрутизація заявок. Далі додаємо аналітику та контроль якості.",
        items: [
            {
                title: "AI-помічник на сайті",
                desc: "Відповідає на часті питання, збирає контакти, передає менеджеру коли потрібно.",
            },
            {
                title: "Кваліфікація та фільтрація",
                desc: "Відсіває спам, збирає ключові деталі, допомагає менеджеру почати розмову правильно.",
            },
            {
                title: "Акуратні follow-up",
                desc: "Нагадування клієнту без нав’язливості — щоб не втрачати теплі заявки.",
            },
            {
                title: "Контроль якості комунікацій",
                desc: "Підсвічує ризики: грубий тон, пропущені питання, слабкий CTA, затримки.",
            },
            {
                title: "Дашборд інсайтів",
                desc: "Топ-питання, де “зриваються” клієнти, навантаження на менеджерів, конверсії по темах.",
            },
            {
                title: "Гібридний режим",
                desc: "AI допомагає, але важливі рішення лишаються за людиною — так зростає довіра.",
            },
        ],
    },
    en: {
        kicker: "Capabilities",
        title: "What an AI solution can include (from quick start to a system)",
        subtitle:
            "We start with quick value: replies, initial questions, lead routing. Then add analytics and quality control.",
        items: [
            {
                title: "Website AI assistant",
                desc: "Answers FAQs, captures leads, and hands off to a manager when needed.",
            },
            {
                title: "Qualification & filtering",
                desc: "Filters spam, collects key details, and helps managers start conversations right.",
            },
            {
                title: "Polite follow-ups",
                desc: "Gentle reminders to avoid losing warm leads — without pressure.",
            },
            {
                title: "Communication quality control",
                desc: "Flags risks: tone issues, missed questions, weak CTA, slow response.",
            },
            {
                title: "Insights dashboard",
                desc: "Top questions, drop-off points, manager load, and conversions by topic.",
            },
            {
                title: "Hybrid mode",
                desc: "AI assists, humans stay in control — trust goes up.",
            },
        ],
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

export default function AICapabilities({ locale }: Props) {
    const t = copy[locale];
    const reduceMotion = useReducedMotion();

    return (
        <Section id="ai-capabilities">
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
        </Section>
    );
}

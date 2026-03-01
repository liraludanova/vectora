"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import Section from "@/components/ui/Section";
import Heading from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { cx } from "@/lib/utils";

type Props = { locale: Locale };

const copy = {
    ua: {
        kicker: "Як це влаштовано",
        title: "AI-помічник — це не “чарівний чат”, а керована система",
        subtitle:
            "Ми робимо так, щоб AI працював передбачувано: знав потрібну інформацію, відповідав у вашому стилі, умів передати людині й залишав прозорі логи.",
        steps: [
            {
                title: "1) Канали звернень",
                desc: "Сайт, форма, Telegram, email, рекламні сторінки.",
            },
            {
                title: "2) Знання про бізнес",
                desc: "Послуги, ціни/діапазони, географія, правила, тон спілкування.",
            },
            {
                title: "3) Уточнення та кваліфікація",
                desc: "Кілька правильних питань → розуміння задачі → пріоритет/термін.",
            },
            {
                title: "4) Передача людині",
                desc: "Коли треба — передає менеджеру діалог + короткий підсумок + наступний крок.",
            },
            {
                title: "5) Інтеграції процесу",
                desc: "CRM/Sheets/Notion/Telegram/Email + статуси + задачі + нагадування.",
            },
            {
                title: "6) Контроль якості",
                desc: "Логи, причини відмов, перевірка тону та сценаріїв, покращення на основі даних.",
            },
        ],
        badges: ["Контрольований тон", "Логи", "Безпека", "Передача людині"],
    },
    en: {
        kicker: "How it’s built",
        title: "An AI assistant is not “magic chat” — it’s a controlled system",
        subtitle:
            "We make AI predictable: it knows the right info, speaks in your tone, can hand off to a human, and keeps transparent logs.",
        steps: [
            {
                title: "1) Input channels",
                desc: "Website, forms, Telegram, email, landing pages.",
            },
            {
                title: "2) Business knowledge",
                desc: "Services, price ranges, geo, rules, and tone of voice.",
            },
            {
                title: "3) Clarification & qualification",
                desc: "A few right questions → clear request → priority/timeline.",
            },
            {
                title: "4) Human handoff",
                desc: "When needed: hand off the dialog + summary + recommended next step.",
            },
            {
                title: "5) Workflow integrations",
                desc: "CRM/Sheets/Notion/Telegram/Email + statuses + tasks + reminders.",
            },
            {
                title: "6) Quality control",
                desc: "Logs, drop-off reasons, tone checks, scenario improvements based on data.",
            },
        ],
        badges: ["Controlled tone", "Logs", "Safety", "Human handoff"],
    },
} as const;

const fade = {
    hidden: { opacity: 0, y: 12 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, delay: 0.06 * i },
    }),
};

export default function AgentBlueprint({ locale }: Props) {
    const t = copy[locale];
    const reduceMotion = useReducedMotion();

    return (
        <Section variant="muted" id="ai-blueprint">
            <div className="flex flex-col gap-10">
                <div>
                    <Heading
                        kicker={t.kicker}
                        title={t.title}
                        subtitle={t.subtitle}
                    />
                    <div className="mt-4 flex flex-wrap gap-2">
                        {t.badges.map((b) => (
                            <Badge key={b}>{b}</Badge>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {t.steps.map((s, i) => (
                        <motion.div
                            key={s.title}
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
                            <Card
                                className={cx(
                                    "h-full p-5",
                                    i === 3 ? "ring-1 ring-blue-500/30" : "",
                                )}
                            >
                                <p className="text-base font-semibold text-white">
                                    {s.title}
                                </p>
                                <p className="mt-2 text-sm leading-relaxed text-white/70">
                                    {s.desc}
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    );
}

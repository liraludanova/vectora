"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import Section from "@/components/ui/Section";
import Heading from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";

type Props = { locale: Locale };

const copy: Record<
    Locale,
    {
        kicker: string;
        title: string;
        subtitle: string;
        items: Array<{
            pain: string;
            fix: string;
            outcome: string;
        }>;
    }
> = {
    ua: {
        kicker: "Типові проблеми",
        title: "Ось що найчастіше “з’їдає” заявки у малого бізнесу",
        subtitle:
            "Якщо ви впізнали 2–3 пункти — у вас майже точно є швидкі точки росту. Ми виправляємо це без зайвої складності.",
        items: [
            {
                pain: "Сайт повільний — клієнти закривають сторінку",
                fix: "Оптимізуємо швидкість і зручність (без редизайну “з нуля”)",
                outcome: "Менше відмов → більше дзвінків і заявок",
            },
            {
                pain: "Google показує конкурентів вище",
                fix: "Наводимо порядок у SEO-основі та структурі сторінок",
                outcome: "Краща видимість → більше органічних звернень",
            },
            {
                pain: "Незрозуміло, що дає реклама",
                fix: "Налаштовуємо конверсії та просту аналітику для власника",
                outcome: "Менше зливу бюджету → контроль вартості заявки",
            },
            {
                pain: "Заявки губляться або відповідають занадто пізно",
                fix: "Автоматизуємо: форма → CRM/Telegram/пошта + нагадування",
                outcome: "Швидша реакція → більше закритих продажів",
            },
            {
                pain: "Менеджери тонуть у рутині",
                fix: "Підключаємо сценарії та AI-помічника для типових задач",
                outcome: "Менше рутини → більше часу на продажі",
            },
            {
                pain: "Немає плану, що робити далі",
                fix: "Фіксуємо roadmap на 30–90 днів з пріоритетами",
                outcome: "Системний ріст → стабільні покращення щомісяця",
            },
        ],
    },
    en: {
        kicker: "Common blockers",
        title: "What most often “eats” leads for small businesses",
        subtitle:
            "If you recognize 2–3 items — you likely have quick growth opportunities. We fix them without unnecessary complexity.",
        items: [
            {
                pain: "Slow site — visitors leave",
                fix: "Improve speed and usability (no full rebuild required)",
                outcome: "Lower bounce → more calls and inquiries",
            },
            {
                pain: "Competitors rank higher on Google",
                fix: "Build solid SEO foundations and page structure",
                outcome: "Better visibility → more organic inquiries",
            },
            {
                pain: "Unclear ad performance",
                fix: "Set up conversions and owner-friendly analytics",
                outcome: "Less wasted spend → controlled cost per lead",
            },
            {
                pain: "Leads get lost or replies are too slow",
                fix: "Automate: form → CRM/Telegram/email + reminders",
                outcome: "Faster response → more closed deals",
            },
            {
                pain: "Team overloaded with routine work",
                fix: "Add workflows and AI support for repetitive tasks",
                outcome: "Less routine → more time for sales",
            },
            {
                pain: "No clear next steps",
                fix: "Create a 30–90 day roadmap with priorities",
                outcome: "System growth → steady monthly improvements",
            },
        ],
    },
};

const fade = {
    hidden: { opacity: 0, y: 14 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, delay: 0.05 * i },
    }),
};

export default function ProblemsSection({ locale }: Props) {
    const t = copy[locale];
    const reduceMotion = useReducedMotion();

    return (
        <Section id="problems">
            <Heading kicker={t.kicker} title={t.title} subtitle={t.subtitle} />

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {t.items.map((x, i) => (
                    <motion.div
                        key={x.pain}
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
                        <Card className="h-full p-5">
                            <div className="flex h-full flex-col gap-3">
                                <p className="text-sm font-semibold text-white">
                                    {x.pain}
                                </p>

                                <p className="text-sm leading-relaxed text-white/70">
                                    <span className="font-semibold text-white/80">
                                        {locale === "ua"
                                            ? "Рішення: "
                                            : "Fix: "}
                                    </span>
                                    {x.fix}
                                </p>

                                <div className="mt-auto rounded-xl border border-white/10 bg-white/[0.03] p-3">
                                    <p className="text-xs leading-relaxed text-white/75">
                                        <span className="font-semibold text-white/85">
                                            {locale === "ua"
                                                ? "Результат: "
                                                : "Outcome: "}
                                        </span>
                                        {x.outcome}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </Section>
    );
}

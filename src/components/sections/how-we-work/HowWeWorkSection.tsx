"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import Section from "@/components/ui/Section";
import Heading from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { cx } from "@/lib/utils";

type Props = { locale: Locale };

const copy: Record<
    Locale,
    {
        kicker: string;
        title: string;
        subtitle: string;
        steps: Array<{
            n: string;
            title: string;
            desc: string;
            deliverable: string;
        }>;
    }
> = {
    ua: {
        kicker: "Як ми працюємо",
        title: "4 кроки — і ви чітко розумієте, що покращує прибуток",
        subtitle:
            "Без складних термінів і “розмитих обіцянок”. Узгоджуємо план, впроваджуємо, показуємо цифри, фіксуємо наступні кроки.",
        steps: [
            {
                n: "01",
                title: "Міні-аудит і короткий план",
                desc: "Знаходимо, де сайт втрачає клієнтів: швидкість, SEO, форми, аналітика. Пояснюємо людською мовою.",
                deliverable:
                    "Ви отримуєте: список пріоритетних правок + прогноз, що дасть найбільший ефект.",
            },
            {
                n: "02",
                title: "Швидкі “перемоги” за 3–7 днів",
                desc: "Робимо перші зміни, які швидко покращують відгук сайту та конверсію (без переробки всього з нуля).",
                deliverable:
                    "Ви отримуєте: помітне прискорення + менше відмов + перші вимірювані покращення.",
            },
            {
                n: "03",
                title: "Аналітика та контроль заявок",
                desc: "Налаштовуємо події й конверсії, щоб ви бачили, звідки приходять заявки і скільки коштує кожна.",
                deliverable:
                    "Ви отримуєте: зрозумілі цифри + простий дашборд/звіт для власника бізнесу.",
            },
            {
                n: "04",
                title: "Автоматизація і стабільний ріст",
                desc: "Заявки не губляться: форма → CRM/Telegram/пошта. Додаємо правила, теги, антиспам і сценарії обробки.",
                deliverable:
                    "Ви отримуєте: налаштований процес + план росту на 30–90 днів.",
            },
        ],
    },
    en: {
        kicker: "How we work",
        title: "4 steps — and you clearly see what improves revenue",
        subtitle:
            "No tech overload and no vague promises. We align a plan, implement improvements, show numbers, and define next steps.",
        steps: [
            {
                n: "01",
                title: "Mini audit & a short plan",
                desc: "We find where your site loses customers: speed, SEO, forms, analytics — explained in plain language.",
                deliverable:
                    "You get: a prioritized fix list + a clear “what moves the needle” plan.",
            },
            {
                n: "02",
                title: "Quick wins in 3–7 days",
                desc: "We implement the first improvements that quickly boost experience and conversions (no full rebuild).",
                deliverable:
                    "You get: faster site + lower bounce + first measurable improvements.",
            },
            {
                n: "03",
                title: "Analytics & lead control",
                desc: "We set up events and conversions so you can see where leads come from and what each lead costs.",
                deliverable:
                    "You get: clear numbers + a simple dashboard/report for business owners.",
            },
            {
                n: "04",
                title: "Automation & steady growth",
                desc: "No lost leads: form → CRM/Telegram/email. We add rules, tags, anti-spam, and processing scenarios.",
                deliverable:
                    "You get: automated workflow + a 30–90 day growth roadmap.",
            },
        ],
    },
};

const fade = {
    hidden: { opacity: 0, y: 14 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, delay: 0.06 * i },
    }),
};

export default function HowWeWorkSection({ locale }: Props) {
    const t = copy[locale];
    const reduceMotion = useReducedMotion();

    return (
        <Section id="how-we-work" variant="muted">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
                <div className="lg:col-span-5">
                    <Heading
                        kicker={t.kicker}
                        title={t.title}
                        subtitle={t.subtitle}
                    />
                </div>

                <div className="lg:col-span-7">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {t.steps.map((s, i) => (
                            <motion.div
                                key={s.n}
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
                                    <div className="flex h-full flex-col gap-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <span className="rounded-xl border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold text-white/75">
                                                {s.n}
                                            </span>
                                            <span
                                                className={cx(
                                                    "rounded-full border border-white/15 bg-white/5 px-2.5 py-1",
                                                    "text-xs text-white/70",
                                                )}
                                            >
                                                {locale === "ua"
                                                    ? "Крок"
                                                    : "Step"}
                                            </span>
                                        </div>

                                        <h3 className="text-base font-semibold text-white">
                                            {s.title}
                                        </h3>

                                        <p className="text-sm leading-relaxed text-white/70">
                                            {s.desc}
                                        </p>

                                        <div className="mt-auto rounded-xl border border-white/10 bg-white/[0.03] p-3">
                                            <p className="text-xs leading-relaxed text-white/75">
                                                <span className="font-semibold text-white/85">
                                                    {locale === "ua"
                                                        ? "На виході: "
                                                        : "Deliverable: "}
                                                </span>
                                                {s.deliverable}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </Section>
    );
}

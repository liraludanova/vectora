"use client";

import { motion } from "framer-motion";
import Section from "@/components/ui/Section";
import Heading from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";

type Locale = "ua" | "en";
type Props = { locale: Locale };

const copy = {
    ua: {
        kicker: "Швидкий діагноз",
        title: "Чому сайт і процеси не приносять стабільних заявок",
        subtitle:
            "Малий і середній бізнес часто втрачає гроші не через «поганий маркетинг», а через дрібні технічні й процесні розриви. Ми знаходимо їх і закриваємо системно.",
        items: [
            {
                title: "Повільний сайт",
                desc: "Клієнт не чекає. Якщо сторінка «думає» — заявки йдуть конкурентам.",
                metric: "−20–40% конверсії",
            },
            {
                title: "Немає прозорої аналітики",
                desc: "Ви платите за рекламу, але не бачите, що реально працює.",
                metric: "ROMI «наосліп»",
            },
            {
                title: "Заявки губляться",
                desc: "Менеджери відповідають із запізненням або забувають. Клієнт уже охолов.",
                metric: "1–3 години до відповіді",
            },
            {
                title: "Ручні рутини",
                desc: "Таблиці, пересилки, «копі-паст». Це з’їдає час і робить помилки неминучими.",
                metric: "10+ год/тиждень",
            },
            {
                title: "Немає системи повторних продажів",
                desc: "Клієнти пішли — і все. Без CRM/нагадувань/сегментації повернення майже нуль.",
                metric: "LTV не росте",
            },
            {
                title: "Сайт не «продає»",
                desc: "Незрозумілий офер, слабкі CTA, немає довіри (кейси, докази, гарантії).",
                metric: "CTR і заявки нижче норми",
            },
        ],
    },
    en: {
        kicker: "Quick diagnosis",
        title: "Why your website and workflows don’t produce steady leads",
        subtitle:
            "SMBs lose money not because of “bad marketing” but because of small technical and process gaps. We find them and fix them systematically.",
        items: [
            {
                title: "Slow website",
                desc: "Users don’t wait. Slow pages leak leads to competitors.",
                metric: "−20–40% conversion",
            },
            {
                title: "No clear analytics",
                desc: "You pay for ads but can’t see what truly works.",
                metric: "ROMI in the dark",
            },
            {
                title: "Leads get lost",
                desc: "Replies are late or forgotten — the client cools down.",
                metric: "1–3h response time",
            },
            {
                title: "Manual routines",
                desc: "Copy-paste and spreadsheets waste time and invite errors.",
                metric: "10+ hrs/week",
            },
            {
                title: "No retention system",
                desc: "No CRM/segmentation means repeat sales stay low.",
                metric: "LTV stagnates",
            },
            {
                title: "Website doesn’t sell",
                desc: "Weak offer/CTA, low trust — no proof, no structure.",
                metric: "Low CTR & leads",
            },
        ],
    },
} as const;

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: 0.06 * i, duration: 0.45 },
    }),
};

export default function BlockersSection({ locale }: Props) {
    const t = copy[locale];

    return (
        <Section id="blockers" variant="muted">
            <div className="flex flex-col gap-10 sm:gap-12">
                <Heading
                    kicker={t.kicker}
                    title={t.title}
                    subtitle={t.subtitle}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {t.items.map((it, i) => (
                        <motion.div
                            key={it.title}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}
                            custom={i}
                        >
                            <Card className="h-full p-5">
                                <div className="flex h-full flex-col gap-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-base font-semibold text-white">
                                            {it.title}
                                        </h3>
                                        <span className="shrink-0 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white/75">
                                            {it.metric}
                                        </span>
                                    </div>
                                    <p className="text-sm leading-relaxed text-white/70">
                                        {it.desc}
                                    </p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    );
}

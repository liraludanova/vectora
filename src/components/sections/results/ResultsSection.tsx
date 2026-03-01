"use client";

import { motion } from "framer-motion";
import Section from "@/components/ui/Section";
import Heading from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import Charts from "@/components/sections/results/Charts";

type Locale = "ua" | "en";
type Props = { locale: Locale };

const copy = {
    ua: {
        kicker: "Демо-показники",
        title: "Як виглядає прогрес, коли все виміряно та автоматизовано",
        subtitle:
            "Поки без твоїх реальних кейсів — використовуємо демонстраційні дані. Вони потрібні, щоб власник бізнесу одразу зрозумів логіку: що ми міряємо і як це впливає на гроші.",
        kpis: [
            {
                label: "Швидкість сайту",
                value: "+35%",
                note: "покращення Core Web Vitals",
            },
            {
                label: "Конверсія в заявку",
                value: "+18%",
                note: "завдяки UX + CTA",
            },
            {
                label: "Час відповіді",
                value: "−70%",
                note: "бот + CRM-тригери",
            },
            {
                label: "Вартість ліда",
                value: "−22%",
                note: "через аналітику й оптимізацію",
            },
        ],
    },
    en: {
        kicker: "Demo metrics",
        title: "What progress looks like when everything is measured and automated",
        subtitle:
            "Until you have real cases — we use demo data. It helps business owners instantly grasp what we measure and how it affects revenue.",
        kpis: [
            {
                label: "Site speed",
                value: "+35%",
                note: "Core Web Vitals improvement",
            },
            {
                label: "Lead conversion",
                value: "+18%",
                note: "UX + CTA refinement",
            },
            {
                label: "Response time",
                value: "−70%",
                note: "bot + CRM triggers",
            },
            {
                label: "Cost per lead",
                value: "−22%",
                note: "analytics-driven optimization",
            },
        ],
    },
} as const;

export default function ResultsSection({ locale }: Props) {
    const t = copy[locale];

    return (
        <Section id="results" variant="muted">
            <div className="flex flex-col gap-10 sm:gap-12">
                <Heading
                    kicker={t.kicker}
                    title={t.title}
                    subtitle={t.subtitle}
                />

                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    {t.kpis.map((k, i) => (
                        <motion.div
                            key={k.label}
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ delay: 0.06 * i, duration: 0.45 }}
                        >
                            <Card className="p-5">
                                <div className="flex flex-col gap-2">
                                    <div className="text-xs text-white/60">
                                        {k.label}
                                    </div>
                                    <div className="text-2xl font-semibold text-white">
                                        {k.value}
                                    </div>
                                    <div className="text-xs leading-relaxed text-white/65">
                                        {k.note}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <Charts locale={locale} />
            </div>
        </Section>
    );
}

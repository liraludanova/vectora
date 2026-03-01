"use client";

import { motion } from "framer-motion";
import Section from "@/components/ui/Section";
import Heading from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

type Locale = "ua" | "en";
type Props = { locale: Locale };

const copy = {
    ua: {
        kicker: "Підхід Vectora Systems",
        title: "AI-інтеграції + аналітика + оптимізація = передбачуваний потік заявок",
        subtitle:
            "Ми робимо сайт і процеси «живою системою»: вимірюємо, автоматизуємо, підсилюємо рішеннями на базі AI-агентів. Без зайвої складності для власника.",
        columns: [
            {
                title: "Вимірюємо",
                badge: "GA4 + події + звіти",
                points: [
                    "повна карта конверсій",
                    "цілі, події, атрибуція",
                    "дашборди для власника",
                ],
            },
            {
                title: "Оптимізуємо",
                badge: "Speed + UX + SEO",
                points: [
                    "Core Web Vitals",
                    "структура офера й CTA",
                    "технічне SEO, schema, індексація",
                ],
            },
            {
                title: "Автоматизуємо",
                badge: "CRM + боти + інтеграції",
                points: [
                    "заявки → CRM автоматично",
                    "фільтрація/скоринг",
                    "нагадування й автоворонки",
                ],
            },
            {
                title: "Підсилюємо AI",
                badge: "AI-агенти",
                points: [
                    "відповіді 24/7",
                    "кваліфікація ліда",
                    "RAG-довідник по бізнесу (пізніше)",
                ],
            },
        ],
    },
    en: {
        kicker: "Vectora Systems approach",
        title: "AI integrations + analytics + optimization = predictable lead flow",
        subtitle:
            "We turn your website and workflows into a living system: measure, automate, and amplify with AI agents — without making it complicated for the owner.",
        columns: [
            {
                title: "Measure",
                badge: "GA4 + events + reporting",
                points: [
                    "full conversion map",
                    "goals, events, attribution",
                    "owner-friendly dashboards",
                ],
            },
            {
                title: "Optimize",
                badge: "Speed + UX + SEO",
                points: [
                    "Core Web Vitals",
                    "offer & CTA structure",
                    "tech SEO, schema, indexing",
                ],
            },
            {
                title: "Automate",
                badge: "CRM + bots + integrations",
                points: [
                    "leads → CRM automatically",
                    "filtering/scoring",
                    "reminders & workflows",
                ],
            },
            {
                title: "Enhance with AI",
                badge: "AI agents",
                points: [
                    "24/7 responses",
                    "lead qualification",
                    "RAG business knowledge base (later)",
                ],
            },
        ],
    },
} as const;

const fade = {
    hidden: { opacity: 0, y: 18 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: 0.07 * i, duration: 0.5 },
    }),
};

export default function TransformationSection({ locale }: Props) {
    const t = copy[locale];

    return (
        <Section id="transformation">
            <div className="flex flex-col gap-10 sm:gap-12">
                <Heading
                    kicker={t.kicker}
                    title={t.title}
                    subtitle={t.subtitle}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {t.columns.map((c, i) => (
                        <motion.div
                            key={c.title}
                            variants={fade}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}
                            custom={i}
                        >
                            <Card className="h-full p-6">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-lg font-semibold text-white">
                                            {c.title}
                                        </h3>
                                        <Badge>{c.badge}</Badge>
                                    </div>
                                    <ul className="flex flex-col gap-2 text-sm text-white/75">
                                        {c.points.map((p) => (
                                            <li key={p} className="flex gap-2">
                                                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />
                                                <span className="leading-relaxed">
                                                    {p}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    );
}

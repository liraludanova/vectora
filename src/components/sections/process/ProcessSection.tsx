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
        kicker: "Як ми працюємо",
        title: "Чіткий процес: від аудиту до стабільних заявок",
        subtitle:
            "Тобі важливо швидко виходити на оплату. Тому процес побудований так, щоб першу користь бізнес відчув уже в перші 7–14 днів.",
        steps: [
            {
                n: "01",
                title: "Експрес-аудит",
                desc: "Швидко перевіряємо швидкість, SEO-базу, конверсійні точки та заявки.",
                badge: "24–48 год",
            },
            {
                n: "02",
                title: "План дій + пріоритети",
                desc: "Фіксуємо 10–20 задач із прогнозом ефекту та складності (impact/effort).",
                badge: "1 день",
            },
            {
                n: "03",
                title: "Впровадження",
                desc: "Оптимізація сайту + налаштування аналітики + автоматизації заявок.",
                badge: "3–10 днів",
            },
            {
                n: "04",
                title: "AI-шар",
                desc: "Бот/агент для кваліфікації, FAQ, розумної маршрутизації звернень.",
                badge: "1–2 тижні",
            },
            {
                n: "05",
                title: "Звітність і масштабування",
                desc: "Дашборди + контроль якості лідів + план наступних ітерацій.",
                badge: "щомісяця",
            },
        ],
    },
    en: {
        kicker: "How we work",
        title: "A clear process: from audit to steady leads",
        subtitle:
            "You want paid work fast. The process is designed so the business feels value in the first 7–14 days.",
        steps: [
            {
                n: "01",
                title: "Express audit",
                desc: "Check speed, SEO basics, conversion points and lead handling.",
                badge: "24–48h",
            },
            {
                n: "02",
                title: "Action plan + priorities",
                desc: "10–20 tasks with impact/effort prioritization.",
                badge: "1 day",
            },
            {
                n: "03",
                title: "Implementation",
                desc: "Website optimization + analytics + lead automation.",
                badge: "3–10 days",
            },
            {
                n: "04",
                title: "AI layer",
                desc: "Bot/agent for qualification, FAQ, smart routing.",
                badge: "1–2 weeks",
            },
            {
                n: "05",
                title: "Reporting & scaling",
                desc: "Dashboards + lead quality control + next iterations.",
                badge: "monthly",
            },
        ],
    },
} as const;

export default function ProcessSection({ locale }: Props) {
    const t = copy[locale];

    return (
        <Section id="process">
            <div className="flex flex-col gap-10 sm:gap-12">
                <Heading
                    kicker={t.kicker}
                    title={t.title}
                    subtitle={t.subtitle}
                />

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
                    {t.steps.map((s, i) => (
                        <motion.div
                            key={s.n}
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ delay: 0.06 * i, duration: 0.45 }}
                            className="lg:col-span-1"
                        >
                            <Card className="h-full p-5">
                                <div className="flex h-full flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-semibold text-white/85">
                                            {s.n}
                                        </div>
                                        <Badge>{s.badge}</Badge>
                                    </div>
                                    <div className="text-base font-semibold text-white">
                                        {s.title}
                                    </div>
                                    <div className="text-sm leading-relaxed text-white/70">
                                        {s.desc}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    );
}

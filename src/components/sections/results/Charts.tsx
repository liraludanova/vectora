"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";

type Locale = "ua" | "en";
type Props = { locale: Locale };

const copy = {
    ua: {
        a: { title: "Воронка заявок", subtitle: "Де губляться клієнти (демо)" },
        b: {
            title: "ROMI по каналах",
            subtitle: "Порівняння ефективності (демо)",
        },
        stages: [
            { name: "Візити", value: 1000 },
            { name: "Клік CTA", value: 220 },
            { name: "Форма", value: 120 },
            { name: "Кваліфіковано", value: 70 },
            { name: "Продаж", value: 22 },
        ],
        channels: [
            { name: "Google Search", value: 2.4 },
            { name: "Maps / Local", value: 3.1 },
            { name: "Social", value: 1.6 },
            { name: "Direct", value: 2.0 },
        ],
    },
    en: {
        a: { title: "Lead funnel", subtitle: "Where users drop off (demo)" },
        b: { title: "ROMI by channel", subtitle: "Compare efficiency (demo)" },
        stages: [
            { name: "Visits", value: 1000 },
            { name: "CTA click", value: 220 },
            { name: "Form", value: 120 },
            { name: "Qualified", value: 70 },
            { name: "Sale", value: 22 },
        ],
        channels: [
            { name: "Google Search", value: 2.4 },
            { name: "Maps / Local", value: 3.1 },
            { name: "Social", value: 1.6 },
            { name: "Direct", value: 2.0 },
        ],
    },
} as const;

export default function Charts({ locale }: Props) {
    const t = copy[locale];

    const maxStage = t.stages[0]?.value ?? 1;
    const maxCh = Math.max(...t.channels.map((c) => c.value), 1);

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="p-6">
                <div className="flex flex-col gap-1">
                    <div className="text-base font-semibold text-white">
                        {t.a.title}
                    </div>
                    <div className="text-sm text-white/65">{t.a.subtitle}</div>
                </div>

                <div className="mt-5 flex flex-col gap-3">
                    {t.stages.map((s, i) => {
                        const w = Math.max(
                            6,
                            Math.round((s.value / maxStage) * 100),
                        );
                        return (
                            <div
                                key={s.name}
                                className="flex items-center gap-3"
                            >
                                <div className="w-28 text-xs text-white/70">
                                    {s.name}
                                </div>
                                <div className="flex-1">
                                    <motion.div
                                        initial={{ width: 0, opacity: 0.3 }}
                                        whileInView={{
                                            width: `${w}%`,
                                            opacity: 1,
                                        }}
                                        viewport={{ once: true, amount: 0.3 }}
                                        transition={{
                                            delay: 0.06 * i,
                                            duration: 0.55,
                                        }}
                                        className="h-2.5 rounded-full bg-white/20"
                                    >
                                        <div className="h-2.5 rounded-full bg-white/70" />
                                    </motion.div>
                                </div>
                                <div className="w-14 text-right text-xs text-white/70">
                                    {s.value}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            <Card className="p-6">
                <div className="flex flex-col gap-1">
                    <div className="text-base font-semibold text-white">
                        {t.b.title}
                    </div>
                    <div className="text-sm text-white/65">{t.b.subtitle}</div>
                </div>

                <div className="mt-5 flex flex-col gap-3">
                    {t.channels.map((c, i) => {
                        const w = Math.max(
                            8,
                            Math.round((c.value / maxCh) * 100),
                        );
                        return (
                            <div
                                key={c.name}
                                className="flex items-center gap-3"
                            >
                                <div className="w-28 text-xs text-white/70">
                                    {c.name}
                                </div>
                                <div className="flex-1">
                                    <motion.div
                                        initial={{ width: 0, opacity: 0.3 }}
                                        whileInView={{
                                            width: `${w}%`,
                                            opacity: 1,
                                        }}
                                        viewport={{ once: true, amount: 0.3 }}
                                        transition={{
                                            delay: 0.06 * i,
                                            duration: 0.55,
                                        }}
                                        className="h-2.5 rounded-full bg-white/20"
                                    >
                                        <div className="h-2.5 rounded-full bg-white/70" />
                                    </motion.div>
                                </div>
                                <div className="w-14 text-right text-xs text-white/70">
                                    {c.value.toFixed(1)}x
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
}

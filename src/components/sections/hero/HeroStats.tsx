"use client";

import { motion } from "framer-motion";

type Stat = {
    label: string;
    value: string;
    hint: string;
};

const stats: Stat[] = [
    {
        label: "Швидкість сайту",
        value: "−30–60%",
        hint: "середнє зменшення часу завантаження (демо-оцінка)",
    },
    {
        label: "Заявки/ліди",
        value: "+15–40%",
        hint: "приріст за рахунок UX + швидкості + структури",
    },
    {
        label: "Рутина менеджера",
        value: "−3–8 год/тиж",
        hint: "автоматизація розбору та маршрутизації заявок",
    },
    {
        label: "Якість лідів",
        value: "+20–50%",
        hint: "AI-скоринг та фільтрація",
    },
];

export default function HeroStats() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-8 grid gap-3 sm:grid-cols-2"
        >
            {stats.map((s) => (
                <div
                    key={s.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                    <div className="flex items-baseline justify-between gap-3">
                        <div className="text-sm font-medium text-white/85">
                            {s.label}
                        </div>
                        <div className="text-lg font-semibold text-white">
                            {s.value}
                        </div>
                    </div>
                    <div className="mt-2 text-xs leading-relaxed text-white/60">
                        {s.hint}
                    </div>
                </div>
            ))}
        </motion.div>
    );
}

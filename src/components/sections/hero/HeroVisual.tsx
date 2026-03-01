"use client";

import { motion } from "framer-motion";

export default function HeroVisual() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
        >
            {/* карточка-дашборд */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur">
                {/* декоративная сетка */}
                <div className="pointer-events-none absolute inset-0 opacity-60">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.35),transparent_55%),radial-gradient(circle_at_70%_60%,rgba(168,85,247,0.25),transparent_55%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
                </div>

                <div className="relative space-y-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <div className="text-sm font-semibold text-white/90">
                                Demo Dashboard
                            </div>
                            <div className="mt-1 text-xs text-white/60">
                                Аналітика • Оптимізація • AI-скоринг
                            </div>
                        </div>

                        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">
                            Live (demo)
                        </div>
                    </div>

                    {/* метрики */}
                    <div className="grid gap-3 sm:grid-cols-3">
                        <Metric title="Conversion" value="3.8%" delta="+0.9%" />
                        <Metric title="CPA" value="₴210" delta="−12%" />
                        <Metric title="Lead Score" value="87/100" delta="+14" />
                    </div>

                    {/* прогресс */}
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="flex items-center justify-between text-xs text-white/65">
                            <span>Оптимізація швидкості</span>
                            <span className="text-green-300">78%</span>
                        </div>

                        <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "78%" }}
                                transition={{ duration: 1.2, delay: 0.35 }}
                                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-300"
                            />
                        </div>

                        <div className="mt-3 text-[11px] leading-relaxed text-white/55">
                            Автоматичні перевірки + рекомендації. Пізніше тут
                            буде інтерактивний аудит.
                        </div>
                    </div>

                    {/* линия/график */}
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="text-xs text-white/65">
                            Тренд заявок (демо)
                        </div>
                        <div className="mt-3 h-24 w-full">
                            <svg
                                viewBox="0 0 600 140"
                                className="h-full w-full"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M10 110 C 80 100, 120 80, 170 92 C 240 110, 280 30, 360 56 C 440 84, 500 40, 590 28"
                                    stroke="rgba(255,255,255,0.18)"
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                />
                                <motion.path
                                    d="M10 110 C 80 100, 120 80, 170 92 C 240 110, 280 30, 360 56 C 440 84, 500 40, 590 28"
                                    stroke="rgba(59,130,246,0.9)"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.4, delay: 0.25 }}
                                />
                            </svg>
                        </div>
                        <div className="mt-2 text-[11px] text-white/55">
                            Ми показуємо результат цифрами: швидкість → UX →
                            конверсія → заявки.
                        </div>
                    </div>
                </div>
            </div>

            {/* плавающие бейджи */}
            <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="pointer-events-none absolute -bottom-6 left-6 hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/75 backdrop-blur sm:block"
            >
                AI-фільтрація заявок → менше спаму
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.42 }}
                className="pointer-events-none absolute -top-6 right-6 hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/75 backdrop-blur sm:block"
            >
                CRM інтеграції + Telegram алерти
            </motion.div>
        </motion.div>
    );
}

function Metric(props: { title: string; value: string; delta: string }) {
    const isPositive =
        props.delta.trim().startsWith("+") ||
        props.delta.includes("−") === false; // грубо: если нет минуса — считаем “плюс”
    return (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="text-[11px] text-white/55">{props.title}</div>
            <div className="mt-1 text-lg font-semibold text-white">
                {props.value}
            </div>
            <div
                className={`mt-1 text-xs ${isPositive ? "text-green-300" : "text-red-300"}`}
            >
                {props.delta}
            </div>
        </div>
    );
}

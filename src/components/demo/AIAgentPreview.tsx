"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import Section from "@/components/ui/Section";
import Heading from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { withLocale, cx } from "@/lib/utils";

type Props = { locale: Locale };

type ChatRole = "user" | "agent";
type ChatMsg = { id: string; role: ChatRole; text: string };

const copy = {
    ua: {
        kicker: "Демо: AI-агент для бізнесу",
        title: "Віртуальний менеджер: приймає заявки, фільтрує спам, підказує наступний крок",
        subtitle:
            "Це showcase-приклад. Агент ставить 2–4 уточнюючі питання, оцінює “якість ліда” і формує структуру відповіді/брифа. Згодом підключимо CRM/Telegram та реальні інтеграції.",
        leftTitle: "Сценарій",
        leftDesc:
            "Обери тип бізнесу й канал. Агент адаптує питання та стиль відповіді під реалії малого/середнього бізнесу України.",
        business: "Тип бізнесу",
        channel: "Канал",
        goals: "Ціль",
        genPrompt: "Згенерувати промпт для агента",
        promptTitle: "Промпт (для інтеграції)",
        chatTitle: "Діалог (демо)",
        inputPh:
            "Опиши запит клієнта… наприклад: «Потрібен сайт для доставки, хочу більше заявок»",
        send: "Надіслати",
        score: "Оцінка ліда",
        next: "Наступні кроки",
        nextItems: [
            "Підключити форму → Telegram/CRM",
            "Додати lead scoring + антиспам",
            "Побудувати дашборд по заявках і якості",
        ],
        ctaPrimary: "Запустити міні-аудит",
        ctaSecondary: "Обговорити інтеграцію",
        businesses: ["Послуги", "Інтернет-магазин", "Локальний сервіс", "B2B"],
        channels: ["Сайт-форма", "Telegram", "Instagram", "Email"],
        goalsList: [
            "Більше заявок",
            "Менше втрат лідів",
            "Швидше відповіді",
            "Автоматизація рутини",
        ],
        agentName: "Vectora Agent",
    },
    en: {
        kicker: "Demo: AI agent for SMB",
        title: "Virtual manager: captures leads, filters spam, recommends next steps",
        subtitle:
            "Showcase example. The agent asks 2–4 clarifying questions, estimates lead quality and produces a structured brief/reply. Next we’ll connect CRM/Telegram and real integrations.",
        leftTitle: "Scenario",
        leftDesc:
            "Pick business type and channel. The agent adapts questions and tone for SMB workflows.",
        business: "Business type",
        channel: "Channel",
        goals: "Goal",
        genPrompt: "Generate agent prompt",
        promptTitle: "Prompt (for integration)",
        chatTitle: "Chat (demo)",
        inputPh:
            "Describe the client request… e.g. “Need a website for delivery, want more leads”",
        send: "Send",
        score: "Lead score",
        next: "Next steps",
        nextItems: [
            "Connect form → Telegram/CRM",
            "Add lead scoring + anti-spam",
            "Build a dashboard for leads & quality",
        ],
        ctaPrimary: "Run mini audit",
        ctaSecondary: "Discuss integration",
        businesses: ["Services", "E-commerce", "Local business", "B2B"],
        channels: ["Website form", "Telegram", "Instagram", "Email"],
        goalsList: [
            "More leads",
            "Less lead loss",
            "Faster replies",
            "Automate routine",
        ],
        agentName: "Vectora Agent",
    },
} as const;

function uid() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function scoreLead(text: string) {
    const t = text.toLowerCase();
    let score = 40;

    const intentWords = [
        "ціна",
        "price",
        "термін",
        "deadline",
        "коли",
        "when",
        "бюджет",
        "budget",
        "crm",
        "інтеграц",
        "integration",
        "ga4",
        "ads",
        "seo",
        "заявк",
        "leads",
    ];
    const specifics = [
        "київ",
        "kyiv",
        "львів",
        "lviv",
        "одеса",
        "odesa",
        "україн",
        "ukraine",
        "instagram",
        "телеграм",
        "telegram",
        "магазин",
        "shop",
        "доставка",
        "delivery",
    ];

    for (const w of intentWords) if (t.includes(w)) score += 6;
    for (const w of specifics) if (t.includes(w)) score += 4;

    if (t.length > 140) score += 10;
    if (t.length < 20) score -= 10;

    return Math.max(0, Math.min(100, score));
}

function buildAgentPrompt(
    locale: Locale,
    business: string,
    channel: string,
    goal: string,
) {
    if (locale === "ua") {
        return [
            "Ти — AI-асистент агенції Vectora Systems.",
            "Мета: кваліфікувати лід і підготувати структуровану відповідь менеджеру та коротку відповідь клієнту.",
            "",
            `Контекст бізнесу: ${business}. Канал: ${channel}. Основна ціль: ${goal}.`,
            "",
            "Правила:",
            "1) Спочатку постав 2–4 короткі уточнюючі питання (бюджет/терміни/регіон/що вже є).",
            "2) Далі дай оцінку якості ліда (0–100) і поясни 2–3 причини.",
            "3) Сформуй план з 3 кроків: (A) швидкі фікси, (B) автоматизації, (C) AI-агент/асистент.",
            "4) В кінці — чіткий CTA: запропонувати міні-аудит і запросити контактні дані.",
        ].join("\n");
    }

    return [
        "You are an AI assistant for Vectora Systems agency.",
        "Goal: qualify a lead and prepare a structured internal note + a short client reply.",
        "",
        `Business context: ${business}. Channel: ${channel}. Primary goal: ${goal}.`,
        "",
        "Rules:",
        "1) Ask 2–4 short clarifying questions (budget/timeline/region/current setup).",
        "2) Provide a lead score (0–100) with 2–3 reasons.",
        "3) Propose a 3-step plan: (A) quick fixes, (B) automations, (C) AI agent/assistant.",
        "4) End with a clear CTA: offer a mini-audit and request contact details.",
    ].join("\n");
}

export default function AIAgentPreview({ locale }: Props) {
    const t = copy[locale];

    // КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: расширяем тип состояния до string
    const [business, setBusiness] = useState<string>(t.businesses[0]);
    const [channel, setChannel] = useState<string>(t.channels[0]);
    const [goal, setGoal] = useState<string>(t.goalsList[0]);

    const [prompt, setPrompt] = useState(() =>
        buildAgentPrompt(
            locale,
            t.businesses[0],
            t.channels[0],
            t.goalsList[0],
        ),
    );

    const [input, setInput] = useState("");
    const [chat, setChat] = useState<ChatMsg[]>(() => [
        {
            id: uid(),
            role: "agent",
            text:
                locale === "ua"
                    ? `Привіт! Я ${t.agentName}. Опиши коротко задачу — і я уточню деталі.`
                    : `Hi! I’m ${t.agentName}. Describe your request and I’ll ask a few clarifying questions.`,
        },
    ]);

    const leadScore = useMemo(() => {
        const lastUser = [...chat].reverse().find((m) => m.role === "user");
        return lastUser ? scoreLead(lastUser.text) : 0;
    }, [chat]);

    const scoreLabel = useMemo(() => {
        if (leadScore >= 75) return locale === "ua" ? "Гарячий" : "Hot";
        if (leadScore >= 55) return locale === "ua" ? "Теплий" : "Warm";
        return locale === "ua" ? "Холодний" : "Cold";
    }, [leadScore, locale]);

    function regeneratePrompt(
        nextBusiness: string,
        nextChannel: string,
        nextGoal: string,
    ) {
        setPrompt(
            buildAgentPrompt(locale, nextBusiness, nextChannel, nextGoal),
        );
    }

    function agentReply(userText: string) {
        const s = scoreLead(userText);

        if (locale === "ua") {
            const reasons: string[] = [];
            if (userText.length > 140)
                reasons.push("є контекст, можна точніше оцінити");
            if (/(crm|telegram|ga4|ads|seo|інтеграц)/i.test(userText))
                reasons.push("згадано конкретні інструменти/задачі");
            if (/(ціна|бюджет|термін|коли)/i.test(userText))
                reasons.push("є намір приймати рішення");

            const why = reasons.length
                ? reasons.slice(0, 3).join("; ")
                : "мало конкретики — треба уточнення";

            return [
                "Ок, зрозумів(ла). Уточню 3 речі:",
                "1) Який орієнтовний бюджет і терміни?",
                "2) Яке місто/регіон і чи працюєте по всій Україні?",
                "3) Що вже є: сайт/CRM/Telegram/Ads/GA4?",
                "",
                `Оцінка ліда: ${s}/100 (${s >= 75 ? "гарячий" : s >= 55 ? "теплий" : "холодний"}) — ${why}.`,
                "",
                "Що зробимо у 3 кроки:",
                "A) Швидкі фікси: швидкість/CWV + CTA/UX (1–3 дні)",
                "B) Автоматизації: форма → Telegram/CRM + теги/статуси + антиспам (2–5 днів)",
                "C) AI: кваліфікація лідів + шаблони відповідей + контроль якості (3–7 днів)",
                "",
                "Хочеш — запускаємо безкоштовний міні-аудит і дам 3 найсильніші точки росту під твій бізнес.",
            ].join("\n");
        }

        const reasons: string[] = [];
        if (userText.length > 140) reasons.push("good context provided");
        if (/(crm|telegram|ga4|ads|seo|integrat)/i.test(userText))
            reasons.push("mentions concrete tools/tasks");
        if (/(price|budget|deadline|when)/i.test(userText))
            reasons.push("decision intent signals");

        const why = reasons.length
            ? reasons.slice(0, 3).join("; ")
            : "not enough specifics — needs clarifying";

        return [
            "Got it. 3 quick questions:",
            "1) What’s your rough budget and timeline?",
            "2) What region/cities do you serve?",
            "3) What do you already have: website/CRM/Telegram/Ads/GA4?",
            "",
            `Lead score: ${s}/100 (${s >= 75 ? "hot" : s >= 55 ? "warm" : "cold"}) — ${why}.`,
            "",
            "3-step plan:",
            "A) Quick fixes: CWV/performance + CTA/UX (1–3 days)",
            "B) Automations: form → Telegram/CRM + tags/status + anti-spam (2–5 days)",
            "C) AI: lead qualification + reply templates + dialog QA (3–7 days)",
            "",
            "If you want — run the free mini-audit and I’ll highlight the top 3 growth levers for your case.",
        ].join("\n");
    }

    function onSend() {
        const text = input.trim();
        if (!text) return;

        setChat((prev) => [
            ...prev,
            { id: uid(), role: "user", text },
            { id: uid(), role: "agent", text: agentReply(text) },
        ]);
        setInput("");
    }

    return (
        <>
            <Section>
                <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
                    <div className="lg:col-span-7">
                        <Heading
                            kicker={t.kicker}
                            title={t.title}
                            subtitle={t.subtitle}
                        />

                        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Link
                                href={withLocale(locale, "/demo/audit")}
                                className={cx(
                                    "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold",
                                    "bg-blue-600 text-white shadow-lg shadow-blue-600/20",
                                    "transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/60",
                                )}
                            >
                                {t.ctaPrimary}
                            </Link>

                            <Link
                                href={withLocale(locale, "/contact")}
                                className={cx(
                                    "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold",
                                    "border border-white/15 bg-white/5 text-white/90 backdrop-blur",
                                    "transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30",
                                )}
                            >
                                {t.ctaSecondary}
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <Card className="p-6">
                            <p className="text-sm font-semibold text-white/90">
                                {t.leftTitle}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-white/70">
                                {t.leftDesc}
                            </p>

                            <div className="mt-5 grid gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-white/70">
                                        {t.business}
                                    </p>
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        {t.businesses.map((x) => (
                                            <button
                                                key={x}
                                                type="button"
                                                onClick={() => {
                                                    setBusiness(x);
                                                    regeneratePrompt(
                                                        x,
                                                        channel,
                                                        goal,
                                                    );
                                                }}
                                                className={cx(
                                                    "rounded-xl border px-3 py-2 text-left text-sm transition",
                                                    x === business
                                                        ? "border-blue-500/40 bg-blue-600/15 text-white"
                                                        : "border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.06]",
                                                )}
                                            >
                                                {x}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-white/70">
                                        {t.channel}
                                    </p>
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        {t.channels.map((x) => (
                                            <button
                                                key={x}
                                                type="button"
                                                onClick={() => {
                                                    setChannel(x);
                                                    regeneratePrompt(
                                                        business,
                                                        x,
                                                        goal,
                                                    );
                                                }}
                                                className={cx(
                                                    "rounded-xl border px-3 py-2 text-left text-sm transition",
                                                    x === channel
                                                        ? "border-blue-500/40 bg-blue-600/15 text-white"
                                                        : "border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.06]",
                                                )}
                                            >
                                                {x}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-white/70">
                                        {t.goals}
                                    </p>
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        {t.goalsList.map((x) => (
                                            <button
                                                key={x}
                                                type="button"
                                                onClick={() => {
                                                    setGoal(x);
                                                    regeneratePrompt(
                                                        business,
                                                        channel,
                                                        x,
                                                    );
                                                }}
                                                className={cx(
                                                    "rounded-xl border px-3 py-2 text-left text-sm transition",
                                                    x === goal
                                                        ? "border-blue-500/40 bg-blue-600/15 text-white"
                                                        : "border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.06]",
                                                )}
                                            >
                                                {x}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        regeneratePrompt(
                                            business,
                                            channel,
                                            goal,
                                        )
                                    }
                                    className={cx(
                                        "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold",
                                        "border border-white/15 bg-white/5 text-white/90 backdrop-blur",
                                        "transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30",
                                    )}
                                >
                                    {t.genPrompt}
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
            </Section>

            <Section variant="muted" id="ai-agent-demo">
                <div className="grid gap-6 lg:grid-cols-12">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.45 }}
                        className="lg:col-span-5"
                    >
                        <Card className="p-6">
                            <p className="text-sm font-semibold text-white/90">
                                {t.promptTitle}
                            </p>
                            <pre className="mt-3 whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/40 p-4 text-xs leading-relaxed text-white/75">
                                {prompt}
                            </pre>

                            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-xs font-semibold text-white/70">
                                        {t.score}
                                    </p>
                                    <span
                                        className={cx(
                                            "rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                                            leadScore >= 75
                                                ? "bg-green-500/15 text-green-200 ring-green-500/25"
                                                : leadScore >= 55
                                                  ? "bg-yellow-500/15 text-yellow-200 ring-yellow-500/25"
                                                  : "bg-white/5 text-white/75 ring-white/15",
                                        )}
                                    >
                                        {scoreLabel}: {leadScore}/100
                                    </span>
                                </div>

                                <div className="mt-4">
                                    <p className="text-xs font-semibold text-white/70">
                                        {t.next}
                                    </p>
                                    <ul className="mt-2 space-y-2 text-sm text-white/70">
                                        {t.nextItems.map((x) => (
                                            <li
                                                key={x}
                                                className="flex items-start gap-2"
                                            >
                                                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-300/80" />
                                                <span>{x}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.45, delay: 0.05 }}
                        className="lg:col-span-7"
                    >
                        <Card className="p-6">
                            <p className="text-sm font-semibold text-white/90">
                                {t.chatTitle}
                            </p>

                            <div className="mt-4 max-h-[420px] overflow-auto rounded-2xl border border-white/10 bg-black/40 p-4">
                                <div className="flex flex-col gap-3">
                                    {chat.map((m) => (
                                        <div
                                            key={m.id}
                                            className={cx(
                                                "max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                                                m.role === "agent"
                                                    ? "bg-white/[0.05] text-white/85"
                                                    : "ml-auto bg-blue-600/20 text-white",
                                            )}
                                        >
                                            <span className="whitespace-pre-wrap">
                                                {m.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") onSend();
                                    }}
                                    placeholder={t.inputPh}
                                    className={cx(
                                        "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none",
                                        "placeholder:text-white/40 focus:ring-2 focus:ring-blue-400/40",
                                    )}
                                />
                                <button
                                    type="button"
                                    onClick={onSend}
                                    className={cx(
                                        "inline-flex shrink-0 items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold",
                                        "bg-blue-600 text-white shadow-lg shadow-blue-600/20",
                                        "transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/60",
                                    )}
                                >
                                    {t.send}
                                </button>
                            </div>

                            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={withLocale(locale, "/demo/audit")}
                                    className={cx(
                                        "inline-flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold",
                                        "bg-blue-600 text-white shadow-lg shadow-blue-600/20",
                                        "transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/60",
                                    )}
                                >
                                    {t.ctaPrimary}
                                </Link>
                                <Link
                                    href={withLocale(locale, "/contact")}
                                    className={cx(
                                        "inline-flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold",
                                        "border border-white/15 bg-white/5 text-white/90 backdrop-blur",
                                        "transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30",
                                    )}
                                >
                                    {t.ctaSecondary}
                                </Link>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </Section>
        </>
    );
}

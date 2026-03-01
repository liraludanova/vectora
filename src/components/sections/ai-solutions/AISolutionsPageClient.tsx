"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import Section from "@/components/ui/Section";
import Heading from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { withLocale, cx } from "@/lib/utils";

type Props = { locale: Locale };

const copy = {
    ua: {
        heroKicker: "AI-рішення для малого бізнесу",
        heroTitle:
            "AI-помічник, який відповідає швидше, не губить заявки і знімає рутину з команди",
        heroSubtitle:
            "Не “чатик заради чатика”. Ми будуємо прості сценарії, які реально допомагають: первинні питання, підготовка заявки для менеджера, підтримка 24/7, автоматичні маршрути та контроль якості.",

        cardsTitle: "Що саме дає AI у вашому процесі",
        cardsSubtitle:
            "Головна мета — швидша реакція та менше втрат. А ще — зрозумілі дані, що заважає продажам.",

        items: [
            {
                title: "Кваліфікація заявок",
                desc: "Збирає ключові деталі, ставить уточнення і передає менеджеру короткий бриф.",
                bullets: [
                    "Питання по задачі/термінах",
                    "Короткий бриф для менеджера",
                    "Відсів спаму",
                ],
                tag: "Менше шуму",
            },
            {
                title: "FAQ + підтримка 24/7",
                desc: "Відповідає на часті питання, підказує наступний крок, при потребі передає людині.",
                bullets: [
                    "Готові сценарії",
                    "Перемикання на менеджера",
                    "Логи діалогів",
                ],
                tag: "Швидший сервіс",
            },
            {
                title: "Чернетки відповідей і follow-up",
                desc: "Допомагає формувати відповіді, комерційні та акуратні нагадування клієнту.",
                bullets: [
                    "Шаблони + персоналізація",
                    "Email/Telegram сценарії",
                    "Контроль тону",
                ],
                tag: "Менше рутини",
            },
            {
                title: "Автоматизація процесу",
                desc: "Вбудовується в ваші інструменти: заявки → статуси → задачі → нагадування.",
                bullets: ["CRM/Sheets", "Теги/статуси", "SLA-нагадування"],
                tag: "Системність",
            },
            {
                title: "Аналітика діалогів",
                desc: "Показує, де клієнти “зриваються”: які питання зупиняють продажі і що варто змінити на сайті.",
                bullets: [
                    "Теми та інтенти",
                    "Точки відмов",
                    "Ідеї для покращень",
                ],
                tag: "Покращення UX",
            },
            {
                title: "Безпека та контроль",
                desc: "Обмеження, правила, модерація та ескалація на людину — щоб AI працював без ризику.",
                bullets: [
                    "Правила відповіді",
                    "Ручна ескалація",
                    "Режим “довідка”",
                ],
                tag: "Контроль",
            },
        ],

        flowKicker: "Як впроваджуємо",
        flowTitle: "Короткий цикл: показали демо → підключили → виміряли ефект",
        flowSubtitle:
            "Спочатку показуємо на прикладі (як на цьому сайті), потім підключаємо ваші канали й лише після цього масштабуємо.",

        steps: [
            {
                title: "1) Демо-сценарій",
                desc: "Погоджуємо логіку: які питання ставити, який результат має отримати менеджер і де потрібна людина.",
            },
            {
                title: "2) Інтеграція",
                desc: "Підключаємо канали: форма → Telegram/CRM/Email, теги, статуси, антиспам, нагадування.",
            },
            {
                title: "3) Метрики",
                desc: "Вимірюємо: швидкість відповіді, якість заявок, конверсію, економію часу команди.",
            },
        ],

        ctaTitle: "Хочете подивитися, як це працює вживу?",
        ctaSubtitle:
            "Запустіть демо AI-агента або демо-аудит — і ви побачите, як виглядає процес і результат.",
        ctaPrimary: "Демо AI-агента",
        ctaSecondary: "Демо-аудит",
    },

    en: {
        heroKicker: "AI solutions for small businesses",
        heroTitle:
            "An AI assistant that replies faster, prevents lost leads, and removes routine work",
        heroSubtitle:
            "Not a “chat widget for the sake of it”. We build practical workflows: initial questions, a structured brief for managers, 24/7 FAQ support, routing and quality control.",

        cardsTitle: "What AI delivers in your workflow",
        cardsSubtitle:
            "The goal is simple: faster response and fewer losses — plus clear insights on what blocks sales.",

        items: [
            {
                title: "Lead qualification",
                desc: "Collects key details, asks clarifying questions, and sends a short brief to your manager.",
                bullets: [
                    "Questions about scope/timeline",
                    "Short manager brief",
                    "Spam filtering",
                ],
                tag: "Less noise",
            },
            {
                title: "FAQ + 24/7 support",
                desc: "Answers common questions, suggests next steps, and hands off to a human when needed.",
                bullets: ["Ready scenarios", "Human handoff", "Dialog logs"],
                tag: "Faster support",
            },
            {
                title: "Reply drafts & follow-ups",
                desc: "Helps draft replies, proposals and polite follow-ups to keep prospects warm.",
                bullets: [
                    "Templates + personalization",
                    "Email/Telegram workflows",
                    "Tone control",
                ],
                tag: "Less routine",
            },
            {
                title: "Workflow automation",
                desc: "Connects to your tools: leads → statuses → tasks → reminders.",
                bullets: ["CRM/Sheets", "Tags/statuses", "SLA reminders"],
                tag: "System approach",
            },
            {
                title: "Conversation analytics",
                desc: "Finds where customers drop off and what should be improved on the site.",
                bullets: [
                    "Topics/intent",
                    "Drop-off points",
                    "Improvement ideas",
                ],
                tag: "Better UX",
            },
            {
                title: "Safety & control",
                desc: "Rules, moderation, escalation and info-only mode to reduce risk.",
                bullets: ["Answer rules", "Human escalation", "Info-only mode"],
                tag: "Control",
            },
        ],

        flowKicker: "Implementation",
        flowTitle: "Short cycle: demo → integrate → measure impact",
        flowSubtitle:
            "We start with a demo (like on this site), connect your channels, then scale only after we see real impact.",

        steps: [
            {
                title: "1) Demo scenario",
                desc: "Agree on logic: what to ask, what managers receive, and when to hand off to a human.",
            },
            {
                title: "2) Integration",
                desc: "Connect channels: form → Telegram/CRM/Email, tags, statuses, anti-spam and reminders.",
            },
            {
                title: "3) Metrics",
                desc: "Measure: response speed, lead quality, conversion, and time saved.",
            },
        ],

        ctaTitle: "Want to see it working live?",
        ctaSubtitle:
            "Run the AI agent demo or the demo audit to preview the process and the outcome.",
        ctaPrimary: "AI agent demo",
        ctaSecondary: "Demo audit",
    },
} as const;

const fade = {
    hidden: { opacity: 0, y: 14 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, delay: 0.05 * i },
    }),
};

export default function AISolutionsPageClient({ locale }: Props) {
    const t = copy[locale];
    const reduceMotion = useReducedMotion();

    return (
        <main className="min-h-dvh">
            <Section>
                <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
                    <div className="lg:col-span-7">
                        <div className="flex flex-col gap-3">
                            <div className="inline-flex w-fit rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs tracking-wide text-white/80">
                                {t.heroKicker}
                            </div>

                            <h1 className="text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                                {t.heroTitle}
                            </h1>

                            <p className="max-w-3xl text-pretty text-sm leading-relaxed text-white/70 sm:text-base">
                                {t.heroSubtitle}
                            </p>
                        </div>

                        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Link
                                href={withLocale(locale, "/demo/ai-agent")}
                                className={cx(
                                    "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold",
                                    "bg-blue-600 text-white shadow-lg shadow-blue-600/20",
                                    "transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/60",
                                )}
                            >
                                {t.ctaPrimary}
                            </Link>
                            <Link
                                href={withLocale(locale, "/demo/audit")}
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
                                {locale === "ua"
                                    ? "Що відчує клієнт"
                                    : "What customers feel"}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-white/70">
                                {locale === "ua"
                                    ? "Відповідь швидше, менше втрат заявок, менеджер отримує короткий бриф, а власник бачить, що працює."
                                    : "Faster replies, fewer lost leads, managers get a short brief, owners see what works."}
                            </p>

                            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-white/70">
                                <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                                    {locale === "ua"
                                        ? "Швидша реакція"
                                        : "Faster response"}
                                </div>
                                <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                                    {locale === "ua"
                                        ? "Менше втрат"
                                        : "Fewer losses"}
                                </div>
                                <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                                    {locale === "ua"
                                        ? "Менше рутини"
                                        : "Less routine"}
                                </div>
                                <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                                    {locale === "ua" ? "Контроль" : "Control"}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Section>

            <Section variant="muted" id="ai-solutions-list">
                <Heading
                    kicker={t.cardsTitle}
                    title={t.cardsTitle}
                    subtitle={t.cardsSubtitle}
                />

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {t.items.map((it, i) => (
                        <motion.div
                            key={it.title}
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
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-base font-semibold text-white">
                                            {it.title}
                                        </h3>
                                        <span className="shrink-0 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white/75">
                                            {it.tag}
                                        </span>
                                    </div>
                                    <p className="text-sm leading-relaxed text-white/70">
                                        {it.desc}
                                    </p>
                                    <ul className="mt-1 space-y-1.5 text-sm text-white/70">
                                        {it.bullets.map((b) => (
                                            <li
                                                key={b}
                                                className="flex items-start gap-2"
                                            >
                                                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-300/80" />
                                                <span>{b}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </Section>

            <Section id="ai-flow">
                <Heading
                    kicker={t.flowKicker}
                    title={t.flowTitle}
                    subtitle={t.flowSubtitle}
                />

                <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {t.steps.map((s, i) => (
                        <motion.div
                            key={s.title}
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
                            <Card className="h-full p-6">
                                <p className="text-sm font-semibold text-white/90">
                                    {s.title}
                                </p>
                                <p className="mt-2 text-sm leading-relaxed text-white/70">
                                    {s.desc}
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10">
                    <p className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                        {t.ctaTitle}
                    </p>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
                        {t.ctaSubtitle}
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href={withLocale(locale, "/demo/ai-agent")}
                            className={cx(
                                "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold",
                                "bg-blue-600 text-white shadow-lg shadow-blue-600/20",
                                "transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/60",
                            )}
                        >
                            {t.ctaPrimary}
                        </Link>
                        <Link
                            href={withLocale(locale, "/demo/audit")}
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
            </Section>
        </main>
    );
}

"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import Section from "@/components/ui/Section";
import Heading from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { cx, withLocale } from "@/lib/utils";

type Props = { locale: Locale };

type Step = {
    id: string;
    title: string;
    desc: string;
};

const copy: Record<
    Locale,
    {
        kicker: string;
        title: string;
        subtitle: string;
        channelsTitle: string;
        channelsSubtitle: string;
        stepsTitle: string;
        stepsSubtitle: string;
        ctaTitle: string;
        ctaSubtitle: string;
        ctaPrimary: string;
        ctaSecondary: string;
        channels: Array<{
            id: "telegram" | "email" | "crm" | "sheets";
            title: string;
            desc: string;
            badge: string;
        }>;
        stepsByChannel: Record<
            "telegram" | "email" | "crm" | "sheets",
            {
                outcome: string;
                deliverable: string;
                steps: Step[];
            }
        >;
        note: string;
    }
> = {
    ua: {
        kicker: "Демо: автоматизація заявок",
        title: "Щоб жодна заявка не губилась — і менеджер відповідав швидко",
        subtitle:
            "Показуємо зрозумілий для малого бізнесу потік: заявка з сайту → повідомлення команді → статуси → контроль. Без складних CRM-«монстрів», можна стартувати хоч із Telegram або таблиці.",
        channelsTitle: "Оберіть, куди надсилати заявки",
        channelsSubtitle:
            "Починаємо з простого. Потім, якщо треба — додаємо CRM, аналітику і правила маршрутизації.",
        stepsTitle: "Як виглядає потік (демо)",
        stepsSubtitle:
            "Кожен крок — це конкретна користь: менше втрат, швидша реакція, зрозумілий контроль.",
        ctaTitle: "Хочете під такий потік підлаштувати ваш сайт?",
        ctaSubtitle:
            "Запустіть демо-міні-аудит: покажемо, де сайт втрачає заявки і як швидко це виправити.",
        ctaPrimary: "Запустити міні-аудит",
        ctaSecondary: "Написати нам",
        channels: [
            {
                id: "telegram",
                title: "Telegram",
                desc: "Миттєве повідомлення у чат + кнопки статусу для команди.",
                badge: "Найшвидший старт",
            },
            {
                id: "email",
                title: "Email",
                desc: "Просто й звично: заявки приходять листами, можна робити правила та шаблони.",
                badge: "Без зайвих інструментів",
            },
            {
                id: "sheets",
                title: "Google Sheets",
                desc: "Таблиця як «міні-CRM»: усі заявки в одному місці, без навчання команди.",
                badge: "Дешево і наочно",
            },
            {
                id: "crm",
                title: "CRM",
                desc: "Стадії, відповідальні, задачі, SLA — якщо заявок багато і потрібна дисципліна.",
                badge: "Системний варіант",
            },
        ],
        stepsByChannel: {
            telegram: {
                outcome:
                    "Менше пропущених заявок і швидша відповідь — клієнти частіше «не остигають».",
                deliverable:
                    "Налаштований потік: форма → Telegram + антиспам + статуси/теги + схема процесу.",
                steps: [
                    {
                        id: "t1",
                        title: "1) Заявка з сайту",
                        desc: "Клієнт заповнює форму — ми додаємо теги (послуга/місто/джерело).",
                    },
                    {
                        id: "t2",
                        title: "2) Миттєве повідомлення в Telegram",
                        desc: "Команда отримує заявку одразу — без «перевірте пошту».",
                    },
                    {
                        id: "t3",
                        title: "3) Кнопки статусу",
                        desc: "В роботі / Очікує / Закрито — щоб було видно, що з заявкою зараз.",
                    },
                    {
                        id: "t4",
                        title: "4) Антиспам і дублікати",
                        desc: "Фільтруємо шум, щоб менеджер бачив тільки реальні звернення.",
                    },
                ],
            },
            email: {
                outcome:
                    "Заявки не губляться, а відповіді стають стабільними — навіть без CRM.",
                deliverable:
                    "Налаштований потік: форма → Email + шаблони/правила + базова аналітика подій.",
                steps: [
                    {
                        id: "e1",
                        title: "1) Заявка з сайту",
                        desc: "Форма збирає потрібний мінімум: контакт + запит + опції.",
                    },
                    {
                        id: "e2",
                        title: "2) Листи з тегами",
                        desc: "В темі листа — джерело і тип заявки, щоб сортувати за секунди.",
                    },
                    {
                        id: "e3",
                        title: "3) Авто-відповідь клієнту",
                        desc: "Клієнт отримує підтвердження: «ми отримали заявку, час відповіді…».",
                    },
                    {
                        id: "e4",
                        title: "4) Правила та папки",
                        desc: "Автоматично розкладаємо заявки по папках, ставимо позначки.",
                    },
                ],
            },
            sheets: {
                outcome:
                    "Усі заявки в одному місці: видно, хто відповідає і що вже зроблено.",
                deliverable:
                    "Налаштована таблиця + потік: форма → Sheets + статуси/відповідальні + прості правила.",
                steps: [
                    {
                        id: "s1",
                        title: "1) Заявка з сайту",
                        desc: "Дані одразу потрапляють у таблицю рядком — без ручного копіювання.",
                    },
                    {
                        id: "s2",
                        title: "2) Статуси і відповідальні",
                        desc: "Колонки: Статус / Менеджер / Дата контакту / Коментар.",
                    },
                    {
                        id: "s3",
                        title: "3) Нагадування",
                        desc: "Якщо не відповіли за X хвилин — надсилаємо нагадування в Telegram/Email.",
                    },
                    {
                        id: "s4",
                        title: "4) Міні-звітність",
                        desc: "Скільки заявок, з яких джерел, де «зависають» — видно одразу.",
                    },
                ],
            },
            crm: {
                outcome:
                    "Коли заявок багато — з’являється дисципліна: SLA, задачі, контроль стадій і відповідальності.",
                deliverable:
                    "Налаштовані поля/стадії + інтеграція форми + маршрутизація + базовий дашборд.",
                steps: [
                    {
                        id: "c1",
                        title: "1) Заявка → CRM",
                        desc: "Створюється лід із потрібними полями (джерело, послуга, місто).",
                    },
                    {
                        id: "c2",
                        title: "2) Розподіл по менеджерах",
                        desc: "Правила: за містом/типом послуги/завантаженням команди.",
                    },
                    {
                        id: "c3",
                        title: "3) SLA та задачі",
                        desc: "Якщо немає контакту X хвилин — задача/нагадування автоматично.",
                    },
                    {
                        id: "c4",
                        title: "4) Прозорий контроль",
                        desc: "Власник бачить: скільки заявок, на яких стадіях, де втрачаємо.",
                    },
                ],
            },
        },
        note: "Це демо-сторінка. Логіку можна під’єднати до реальної форми, Telegram, Email або CRM наступним кроком.",
    },
    en: {
        kicker: "Demo: lead automation",
        title: "So no inquiry gets lost — and your team replies faster",
        subtitle:
            "A simple SMB-friendly flow: website form → team notification → statuses → control. Start with Telegram or Sheets, then scale to CRM if needed.",
        channelsTitle: "Choose where leads go",
        channelsSubtitle:
            "Start simple. Then add CRM, analytics and routing rules if it makes sense.",
        stepsTitle: "How the flow works (demo)",
        stepsSubtitle:
            "Each step brings a clear benefit: fewer losses, faster replies, better visibility.",
        ctaTitle: "Want this flow for your website?",
        ctaSubtitle:
            "Run the demo mini-audit: we’ll show where your site loses leads and how to fix it fast.",
        ctaPrimary: "Run mini audit",
        ctaSecondary: "Contact us",
        channels: [
            {
                id: "telegram",
                title: "Telegram",
                desc: "Instant chat notification + status buttons for the team.",
                badge: "Fastest start",
            },
            {
                id: "email",
                title: "Email",
                desc: "Simple and familiar: leads arrive by email with rules and templates.",
                badge: "No extra tools",
            },
            {
                id: "sheets",
                title: "Google Sheets",
                desc: "Sheets as a mini-CRM: all leads in one place, zero training.",
                badge: "Cheap & clear",
            },
            {
                id: "crm",
                title: "CRM",
                desc: "Stages, owners, tasks, SLA — best when lead volume is higher.",
                badge: "System setup",
            },
        ],
        stepsByChannel: {
            telegram: {
                outcome:
                    "Fewer missed leads and faster replies — prospects don’t cool off.",
                deliverable:
                    "Configured flow: form → Telegram + anti-spam + statuses/tags + process map.",
                steps: [
                    {
                        id: "t1",
                        title: "1) Website form lead",
                        desc: "We tag the lead (service/city/source) right away.",
                    },
                    {
                        id: "t2",
                        title: "2) Instant Telegram message",
                        desc: "The team gets notified immediately — no inbox hunting.",
                    },
                    {
                        id: "t3",
                        title: "3) Status buttons",
                        desc: "In progress / Waiting / Closed — clear visibility for everyone.",
                    },
                    {
                        id: "t4",
                        title: "4) Anti-spam & dedup",
                        desc: "Filter noise so the team sees real requests only.",
                    },
                ],
            },
            email: {
                outcome:
                    "Leads don’t get lost, replies become consistent — even without a CRM.",
                deliverable:
                    "Configured flow: form → Email + templates/rules + basic event tracking.",
                steps: [
                    {
                        id: "e1",
                        title: "1) Website form lead",
                        desc: "Collect the minimum needed: contact + request + options.",
                    },
                    {
                        id: "e2",
                        title: "2) Tagged emails",
                        desc: "Subject includes source/type to sort in seconds.",
                    },
                    {
                        id: "e3",
                        title: "3) Auto confirmation to client",
                        desc: "Client gets: “received, expected response time…”.",
                    },
                    {
                        id: "e4",
                        title: "4) Rules & folders",
                        desc: "Auto-label and route messages into folders.",
                    },
                ],
            },
            sheets: {
                outcome:
                    "All leads in one place: who owns it and what’s next is always visible.",
                deliverable:
                    "Configured Sheet + flow: form → Sheets + statuses/owners + simple rules.",
                steps: [
                    {
                        id: "s1",
                        title: "1) Form → Sheets",
                        desc: "New lead lands as a row — no manual copy/paste.",
                    },
                    {
                        id: "s2",
                        title: "2) Status & owner columns",
                        desc: "Status / Owner / Contact date / Notes.",
                    },
                    {
                        id: "s3",
                        title: "3) Reminders",
                        desc: "If no reply within X minutes — notify via Telegram/Email.",
                    },
                    {
                        id: "s4",
                        title: "4) Mini reporting",
                        desc: "Leads by source, bottlenecks, stuck stages — visible instantly.",
                    },
                ],
            },
            crm: {
                outcome:
                    "When volume grows, you get discipline: SLA, tasks, routing, stage control.",
                deliverable:
                    "Configured fields/stages + form integration + routing rules + basic dashboard.",
                steps: [
                    {
                        id: "c1",
                        title: "1) Form → CRM lead",
                        desc: "Create a lead with source/service/city fields.",
                    },
                    {
                        id: "c2",
                        title: "2) Assign to the right person",
                        desc: "Rules by region/service/team load.",
                    },
                    {
                        id: "c3",
                        title: "3) SLA & tasks",
                        desc: "If no contact within X minutes — task/reminder triggers.",
                    },
                    {
                        id: "c4",
                        title: "4) Clear control",
                        desc: "Owner sees: leads count, stages, loss points.",
                    },
                ],
            },
        },
        note: "This is a demo page. Next step: wire it to a real form, Telegram, Email or CRM.",
    },
};

const fade = {
    hidden: { opacity: 0, y: 12 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, delay: 0.05 * i },
    }),
};

export default function AutomationFlow({ locale }: Props) {
    const t = copy[locale];
    const reduceMotion = useReducedMotion();

    // ВАЖНО: тип выводим из массива каналов — это убирает ошибку setStateAction<"telegram">
    type ChannelId = (typeof t.channels)[number]["id"];

    const [active, setActive] = useState<ChannelId>("telegram");

    const model = useMemo(
        () => t.stepsByChannel[active],
        [t.stepsByChannel, active],
    );

    return (
        <main className="min-h-dvh">
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

                        <p className="mt-4 text-xs text-white/50">{t.note}</p>
                    </div>

                    <div className="lg:col-span-5">
                        <Card className="p-6">
                            <p className="text-sm font-semibold text-white/90">
                                {t.channelsTitle}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-white/70">
                                {t.channelsSubtitle}
                            </p>

                            <div className="mt-5 grid gap-3">
                                {t.channels.map((x) => (
                                    <button
                                        key={x.id}
                                        type="button"
                                        onClick={() => setActive(x.id)}
                                        className={cx(
                                            "rounded-2xl border p-4 text-left transition",
                                            active === x.id
                                                ? "border-blue-500/40 bg-blue-600/15"
                                                : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                                        )}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-semibold text-white">
                                                    {x.title}
                                                </p>
                                                <p className="mt-1 text-sm leading-relaxed text-white/70">
                                                    {x.desc}
                                                </p>
                                            </div>
                                            <span
                                                className={cx(
                                                    "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                                                    active === x.id
                                                        ? "bg-blue-600/20 text-blue-200 ring-blue-500/30"
                                                        : "bg-white/5 text-white/70 ring-white/15",
                                                )}
                                            >
                                                {x.badge}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </Section>

            <Section variant="muted" id="automation-flow">
                <Heading
                    kicker={t.stepsTitle}
                    title={t.stepsTitle}
                    subtitle={t.stepsSubtitle}
                />

                <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-12">
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {model.steps.map((s, i) => (
                                <motion.div
                                    key={s.id}
                                    variants={reduceMotion ? undefined : fade}
                                    initial={
                                        reduceMotion ? undefined : "hidden"
                                    }
                                    whileInView={
                                        reduceMotion ? undefined : "show"
                                    }
                                    viewport={
                                        reduceMotion
                                            ? undefined
                                            : { once: true, amount: 0.25 }
                                    }
                                    custom={i}
                                >
                                    <Card className="h-full p-5">
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
                    </div>

                    <div className="lg:col-span-4">
                        <Card className="p-6">
                            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                                {locale === "ua" ? "Результат" : "Outcome"}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-white/80">
                                {model.outcome}
                            </p>

                            <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                                    {locale === "ua"
                                        ? "На виході"
                                        : "Deliverable"}
                                </p>
                                <p className="mt-2 text-sm leading-relaxed text-white/70">
                                    {model.deliverable}
                                </p>
                            </div>

                            <div className="mt-6">
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
                            </div>
                        </Card>
                    </div>
                </div>
            </Section>
        </main>
    );
}

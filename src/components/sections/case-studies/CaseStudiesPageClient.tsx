"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import Section from "@/components/ui/Section";
import Heading from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { withLocale, cx } from "@/lib/utils";
import FAQSection from "@/components/sections/faq/FAQSection";

type Props = { locale: Locale };

const copy = {
    ua: {
        kicker: "Кейси / приклади",
        title: "Як виглядає результат: коротко, по-ділу, з користю для власника",
        subtitle:
            "Це приклади формату, у якому ми показуємо роботу для малого бізнесу: що заважало заявкам, що зробили, що змінилось. Цифри — демонстраційні, але логіка й підхід — реальні.",
        items: [
            {
                title: "Сайт послуг (малий бізнес)",
                context:
                    "Сайт є, реклама працює, але заявок менше, ніж очікували.",
                problem:
                    "Люди заходять — і йдуть: сайт повільний, CTA слабкі, шлях до заявки незручний.",
                work: [
                    "Прискорили ключові сторінки (мобільна швидкість + зручність)",
                    "Перезібрали CTA: кнопки, форми, логіка блоків",
                    "Налаштували події/воронку, щоб бачити, де саме «втрачаються» люди",
                ],
                result: [
                    "сторінки відкриваються швидше, менше відмов",
                    "більше відвідувачів доходять до форми/дзвінка",
                    "з’явився контроль: що працює, а що треба поправити",
                ],
                takeaway:
                    "Замість «технічного звіту» власник отримує список пріоритетів: що зробити першим і чому це дасть заявки.",
                note: "Приклад формату. Після перших реальних проєктів замінимо на кейси з цифрами та скрінами.",
            },
            {
                title: "Локальний сервіс / майстерня",
                context:
                    "Є дзвінки і заявки, але частина губиться або відповідають запізно.",
                problem:
                    "Немає простого маршруту заявки — клієнт чекає, бізнес втрачає гроші.",
                work: [
                    "Форма → Telegram/Email (миттєве сповіщення)",
                    "Теги/статуси: «нове», «в роботі», «очікує»",
                    "Нагадування, щоб команда не забувала відповісти",
                ],
                result: [
                    "менше «втрачених» заявок",
                    "швидша відповідь клієнту",
                    "менше ручної рутини для команди",
                ],
                takeaway:
                    "Це часто найшвидший ефект для SMB: один раз налаштували — і перестали втрачати клієнтів щодня.",
                note: "Приклад формату. Ефект залежить від потоку заявок і швидкості відповіді команди.",
            },
            {
                title: "Магазин / сервіс з рекламою",
                context:
                    "Є витрати на рекламу, але не зрозуміло, що окупається, а що — ні.",
                problem:
                    "Немає прозорої аналітики: складно приймати рішення по бюджету.",
                work: [
                    "Визначили конверсії (що вважати заявкою/покупкою)",
                    "Звʼязали джерела трафіку з результатом",
                    "Зібрали простий дашборд, який читає власник (без «маркетингового туману»)",
                ],
                result: [
                    "зрозуміло, які канали дають результат",
                    "видно, де клієнти «зриваються» на сайті",
                    "легше керувати бюджетом і не зливати зайве",
                ],
                takeaway:
                    "Коли цифри видно — рішення стають простими: підсилюємо ефективне, відключаємо зайве.",
                note: "Приклад формату. З реальними даними дашборд стає корисним уже за 7–14 днів.",
            },
        ],
        labels: {
            context: "Контекст",
            problem: "Проблема",
            work: "Що зробили",
            result: "Що змінилось",
            takeaway: "Важливо для власника",
        },
        ctaTitle: "Хочете такий же зрозумілий план покращень для свого сайту?",
        ctaSubtitle:
            "Запустіть демо-аудит — отримаєте короткий список пріоритетів: що дасть найбільший ефект саме у вашому бізнесі.",
        ctaBtn: "Запустити демо-аудит",
        secondaryBtn: "Подивитись послуги",
    },

    en: {
        kicker: "Case studies / examples",
        title: "What results look like: practical, owner-friendly, actionable",
        subtitle:
            "These are examples of the reporting format we use for SMB owners: what blocked leads, what we did, what changed. Numbers are demo, but the workflow and logic are real.",
        items: [
            {
                title: "Service website (SMB)",
                context:
                    "The site exists and ads are running, but leads are below expectations.",
                problem:
                    "Visitors bounce: slow pages, weak CTAs, and a confusing path to inquiry.",
                work: [
                    "Improved key pages (mobile speed + usability)",
                    "Reworked CTAs: buttons, forms, page flow",
                    "Set up events & funnel tracking to see where drop-offs happen",
                ],
                result: [
                    "faster pages and lower bounce",
                    "more visitors reach the form/call",
                    "clear visibility: what works vs what needs fixing",
                ],
                takeaway:
                    "Instead of tech noise, the owner gets priorities: what to fix first and why it increases leads.",
                note: "Format example. We’ll replace with real cases/screens after first projects.",
            },
            {
                title: "Local service / workshop",
                context:
                    "Leads come in, but some are missed or answered too late.",
                problem:
                    "No simple lead routing — customers wait and revenue is lost.",
                work: [
                    "Form → Telegram/Email instant notifications",
                    "Tags/statuses: new / in progress / waiting",
                    "Reminders so the team responds on time",
                ],
                result: [
                    "fewer missed leads",
                    "faster replies",
                    "less manual routine for the team",
                ],
                takeaway:
                    "Often the fastest SMB win: set the workflow once and stop losing customers daily.",
                note: "Format example. Impact depends on lead volume and response speed.",
            },
            {
                title: "Shop/service with ads",
                context:
                    "There is ad spend, but it’s unclear what pays back and what doesn’t.",
                problem: "No clear analytics — hard to make budget decisions.",
                work: [
                    "Defined conversions (what counts as a lead/sale)",
                    "Connected sources to outcomes",
                    "Built a simple owner-readable dashboard (no jargon)",
                ],
                result: [
                    "clear view of performing channels",
                    "drop-off points on the site are visible",
                    "easier budget control with less waste",
                ],
                takeaway:
                    "When numbers are clear, decisions are simple: scale what works, stop what doesn’t.",
                note: "Format example. With real data, dashboards become actionable within 7–14 days.",
            },
        ],
        labels: {
            context: "Context",
            problem: "Problem",
            work: "What we did",
            result: "What changed",
            takeaway: "Owner takeaway",
        },
        ctaTitle: "Want the same clear improvement plan for your website?",
        ctaSubtitle:
            "Run the demo audit — you’ll get a short priority list of the highest-impact improvements for your business.",
        ctaBtn: "Run demo audit",
        secondaryBtn: "View services",
    },
} as const;

const fade = {
    hidden: { opacity: 0, y: 14 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, delay: 0.06 * i },
    }),
};

export default function CaseStudiesPageClient({ locale }: Props) {
    const t = copy[locale];
    const reduceMotion = useReducedMotion();
    const L = t.labels;

    return (
        <main className="min-h-dvh">
            <Section>
                <Heading
                    kicker={t.kicker}
                    title={t.title}
                    subtitle={t.subtitle}
                />
            </Section>

            <Section variant="muted">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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
                            <Card className="h-full p-6">
                                <h3 className="text-base font-semibold text-white">
                                    {it.title}
                                </h3>

                                <div className="mt-3 space-y-4 text-sm text-white/70">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                                            {L.context}
                                        </p>
                                        <p className="mt-1 leading-relaxed">
                                            {it.context}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                                            {L.problem}
                                        </p>
                                        <p className="mt-1 leading-relaxed">
                                            {it.problem}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                                            {L.work}
                                        </p>
                                        <ul className="mt-1 space-y-1.5">
                                            {it.work.map((x) => (
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

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                                            {L.result}
                                        </p>
                                        <ul className="mt-1 space-y-1.5">
                                            {it.result.map((x) => (
                                                <li
                                                    key={x}
                                                    className="flex items-start gap-2"
                                                >
                                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-green-300/80" />
                                                    <span>{x}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                                            {L.takeaway}
                                        </p>
                                        <p className="mt-2 text-sm leading-relaxed text-white/70">
                                            {it.takeaway}
                                        </p>

                                        <p className="mt-3 text-xs leading-relaxed text-white/55">
                                            {it.note}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10">
                    <p className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                        {t.ctaTitle}
                    </p>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
                        {t.ctaSubtitle}
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href={withLocale(locale, "/demo/audit")}
                            className={cx(
                                "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold",
                                "bg-blue-600 text-white shadow-lg shadow-blue-600/20",
                                "transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/60",
                            )}
                        >
                            {t.ctaBtn}
                        </Link>

                        <Link
                            href={withLocale(locale, "/services")}
                            className={cx(
                                "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold",
                                "border border-white/15 bg-white/5 text-white/90 backdrop-blur",
                                "transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30",
                            )}
                        >
                            {t.secondaryBtn}
                        </Link>
                    </div>
                </div>
            </Section>

            {/* FAQ для SEO (FAQPage JSON-LD) + для конверсии */}
            <FAQSection locale={locale} />
        </main>
    );
}

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
        heroKicker: "Послуги для малого бізнесу",
        heroTitle:
            "Налаштуємо сайт так, щоб він приводив більше заявок — і ви бачили це в цифрах",
        heroSubtitle:
            "Прибираємо те, що “з’їдає” клієнтів: повільність, незрозумілі сторінки, відсутність аналітики та хаос із заявками. Пояснюємо просто, робимо акуратно, показуємо результат.",

        primaryBenefitTitle: "Що ви отримаєте в підсумку",
        primaryBenefitItems: [
            "Сайт відкривається швидко — менше людей йде",
            "Google краще розуміє сторінки — зростає видимість",
            "Заявки не губляться — приходять одразу в потрібний канал",
            "Зрозумілий звіт “до/після” + рекомендації на наступні кроки",
        ] as const,

        blocksTitle: "Що саме ми можемо покращити",
        blocksSubtitle:
            "Можна обрати одну послугу або комплекс. Кожен напрям має чіткий результат і конкретний “вихід” (що буде зроблено і що зміниться).",

        items: [
            {
                title: "Швидкість сайту та зручність",
                desc: "Коли сайт повільний або незручний — люди просто йдуть. Ми прибираємо “гальма” і робимо шлях до заявки простим.",
                bullets: [
                    "Прискорення ключових сторінок",
                    "Оптимізація зображень та коду",
                    "Покращення форм і кнопок (CTA)",
                ],
                tag: "Більше заявок",
                outcome:
                    "Менше відмов → більше людей доходять до дзвінка / форми.",
                deliverable:
                    "Звіт «до/після» (швидкість/UX) + список впроваджених правок.",
            },
            {
                title: "Технічне SEO та структура сайту",
                desc: "Щоб Google показував вас вище, сайт має бути “читабельним” для пошукових систем. Ми наводимо порядок у структурі та технічній базі.",
                bullets: [
                    "Логічна структура сторінок",
                    "Мета-теги та внутрішні посилання",
                    "Sitemap/robots та технічні налаштування",
                ],
                tag: "Більше видимості",
                outcome:
                    "Стабільніший органічний трафік і краща видимість у Google.",
                deliverable:
                    "Технічний аудит + впроваджені правки + короткий план росту.",
            },
            {
                title: "Аналітика та контроль реклами",
                desc: "Важливо розуміти: звідки приходять заявки і скільки коштує кожна. Ми налаштовуємо просту аналітику, зрозумілу власнику.",
                bullets: [
                    "Події та конверсії (що вважати заявкою)",
                    "Зв’язка з рекламою (Ads) за потреби",
                    "Дашборд/звіт без “маркетингової магії”",
                ],
                tag: "Контроль бюджету",
                outcome:
                    "Чітко видно, які канали дають прибуток, а які “зливають” бюджет.",
                deliverable:
                    "Дашборд + інструкція + налаштування ключових подій/конверсій.",
            },
            {
                title: "Автоматизація заявок",
                desc: "Жодна заявка не має губитися. Ми налаштуємо маршрут заявки так, щоб команда реагувала швидше.",
                bullets: [
                    "Форма → CRM / Telegram / Email / Sheets",
                    "Автосповіщення та маршрутизація",
                    "Захист від спаму та дублювань",
                ],
                tag: "Менше втрат",
                outcome:
                    "Швидша реакція → більше клієнтів доходять до покупки.",
                deliverable:
                    "Налаштований сценарій + схема процесу для команди.",
            },
            {
                title: "AI-помічники для рутини",
                desc: "AI може зняти частину рутини: типові питання, первинна “підготовка” заявки, чернетки відповідей. Без ризику — з контролем.",
                bullets: [
                    "Відповіді на часті питання",
                    "Первинні уточнення по заявці",
                    "Чернетки відповідей/комерційних",
                ],
                tag: "Економія часу",
                outcome:
                    "Менше ручної рутини → менеджери більше займаються продажами.",
                deliverable:
                    "Налаштований сценарій + правила безпеки + контроль якості відповідей.",
            },
            {
                title: "Підтримка та розвиток",
                desc: "Якщо потрібна системність — ведемо сайт як продукт: план робіт, пріоритети, релізи, регулярні звіти.",
                bullets: [
                    "Roadmap на 30–90 днів",
                    "Техпідтримка та оновлення",
                    "Регулярні звіти по прогресу",
                ],
                tag: "Стабільний ріст",
                outcome:
                    "Поступове підвищення конверсії та якості заявок місяць за місяцем.",
                deliverable: "План робіт + ритм релізів + звітність.",
            },
        ],

        packagesTitle: "Пакети співпраці",
        packagesSubtitle:
            "Можна стартувати з малого й швидко отримати користь — або одразу вибудувати систему. У кожного пакета чіткий обсяг робіт і очікуваний результат.",

        packages: [
            {
                name: "Start",
                price: "від 8 000 грн",
                desc: "Швидкий старт: знайдемо 3–5 найважливіших проблем і виправимо базу за 1–2 тижні.",
                included: [
                    "Міні-аудит (швидкість/структура/заявки)",
                    "Базові технічні правки",
                    "Налаштування ключової аналітики",
                ],
                highlight: false,
                bestFor: "Якщо треба швидко навести порядок",
            },
            {
                name: "Growth",
                price: "від 18 000 грн",
                desc: "Ріст: швидкість + аналітика + автоматизація заявок, щоб менше втрачати клієнтів.",
                included: [
                    "UX і швидкість на ключових сторінках",
                    "Зрозумілий контроль реклами/каналів",
                    "Форма → Telegram/CRM + антиспам",
                ],
                highlight: true,
                bestFor: "Якщо заявки є, але вони губляться / дорогі",
            },
            {
                name: "System",
                price: "від 35 000 грн",
                desc: "Системне рішення: процеси, інтеграції, AI-помічник і план росту.",
                included: [
                    "Аналітична воронка + звітність",
                    "Автоматизації процесів",
                    "AI-сценарії для рутини та якості",
                ],
                highlight: false,
                bestFor: "Якщо хочете керований ріст і масштабування",
            },
        ],

        ctaTitle:
            "Хочете зрозуміти, що саме дасть найбільший ефект у вашому випадку?",
        ctaSubtitle:
            "Запустіть демо-аудит: ви отримаєте короткий список пріоритетів — без складної технічної мови.",
        ctaPrimary: "Запустити аудит",
        ctaSecondary: "Отримати консультацію",
        badgesTitle: "Працюємо прозоро",
        badges: [
            "Зрозумілі кроки",
            "Вимірюваний результат",
            "Без “магії”",
        ] as const,
    },

    en: {
        heroKicker: "Services for small businesses",
        heroTitle:
            "We tune your website to generate more leads — and prove it with numbers",
        heroSubtitle:
            "We fix what silently loses customers: slow pages, unclear content, missing analytics, and messy lead handling. Clear explanations, structured delivery, measurable impact.",

        primaryBenefitTitle: "What you get in the end",
        primaryBenefitItems: [
            "Faster website — fewer visitors leave",
            "Clearer structure — better Google visibility",
            "No lost leads — routed instantly to your channel",
            "Simple before/after report + next-step recommendations",
        ] as const,

        blocksTitle: "What we can improve",
        blocksSubtitle:
            "Pick one service or combine several. Each direction has a clear outcome and a concrete deliverable (what we do and what changes).",

        items: [
            {
                title: "Website speed & usability",
                desc: "If your website is slow or confusing, people leave. We remove friction and make the path to a lead simple.",
                bullets: [
                    "Speed up key pages",
                    "Optimize images and code",
                    "Improve forms and CTAs",
                ],
                tag: "More leads",
                outcome: "Lower bounce → more calls and form submissions.",
                deliverable:
                    "Before/after report (performance/UX) + list of applied fixes.",
            },
            {
                title: "Technical SEO & structure",
                desc: "To rank better, Google must understand your pages. We clean up structure and technical foundations.",
                bullets: [
                    "Logical page hierarchy",
                    "Meta tags & internal linking",
                    "Sitemap/robots and technical setup",
                ],
                tag: "More visibility",
                outcome:
                    "Better Google visibility and steadier organic traffic.",
                deliverable: "Technical audit + applied fixes + growth plan.",
            },
            {
                title: "Analytics & ad control",
                desc: "You should know where leads come from and what each lead costs. We set up owner-friendly tracking and reporting.",
                bullets: [
                    "Events & conversions (what counts as a lead)",
                    "Ads linkage if needed",
                    "Simple dashboard/report (no jargon)",
                ],
                tag: "Budget control",
                outcome: "Clear view of profitable vs wasteful channels.",
                deliverable: "Dashboard + owner guide + tracking setup.",
            },
            {
                title: "Lead automation",
                desc: "No more lost inquiries. We route leads to the right place and help your team respond faster.",
                bullets: [
                    "Form → CRM / Telegram / Email / Sheets",
                    "Instant notifications & routing",
                    "Spam + duplicate protection",
                ],
                tag: "Fewer losses",
                outcome: "Faster response → more closed deals.",
                deliverable: "Configured workflow + process map for your team.",
            },
            {
                title: "Practical AI assistants",
                desc: "AI can remove routine: common questions, initial lead clarification, reply drafts — with control and safety.",
                bullets: [
                    "FAQ replies",
                    "Initial lead questions",
                    "Draft replies/proposals",
                ],
                tag: "Time savings",
                outcome: "Less routine → more time for sales and service.",
                deliverable: "Configured scenario + safety rules + QA checks.",
            },
            {
                title: "Ongoing growth support",
                desc: "If you want consistency, we operate your site like a product: roadmap, priorities, releases, regular reporting.",
                bullets: [
                    "30–90 day roadmap",
                    "Maintenance & updates",
                    "Regular progress reports",
                ],
                tag: "Steady growth",
                outcome: "Continuous conversion and lead quality improvements.",
                deliverable: "Roadmap + release rhythm + reporting.",
            },
        ],

        packagesTitle: "Packages",
        packagesSubtitle:
            "Start small and get value quickly — or build a full system. Each package has clear scope and expected outcome.",

        packages: [
            {
                name: "Start",
                price: "from ₴8,000",
                desc: "Quick start: fix 3–5 highest-impact issues within 1–2 weeks.",
                included: [
                    "Mini audit (speed/structure/leads)",
                    "Core technical fixes",
                    "Key analytics setup",
                ],
                highlight: false,
                bestFor: "If you want quick clarity and fixes",
            },
            {
                name: "Growth",
                price: "from ₴18,000",
                desc: "Growth bundle: speed + analytics + lead automation to stop losing customers.",
                included: [
                    "UX & speed on key pages",
                    "Simple channel/ad control",
                    "Form → Telegram/CRM + anti-spam",
                ],
                highlight: true,
                bestFor: "If leads exist but are costly or get lost",
            },
            {
                name: "System",
                price: "from ₴35,000",
                desc: "System solution: workflows, integrations, AI support and a growth plan.",
                included: [
                    "Funnel tracking + reporting",
                    "Workflow automation",
                    "AI scenarios for routine and QA",
                ],
                highlight: false,
                bestFor: "If you want controllable scaling",
            },
        ],

        ctaTitle: "Want to know what will move the needle for your business?",
        ctaSubtitle:
            "Run the demo audit to get a short priority list — without technical overload.",
        ctaPrimary: "Run audit",
        ctaSecondary: "Get consultation",
        badgesTitle: "Transparent delivery",
        badges: ["Clear steps", "Measurable impact", "No “magic”"] as const,
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

export default function ServicesPageClient({ locale }: Props) {
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
                                {t.primaryBenefitTitle}
                            </p>

                            <ul className="mt-4 space-y-2 text-sm text-white/70">
                                {t.primaryBenefitItems.map((x) => (
                                    <li
                                        key={x}
                                        className="flex items-start gap-2"
                                    >
                                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-300/80" />
                                        <span>{x}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-5 flex flex-wrap gap-2">
                                <span className="text-xs text-white/60">
                                    {t.badgesTitle}:
                                </span>
                                {t.badges.map((b) => (
                                    <span
                                        key={b}
                                        className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white/70"
                                    >
                                        {b}
                                    </span>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </Section>

            <Section variant="muted" id="services-list">
                <Heading
                    kicker={t.blocksTitle}
                    title={t.blocksTitle}
                    subtitle={t.blocksSubtitle}
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

                                    <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                                        <p className="text-xs text-white/70">
                                            <span className="font-semibold text-white/85">
                                                {locale === "ua"
                                                    ? "Результат: "
                                                    : "Outcome: "}
                                            </span>
                                            {it.outcome}
                                        </p>
                                        <p className="mt-2 text-xs text-white/70">
                                            <span className="font-semibold text-white/85">
                                                {locale === "ua"
                                                    ? "На виході: "
                                                    : "Deliverable: "}
                                            </span>
                                            {it.deliverable}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </Section>

            <Section id="packages">
                <Heading
                    kicker={t.packagesTitle}
                    title={t.packagesTitle}
                    subtitle={t.packagesSubtitle}
                />

                <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {t.packages.map((p, i) => (
                        <motion.div
                            key={p.name}
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
                            <Card
                                className={cx(
                                    "h-full p-6",
                                    p.highlight
                                        ? "ring-1 ring-blue-500/40 bg-white/[0.04]"
                                        : "",
                                )}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-semibold text-white/90">
                                            {p.name}
                                        </p>
                                        <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
                                            {p.price}
                                        </p>
                                    </div>

                                    {p.highlight ? (
                                        <span className="rounded-full bg-blue-600/20 px-3 py-1 text-xs font-semibold text-blue-200 ring-1 ring-blue-500/30">
                                            {locale === "ua"
                                                ? "Найчастіше обирають"
                                                : "Most chosen"}
                                        </span>
                                    ) : null}
                                </div>

                                <p className="mt-3 text-sm leading-relaxed text-white/70">
                                    {p.desc}
                                </p>

                                <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                                    <p className="text-xs text-white/75">
                                        <span className="font-semibold text-white/85">
                                            {locale === "ua"
                                                ? "Найкраще підходить: "
                                                : "Best for: "}
                                        </span>
                                        {p.bestFor}
                                    </p>
                                </div>

                                <ul className="mt-4 space-y-2 text-sm text-white/70">
                                    {p.included.map((x) => (
                                        <li
                                            key={x}
                                            className="flex items-start gap-2"
                                        >
                                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-300/80" />
                                            <span>{x}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-6">
                                    <Link
                                        href={withLocale(locale, "/contact")}
                                        className={cx(
                                            "inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold",
                                            p.highlight
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"
                                                : "border border-white/15 bg-white/5 text-white/90 hover:bg-white/10",
                                            "transition focus:outline-none focus:ring-2 focus:ring-white/30",
                                        )}
                                    >
                                        {locale === "ua"
                                            ? "Обговорити пакет"
                                            : "Discuss package"}
                                    </Link>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </Section>

            <Section variant="muted" id="services-cta">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10">
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
            </Section>
        </main>
    );
}

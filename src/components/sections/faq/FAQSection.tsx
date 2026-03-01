"use client";

import type { Locale } from "@/lib/i18n";
import Section from "@/components/ui/Section";
import Heading from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";

type Props = { locale: Locale };

type QA = { q: string; a: string };

const copy: Record<
    Locale,
    { kicker: string; title: string; subtitle: string; items: QA[] }
> = {
    ua: {
        kicker: "FAQ",
        title: "Питання, які власники малого бізнесу задають найчастіше",
        subtitle:
            "Просто, по-людськи і без технічної «води». Щоб було зрозуміло: що ви отримаєте, коли і як це вплине на заявки та витрати.",
        items: [
            {
                q: "Скільки часу потрібно, щоб побачити результат?",
                a: "Швидкі покращення часто видно вже за 3–14 днів: сайт стає швидшим, форми працюють краще, заявки не губляться, зʼявляються зрозумілі цифри в аналітиці. Ріст з органіки (Google) зазвичай займає 4–8 тижнів — бо пошуку потрібен час, щоб «переоцінити» сайт після правок.",
            },
            {
                q: "Що дає результат найшвидше (якщо треба «вчора»)?",
                a: "Найчастіше — три речі: (1) швидкість і мобільна зручність (люди перестають “тікати”), (2) форма заявки + CTA (щоб було легко залишити контакт), (3) автоматизація заявки (миттєве повідомлення в Telegram/пошту, щоб не втрачати клієнтів). Це дає швидкий приріст без повного перероблення сайту.",
            },
            {
                q: "Потрібно переробляти сайт повністю?",
                a: "Зазвичай — ні. У більшості SMB сайт можна «підтягнути» точково: прискорити ключові сторінки, зробити зрозумілу подачу послуги/продукту, спростити шлях до заявки, навести порядок у SEO та аналітиці. Повний редизайн має сенс лише тоді, коли нинішній сайт реально заважає продавати (плутанина, слабка структура, немає довіри).",
            },
            {
                q: "Як зрозуміти, що реклама окупається, а бюджет не «зливається»?",
                a: "Потрібно бачити 3 цифри: (1) скільки коштує заявка (CPA), (2) скільки заявок реально стають клієнтами, (3) скільки грошей приносить кожен канал (ROMI). Ми налаштовуємо конверсії в GA4/Ads так, щоб ви бачили по каналах: де прибуток, а де — витрати без результату.",
            },
            {
                q: "Що таке Core Web Vitals (CWV) простими словами?",
                a: "Це «самопочуття» сайту для людей і Google. Три речі: (1) як швидко з’являється головний контент, (2) чи не «гальмує» сайт при кліках, (3) чи не стрибає верстка під час завантаження. Якщо CWV погані — люди частіше йдуть, а Google менш охоче піднімає сторінки вище.",
            },
            {
                q: "Чи зможете ви зробити так, щоб заявки не губилися?",
                a: "Так. Ми налаштовуємо простий і надійний сценарій: заявка з форми → миттєве повідомлення → статус/тег → відповідальний менеджер → нагадування, якщо немає відповіді. Плюс антиспам і базова фільтрація «порожніх» заявок. Мета проста: жоден клієнт не загубився.",
            },
            {
                q: "Ми маленька команда. Це не буде складно підтримувати?",
                a: "Ні. Ми спеціально робимо рішення «для власника», а не «для айтішників»: зрозуміла логіка, мінімум зайвих інструментів, коротка інструкція. Після впровадження вам не треба тримати окремого технічного спеціаліста на повний день.",
            },
            {
                q: "Скільки це коштує і як формується ціна?",
                a: "Ціна залежить від обсягу та цілей. Ми можемо почати з міні-аудиту — і ви отримаєте список пріоритетів: що зробити першим, щоб отримати найбільший ефект. Далі — або пакет (під ключ), або точкові задачі. Перед стартом — прозорий план робіт і зрозумілий результат на виході.",
            },
        ],
    },
    en: {
        kicker: "FAQ",
        title: "Questions small business owners ask most often",
        subtitle:
            "Plain language, no tech overload. So you know what you’ll get, when you’ll see impact, and how it affects leads and spend.",
        items: [
            {
                q: "How soon can I see results?",
                a: "Quick wins often appear within 3–14 days: faster pages, smoother lead forms, fewer missed inquiries, clearer analytics. Organic Google growth typically takes 4–8 weeks because search needs time to reassess the site after fixes.",
            },
            {
                q: "What brings the fastest impact (when I need results ASAP)?",
                a: "Usually three things: (1) speed + mobile usability (people stop bouncing), (2) form + CTA improvements (it’s easier to inquire), (3) lead automation (instant Telegram/email alerts so you don’t miss customers). This can lift leads without rebuilding the whole site.",
            },
            {
                q: "Do I need a full rebuild?",
                a: "Most of the time — no. SMB sites can be improved with targeted fixes: speed up key pages, simplify the offer, remove friction on the way to inquiry, and fix SEO/analytics basics. A full redesign only makes sense when the current site actively prevents sales (confusing structure, low trust, poor UX).",
            },
            {
                q: "How do I know if my ads are profitable (and not wasting budget)?",
                a: "You need three numbers: (1) cost per lead (CPA), (2) how many leads turn into customers, (3) revenue by channel (ROMI). We set up GA4/Ads conversions so you can see by channel what pays back and what doesn’t.",
            },
            {
                q: "What are Core Web Vitals (CWV) in simple terms?",
                a: "They’re your site’s “health signals” for users and Google: (1) how fast main content appears, (2) whether the site feels responsive when clicking, (3) whether the layout jumps while loading. Poor CWV usually means higher bounce and weaker Google visibility.",
            },
            {
                q: "Can you stop leads from getting lost?",
                a: "Yes. We build a simple workflow: form submission → instant alert → status/tag → assigned owner → reminders if no response. Plus anti-spam and basic filtering of low-quality requests. The goal is straightforward: zero missed customers.",
            },
            {
                q: "We’re a small team. Will it be hard to maintain?",
                a: "No. We design owner-friendly systems: minimal tools, clear logic, and a short handover guide. You shouldn’t need a full-time developer just to keep things working.",
            },
            {
                q: "How much does it cost and how is pricing decided?",
                a: "Pricing depends on scope and goals. You can start with a mini audit to get a priority list of the highest-impact changes. Then choose a package or specific tasks. Before we start, you get a transparent plan and clear deliverables.",
            },
        ],
    },
};

function buildFaqJsonLd(locale: Locale, items: QA[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        inLanguage: locale,
        mainEntity: items.map((x) => ({
            "@type": "Question",
            name: x.q,
            acceptedAnswer: {
                "@type": "Answer",
                text: x.a,
            },
        })),
    };
}

export default function FAQSection({ locale }: Props) {
    const t = copy[locale];
    const ld = buildFaqJsonLd(locale, t.items);

    return (
        <Section id="faq" variant="muted">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
            />

            <Heading kicker={t.kicker} title={t.title} subtitle={t.subtitle} />

            <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {t.items.map((x) => (
                    <Card key={x.q} className="p-5">
                        <details className="group">
                            <summary className="cursor-pointer list-none text-sm font-semibold text-white">
                                <div className="flex items-start justify-between gap-3">
                                    <span>{x.q}</span>
                                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition group-open:rotate-45">
                                        +
                                    </span>
                                </div>
                            </summary>
                            <p className="mt-3 text-sm leading-relaxed text-white/70">
                                {x.a}
                            </p>
                        </details>
                    </Card>
                ))}
            </div>
        </Section>
    );
}

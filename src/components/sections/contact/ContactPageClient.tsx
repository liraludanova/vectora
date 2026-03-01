"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import Section from "@/components/ui/Section";
import Heading from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { cx, withLocale } from "@/lib/utils";
import Link from "next/link";
import { useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Props = { locale: Locale };

type FormState = {
    name: string;
    company: string;
    email: string;
    website: string;
    goal: string;

    // anti-spam (optional)
    honey: string; // hidden field (honeypot)
};

type TouchedState = Partial<Record<keyof FormState, boolean>>;

type LeadApiOk = {
    ok: true;
    id: string;
    delivered?: {
        telegram?: boolean;
        email?: boolean;
    };
};

type LeadApiError = { ok: false; error: string };
type LeadApiResponse = LeadApiOk | LeadApiError;

const copy = {
    ua: {
        kicker: "Контакти",
        title: "Коротко опишіть задачу — ми надішлемо план з 2–3 кроків, які дадуть найбільший ефект",
        subtitle:
            "Без нав’язливих продажів і складних термінів. Спочатку розберемось у контексті, потім запропонуємо простий, зрозумілий план.",
        fields: {
            name: "Ім’я",
            company: "Компанія (необов’язково)",
            email: "Email",
            website: "Сайт (якщо є)",
            goal: "Що хочете покращити? (1–2 речення)",
        },
        placeholders: {
            name: "Напр., Ірина",
            company: "Напр., Крамниця / сервіс",
            email: "name@example.com",
            website: "https://",
            goal: "Напр., «Є реклама, але мало заявок. Хочу зрозуміти, що заважає і що виправити першим»",
        },
        submit: "Надіслати запит",
        sending: "Надсилаємо…",
        sent: "Отримали ✅",
        sendAnother: "Надіслати ще один запит",
        demoLink: "Або запустити демо-аудит",
        trustLine:
            "Ми не передаємо ваші контакти третім сторонам. Використаємо тільки для відповіді.",
        noteSmall:
            "Після відправки ми отримаємо заявку в Telegram/Email і швидко повернемось з відповіддю.",
        sideTitle: "Що буде далі",
        sideSteps: [
            {
                title: "1) Уточнимо контекст",
                desc: "Коротко розпитаємо про ціль, трафік і як ви зараз отримуєте заявки.",
            },
            {
                title: "2) Дамо план на 2–3 кроки",
                desc: "Без «на 50 сторінок». Лише те, що реально дасть ефект найшвидше.",
            },
            {
                title: "3) Зафіксуємо результат у цифрах",
                desc: "Домовимось, які метрики ростимо: заявки, конверсія, вартість ліда, швидкість відповіді.",
            },
        ],
        focusTitle: "Фокус для малого бізнесу",
        focusText:
            "Більше заявок ≠ більше хаосу. Налаштовуємо сайт і процес так, щоб заявки приходили стабільно, а обробка була швидкою та контрольованою.",
        ctaPrimary: "Подивитись послуги",
        errorGeneric:
            "Помилка мережі/сервера. Спробуйте ще раз або напишіть нам у Telegram.",
    },
    en: {
        kicker: "Contact",
        title: "Describe your goal — we’ll send a 2–3 step plan with the highest impact",
        subtitle:
            "No pushy sales and no technical overload. We review context first, then propose a simple, clear action plan.",
        fields: {
            name: "Name",
            company: "Company (optional)",
            email: "Email",
            website: "Website (optional)",
            goal: "What do you want to improve? (1–2 sentences)",
        },
        placeholders: {
            name: "e.g., Irina",
            company: "e.g., Local shop / service",
            email: "name@example.com",
            website: "https://",
            goal: "e.g., “We run ads but leads are low. I want to know what blocks conversions and what to fix first.”",
        },
        submit: "Send request",
        sending: "Sending…",
        sent: "Received ✅",
        sendAnother: "Send another request",
        demoLink: "Or run the demo audit",
        trustLine:
            "We don’t share your contact details with third parties. We use them only to reply.",
        noteSmall:
            "After you submit, we receive the lead in Telegram/Email and reply quickly.",
        sideTitle: "What happens next",
        sideSteps: [
            {
                title: "1) Clarify the context",
                desc: "A few quick questions about your goal, traffic, and how leads are handled today.",
            },
            {
                title: "2) A 2–3 step plan",
                desc: "No 50-page audits. Only the fastest high-impact steps.",
            },
            {
                title: "3) Measure results",
                desc: "We define success metrics: leads, conversion, cost per lead, response speed.",
            },
        ],
        focusTitle: "Built for SMB owners",
        focusText:
            "More leads shouldn’t mean more chaos. We set up your site and workflow so leads are steady and handling is fast and controlled.",
        ctaPrimary: "View services",
        errorGeneric:
            "Network/server error. Please try again or message us on Telegram.",
    },
} as const;

function isEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function looksLikeUrl(value: string) {
    const v = value.trim();
    if (!v) return true; // optional
    return /^https?:\/\/.+\..+/.test(v) || /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(v);
}

function getUtmSafe(): Record<string, string> {
    if (typeof window === "undefined") return {};
    const p = new URLSearchParams(window.location.search);
    const keys = [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
    ];
    const out: Record<string, string> = {};
    for (const k of keys) {
        const v = p.get(k);
        if (v) out[k] = v;
    }
    return out;
}

async function safeReadJson(res: Response): Promise<{
    json: LeadApiResponse | null;
    text: string;
    isJson: boolean;
}> {
    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const text = await res.text().catch(() => "");
    if (!text) return { json: null, text: "", isJson };

    if (isJson) {
        try {
            return { json: JSON.parse(text) as LeadApiResponse, text, isJson };
        } catch {
            return { json: null, text, isJson };
        }
    }

    // sometimes server returns JSON but without correct header — try parse
    try {
        return {
            json: JSON.parse(text) as LeadApiResponse,
            text,
            isJson: true,
        };
    } catch {
        return { json: null, text, isJson: false };
    }
}

export default function ContactPageClient({ locale }: Props) {
    const t = copy[locale];
    const reduceMotion = useReducedMotion();

    // Hydration/autofill safety without setState-in-effect warnings
    const [hydrated] = useState(() => typeof window !== "undefined");

    const [state, setState] = useState<FormState>({
        name: "",
        company: "",
        email: "",
        website: "",
        goal: "",
        honey: "",
    });

    const [touched, setTouched] = useState<TouchedState>({});
    const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
    const [serverError, setServerError] = useState<string | null>(null);

    const errors = useMemo(() => {
        const e: Partial<Record<keyof FormState, string>> = {};

        if (state.name.trim().length < 2) {
            e.name = locale === "ua" ? "Мінімум 2 символи" : "Min 2 characters";
        }

        if (!isEmail(state.email)) {
            e.email = locale === "ua" ? "Некоректний email" : "Invalid email";
        }

        if (!looksLikeUrl(state.website)) {
            e.website =
                locale === "ua"
                    ? "Схоже на некоректне посилання (краще з https://)"
                    : "Looks like an invalid URL (prefer https://)";
        }

        if (state.goal.trim().length < 12) {
            e.goal =
                locale === "ua"
                    ? "Опиши трохи детальніше (12+ символів)"
                    : "Add a bit more detail (12+ characters)";
        }

        return e;
    }, [state, locale]);

    const canSubmit =
        hydrated && Object.keys(errors).length === 0 && status !== "sending";

    function onChange<K extends keyof FormState>(key: K, value: string) {
        setState((s) => ({ ...s, [key]: value }));
        setTouched((p) => ({ ...p, [key]: true }));
        setServerError(null);
        if (status === "sent") setStatus("idle");
    }

    function showError<K extends keyof FormState>(key: K) {
        if (!hydrated) return undefined;
        if (!touched[key]) return undefined;
        return errors[key];
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        setTouched({
            name: true,
            company: true,
            email: true,
            website: true,
            goal: true,
            honey: true,
        });

        setServerError(null);
        if (!canSubmit) {
            trackEvent("contact_error", {
                locale,
                reason: "validation",
                has_website: Boolean(state.website.trim()),
            });
            return;
        }

        // simple bot trap: if honeypot is filled — pretend ok (and do not send)
        if (state.honey && state.honey.trim().length > 0) {
            trackEvent("contact_error", {
                locale,
                reason: "honeypot",
            });
            setStatus("sent");
            return;
        }

        setStatus("sending");

        trackEvent("contact_submit", {
            locale,
            phase: "start",
            has_website: Boolean(state.website.trim()),
        });

        try {
            const payload = {
                locale,
                name: state.name,
                company: state.company || undefined,
                email: state.email,
                website: state.website || undefined,
                goal: state.goal,

                utm: getUtmSafe(),
                referrer:
                    typeof document !== "undefined" ? document.referrer : "",
                landing:
                    typeof window !== "undefined" ? window.location.href : "",
                userAgent:
                    typeof navigator !== "undefined" ? navigator.userAgent : "",
                tz:
                    typeof Intl !== "undefined"
                        ? Intl.DateTimeFormat().resolvedOptions().timeZone
                        : "",

                // anti-spam
                honey: state.honey,

                // turnstileToken: добавим позже, когда подключишь виджет
                // turnstileToken,
            };

            const res = await fetch("/api/lead", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(payload),
            });

            const { json, text } = await safeReadJson(res);

            if (!res.ok || !json || json.ok === false) {
                const msg =
                    (json && "error" in json && json.error) ||
                    (locale === "ua"
                        ? `Помилка: ${res.status}`
                        : `Error: ${res.status}`);

                // if server returned html/text, add small hint (first chars)
                const hint =
                    !json && text
                        ? ` (${text.slice(0, 60).replace(/\s+/g, " ")}…)`
                        : "";

                setServerError(msg + hint);
                setStatus("idle");

                trackEvent("contact_error", {
                    locale,
                    reason: "server",
                    status: res.status,
                });

                return;
            }

            // success
            trackEvent("contact_submit", {
                locale,
                phase: "success",
                lead_id: json.id,
                has_website: Boolean(state.website.trim()),
                delivered_telegram: Boolean(json.delivered?.telegram),
                delivered_email: Boolean(json.delivered?.email),
            });

            setStatus("sent");
        } catch {
            setServerError(t.errorGeneric);
            setStatus("idle");

            trackEvent("contact_error", {
                locale,
                reason: "network",
            });
        }
    }

    function resetForm() {
        setState({
            name: "",
            company: "",
            email: "",
            website: "",
            goal: "",
            honey: "",
        });
        setTouched({});
        setServerError(null);
        setStatus("idle");
    }

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
                <div className="grid gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={
                                reduceMotion ? undefined : { opacity: 0, y: 10 }
                            }
                            animate={
                                reduceMotion ? undefined : { opacity: 1, y: 0 }
                            }
                            transition={{ duration: 0.45 }}
                        >
                            <Card className="p-6">
                                <form
                                    onSubmit={onSubmit}
                                    className="space-y-4"
                                    noValidate
                                >
                                    {/* Honeypot (hidden) */}
                                    <div className="hidden" aria-hidden="true">
                                        <label>
                                            Do not fill
                                            <input
                                                name="honey"
                                                value={state.honey}
                                                onChange={(e) =>
                                                    onChange(
                                                        "honey",
                                                        e.target.value,
                                                    )
                                                }
                                                autoComplete="off"
                                                tabIndex={-1}
                                                suppressHydrationWarning
                                            />
                                        </label>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Field
                                            name="name"
                                            label={t.fields.name}
                                            value={state.name}
                                            onChange={(v) =>
                                                onChange("name", v)
                                            }
                                            error={showError("name")}
                                            placeholder={t.placeholders.name}
                                            autoComplete="name"
                                        />
                                        <Field
                                            name="company"
                                            label={t.fields.company}
                                            value={state.company}
                                            onChange={(v) =>
                                                onChange("company", v)
                                            }
                                            error={showError("company")}
                                            placeholder={t.placeholders.company}
                                            autoComplete="organization"
                                        />
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Field
                                            name="email"
                                            label={t.fields.email}
                                            value={state.email}
                                            onChange={(v) =>
                                                onChange("email", v)
                                            }
                                            error={showError("email")}
                                            placeholder={t.placeholders.email}
                                            autoComplete="email"
                                            type="email"
                                            inputMode="email"
                                        />
                                        <Field
                                            name="website"
                                            label={t.fields.website}
                                            value={state.website}
                                            onChange={(v) =>
                                                onChange("website", v)
                                            }
                                            error={showError("website")}
                                            placeholder={t.placeholders.website}
                                            autoComplete="url"
                                            type="url"
                                            inputMode="url"
                                        />
                                    </div>

                                    <Field
                                        name="goal"
                                        label={t.fields.goal}
                                        value={state.goal}
                                        onChange={(v) => onChange("goal", v)}
                                        error={showError("goal")}
                                        placeholder={t.placeholders.goal}
                                        textarea
                                    />

                                    {serverError ? (
                                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
                                            {serverError}
                                        </div>
                                    ) : null}

                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        {status === "sent" ? (
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                                <div className="inline-flex items-center justify-center rounded-xl bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-200 ring-1 ring-green-500/20">
                                                    {t.sent}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={resetForm}
                                                    className={cx(
                                                        "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold",
                                                        "border border-white/15 bg-white/5 text-white/90 backdrop-blur",
                                                        "transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30",
                                                    )}
                                                    suppressHydrationWarning
                                                >
                                                    {t.sendAnother}
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="submit"
                                                disabled={!canSubmit}
                                                suppressHydrationWarning
                                                className={cx(
                                                    "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold",
                                                    canSubmit
                                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"
                                                        : "cursor-not-allowed bg-white/10 text-white/40",
                                                    "transition focus:outline-none focus:ring-2 focus:ring-blue-400/60",
                                                )}
                                            >
                                                {status === "sending"
                                                    ? t.sending
                                                    : t.submit}
                                            </button>
                                        )}

                                        <Link
                                            href={withLocale(
                                                locale,
                                                "/demo/audit",
                                            )}
                                            className="text-sm text-white/70 hover:text-white"
                                            onClick={() =>
                                                trackEvent("cta_click", {
                                                    locale,
                                                    location: "contact",
                                                    cta: "demo_audit",
                                                    to: `/${locale}/demo/audit`,
                                                })
                                            }
                                        >
                                            {t.demoLink} →
                                        </Link>
                                    </div>

                                    <p className="text-xs text-white/60">
                                        {t.trustLine}
                                    </p>
                                    <p className="text-xs text-white/45">
                                        {t.noteSmall}
                                    </p>
                                </form>
                            </Card>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                            <p className="text-sm font-semibold text-white/90">
                                {t.sideTitle}
                            </p>

                            <ol className="mt-4 space-y-4">
                                {t.sideSteps.map((s) => (
                                    <li key={s.title} className="flex gap-3">
                                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300/80" />
                                        <div>
                                            <p className="text-sm font-semibold text-white/80">
                                                {s.title}
                                            </p>
                                            <p className="mt-1 text-sm leading-relaxed text-white/70">
                                                {s.desc}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ol>

                            <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                                    {t.focusTitle}
                                </p>
                                <p className="mt-2 text-sm leading-relaxed text-white/70">
                                    {t.focusText}
                                </p>
                            </div>

                            <div className="mt-6">
                                <Link
                                    href={withLocale(locale, "/services")}
                                    className={cx(
                                        "inline-flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold",
                                        "border border-white/15 bg-white/5 text-white/90 backdrop-blur",
                                        "transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30",
                                    )}
                                    onClick={() =>
                                        trackEvent("cta_click", {
                                            locale,
                                            location: "contact_sidebar",
                                            cta: "services",
                                            to: `/${locale}/services`,
                                        })
                                    }
                                >
                                    {t.ctaPrimary}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
        </main>
    );
}

function Field(props: {
    name: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    placeholder?: string;
    textarea?: boolean;
    autoComplete?: string;
    type?: "text" | "email" | "url";
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
    const {
        name,
        label,
        value,
        onChange,
        error,
        placeholder,
        textarea,
        autoComplete,
        type = "text",
        inputMode,
    } = props;

    const commonClass = cx(
        "mt-2 w-full rounded-xl border bg-black/30 px-3 py-2 text-sm text-white outline-none",
        "border-white/10 focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/20",
    );

    return (
        <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/60">
                {label}
            </span>

            {textarea ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={5}
                    className={commonClass}
                    autoComplete={autoComplete}
                    suppressHydrationWarning
                />
            ) : (
                <input
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={commonClass}
                    type={type}
                    inputMode={inputMode}
                    autoComplete={autoComplete}
                    suppressHydrationWarning
                />
            )}

            {error ? (
                <p className="mt-1 text-xs text-red-300/90">{error}</p>
            ) : null}
        </label>
    );
}

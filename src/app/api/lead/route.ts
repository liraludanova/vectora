// src/app/api/lead/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { supabaseServer } from "@/lib/supabase";

type Locale = "ua" | "en";

type LeadInput = {
    locale: Locale;
    name: string;
    company?: string;
    email: string;
    website?: string;
    goal: string;

    // context
    utm?: Record<string, string>;
    referrer?: string;
    landing?: string;
    userAgent?: string;
    tz?: string;

    // anti-spam
    turnstileToken?: string;
    honey?: string;
};

type LeadStored = {
    id: string;
    createdAt: string;
    locale: Locale;
    name: string;
    company: string | null;
    email: string;
    website: string | null;
    goal: string;

    context: {
        utm: Record<string, string>;
        referrer: string | null;
        landing: string | null;
        userAgent: string | null;
        tz: string | null;
        ipHash: string | null;
        host: string | null;
    };
};

type JsonOk = {
    ok: true;
    id: string;
    delivered: { telegram: boolean; email: boolean };
    stored: boolean;
};

type JsonErr = { ok: false; error: string; details?: string };

const rateBucket = new Map<string, { count: number; resetAt: number }>();

function nowMs() {
    return Date.now();
}

function getClientIp(req: Request) {
    const xff = req.headers.get("x-forwarded-for") || "";
    const ip = xff.split(",")[0]?.trim();
    return ip || null;
}

function sha256(text: string) {
    return crypto.createHash("sha256").update(text).digest("hex");
}

function normalizeWebsite(raw: string) {
    const v = (raw || "").trim();
    if (!v) return "";
    if (/^https?:\/\//i.test(v)) return v;
    return `https://${v}`;
}

function isEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function looksLikeUrlOptional(value: string) {
    const v = (value || "").trim();
    if (!v) return true;
    const n = normalizeWebsite(v);
    try {
        const u = new URL(n);
        return Boolean(u.hostname && u.hostname.includes("."));
    } catch {
        return false;
    }
}

function cleanText(v: string, maxLen: number) {
    const s = (v || "").trim().replace(/\s+/g, " ");
    return s.length > maxLen ? s.slice(0, maxLen) : s;
}

function clampObjectEntries(
    obj: Record<string, unknown>,
    maxEntries: number,
    keyMax: number,
    valMax: number,
) {
    const entries = Object.entries(obj).slice(0, maxEntries);
    const out: Record<string, string> = {};
    for (const [k, v] of entries) {
        const kk = String(k).slice(0, keyMax);
        const vv = String(v ?? "").slice(0, valMax);
        if (kk) out[kk] = vv;
    }
    return out;
}

function rateLimit(key: string, limit: number, windowMs: number) {
    const t = nowMs();
    const cur = rateBucket.get(key);
    if (!cur || t > cur.resetAt) {
        rateBucket.set(key, { count: 1, resetAt: t + windowMs });
        return { ok: true as const };
    }
    if (cur.count >= limit) return { ok: false as const, resetAt: cur.resetAt };
    cur.count += 1;
    return { ok: true as const };
}

function isLocalHost(hostHeader: string | null) {
    if (!hostHeader) return false;
    const host = hostHeader.toLowerCase();
    return (
        host.startsWith("localhost") ||
        host.startsWith("127.0.0.1") ||
        host.includes("localhost:") ||
        host.includes("127.0.0.1:")
    );
}

// Turnstile оставляем как было (verify можно включить позже)
async function verifyTurnstile(token: string | undefined) {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) {
        return {
            ok: false as const,
            reason: "TURNSTILE_SECRET_KEY is not set",
        };
    }
    if (!token || token.trim().length < 10) {
        return { ok: false as const, reason: "Missing turnstile token" };
    }

    const form = new URLSearchParams();
    form.set("secret", secret);
    form.set("response", token);

    const res = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
            method: "POST",
            headers: { "content-type": "application/x-www-form-urlencoded" },
            body: form.toString(),
        },
    );

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        return {
            ok: false as const,
            reason: `Turnstile verify failed: ${res.status} ${text}`.slice(
                0,
                700,
            ),
        };
    }

    const json = (await res.json()) as {
        success?: boolean;
        "error-codes"?: string[];
    };

    if (!json.success) {
        return {
            ok: false as const,
            reason: `Turnstile rejected: ${(json["error-codes"] || []).join(", ")}`.slice(
                0,
                300,
            ),
        };
    }

    return { ok: true as const };
}

async function telegramSend(text: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        return { ok: false as const, reason: "Telegram env is not set" };
    }

    const res = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                parse_mode: "HTML",
                disable_web_page_preview: true,
            }),
        },
    );

    if (!res.ok) {
        const textRes = await res.text().catch(() => "");
        return {
            ok: false as const,
            reason: `Telegram failed: ${res.status} ${textRes}`.slice(0, 700),
        };
    }

    return { ok: true as const };
}

function canSendEmail() {
    return Boolean(
        process.env.SMTP_HOST &&
        process.env.SMTP_PORT &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS &&
        process.env.LEADS_TO_EMAIL,
    );
}

async function emailSend(subject: string, html: string) {
    if (!canSendEmail()) {
        return { ok: false as const, reason: "SMTP env not set" };
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST!,
        port: Number(process.env.SMTP_PORT!),
        secure: Number(process.env.SMTP_PORT!) === 465,
        auth: {
            user: process.env.SMTP_USER!,
            pass: process.env.SMTP_PASS!,
        },
    });

    await transporter.sendMail({
        from: process.env.SMTP_USER!,
        to: process.env.LEADS_TO_EMAIL!,
        subject,
        html,
    });

    return { ok: true as const };
}

function htmlEscape(s: string) {
    return s
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatTelegramLead(lead: LeadStored) {
    const lines: string[] = [];
    lines.push(`<b>New lead</b> (#${htmlEscape(lead.id)})`);
    lines.push(`<b>Name:</b> ${htmlEscape(lead.name)}`);
    lines.push(`<b>Email:</b> ${htmlEscape(lead.email)}`);

    if (lead.company) lines.push(`<b>Company:</b> ${htmlEscape(lead.company)}`);
    if (lead.website) lines.push(`<b>Website:</b> ${htmlEscape(lead.website)}`);

    lines.push(`<b>Goal:</b> ${htmlEscape(lead.goal)}`);

    if (lead.context.landing)
        lines.push(`<b>Landing:</b> ${htmlEscape(lead.context.landing)}`);
    if (lead.context.referrer)
        lines.push(`<b>Referrer:</b> ${htmlEscape(lead.context.referrer)}`);

    const utmPairs = Object.entries(lead.context.utm || {}).filter(
        ([, v]) => v,
    );
    if (utmPairs.length) {
        lines.push(
            `<b>UTM:</b> ${utmPairs.map(([k, v]) => `${htmlEscape(k)}=${htmlEscape(v)}`).join(" | ")}`,
        );
    }

    if (lead.context.tz)
        lines.push(`<b>TZ:</b> ${htmlEscape(lead.context.tz)}`);

    lines.push(`<b>Locale:</b> ${lead.locale}`);
    lines.push(`<b>At:</b> ${htmlEscape(lead.createdAt)}`);

    return lines.join("\n");
}

function formatEmailLead(lead: LeadStored) {
    const utmPairs = Object.entries(lead.context.utm || {}).filter(
        ([, v]) => v,
    );

    return `
        <div style="font-family: ui-sans-serif, system-ui; line-height: 1.4">
            <h2>New lead (#${htmlEscape(lead.id)})</h2>
            <p><b>Name:</b> ${htmlEscape(lead.name)}</p>
            <p><b>Email:</b> ${htmlEscape(lead.email)}</p>
            ${lead.company ? `<p><b>Company:</b> ${htmlEscape(lead.company)}</p>` : ""}
            ${lead.website ? `<p><b>Website:</b> ${htmlEscape(lead.website)}</p>` : ""}
            <p><b>Goal:</b> ${htmlEscape(lead.goal)}</p>
            <hr/>
            <p><b>Landing:</b> ${htmlEscape(lead.context.landing || "—")}</p>
            <p><b>Referrer:</b> ${htmlEscape(lead.context.referrer || "—")}</p>
            <p><b>UTM:</b> ${
                utmPairs.length
                    ? utmPairs
                          .map(([k, v]) => `${htmlEscape(k)}=${htmlEscape(v)}`)
                          .join(" | ")
                    : "—"
            }</p>
            <p><b>User-Agent:</b> ${htmlEscape(lead.context.userAgent || "—")}</p>
            <p><b>Timezone:</b> ${htmlEscape(lead.context.tz || "—")}</p>
            <p><b>Host:</b> ${htmlEscape(lead.context.host || "—")}</p>
            <p><b>Created:</b> ${htmlEscape(lead.createdAt)}</p>
        </div>
    `;
}

async function storeLeadSupabase(
    lead: LeadStored,
    deliveredTelegram: boolean,
    deliveredEmail: boolean,
) {
    const sb = supabaseServer();

    const { data, error } = await sb
        .from("leads")
        .insert({
            // id: lead.id, // можно не задавать: таблица генерит uuid сама
            locale: lead.locale,
            name: lead.name,
            company: lead.company,
            email: lead.email,
            website: lead.website,
            goal: lead.goal,

            utm: lead.context.utm,
            referrer: lead.context.referrer,
            landing: lead.context.landing,
            user_agent: lead.context.userAgent,
            tz: lead.context.tz,
            ip_hash: lead.context.ipHash,
            host: lead.context.host,

            delivered_telegram: deliveredTelegram,
            delivered_email: deliveredEmail,
        })
        .select("id, created_at")
        .single();

    if (error) {
        return { ok: false as const, reason: error.message };
    }

    return {
        ok: true as const,
        id: String(data.id),
        createdAt: String(data.created_at),
    };
}

export async function POST(req: Request) {
    let body: LeadInput | null = null;

    try {
        body = (await req.json()) as LeadInput;
    } catch {
        return NextResponse.json<JsonErr>(
            { ok: false, error: "Invalid JSON" },
            { status: 400 },
        );
    }

    if (body?.honey && body.honey.trim().length > 0) {
        return NextResponse.json<JsonOk>(
            {
                ok: true,
                id: "honeypot",
                delivered: { telegram: false, email: false },
                stored: false,
            },
            { status: 200 },
        );
    }

    const host = req.headers.get("host");
    const local = isLocalHost(host);

    const ip = getClientIp(req) || (local ? "local" : "");
    const ipHash = ip ? sha256(ip).slice(0, 16) : null;

    const rlKey = ipHash || host || "unknown";
    const rl = rateLimit(rlKey, 5, 10 * 60 * 1000);
    if (!rl.ok) {
        return NextResponse.json<JsonErr>(
            { ok: false, error: "Too many requests. Try later." },
            { status: 429 },
        );
    }

    const locale: Locale = body?.locale === "ua" ? "ua" : "en";

    const name = cleanText(body?.name || "", 80);
    const company = cleanText(body?.company || "", 120);
    const email = cleanText(body?.email || "", 120);
    const websiteRaw = cleanText(body?.website || "", 300);
    const website = websiteRaw ? normalizeWebsite(websiteRaw) : "";
    const goal = cleanText(body?.goal || "", 2000);

    if (name.length < 2) {
        return NextResponse.json<JsonErr>(
            { ok: false, error: "Invalid name" },
            { status: 400 },
        );
    }
    if (!isEmail(email)) {
        return NextResponse.json<JsonErr>(
            { ok: false, error: "Invalid email" },
            { status: 400 },
        );
    }
    if (!looksLikeUrlOptional(website)) {
        return NextResponse.json<JsonErr>(
            { ok: false, error: "Invalid website" },
            { status: 400 },
        );
    }
    if (goal.length < 12) {
        return NextResponse.json<JsonErr>(
            { ok: false, error: "Goal is too short" },
            { status: 400 },
        );
    }

    const secretSet = Boolean(process.env.TURNSTILE_SECRET_KEY);
    if (secretSet && !local) {
        const ver = await verifyTurnstile(body?.turnstileToken);
        if (!ver.ok) {
            const isDev = process.env.NODE_ENV !== "production";
            return NextResponse.json<JsonErr>(
                {
                    ok: false,
                    error: "Captcha verification failed",
                    details: isDev ? ver.reason : undefined,
                },
                { status: 400 },
            );
        }
    }

    const utm =
        body?.utm && typeof body.utm === "object"
            ? clampObjectEntries(body.utm, 20, 60, 200)
            : {};
    const referrer = body?.referrer ? cleanText(body.referrer, 500) : null;
    const landing = body?.landing ? cleanText(body.landing, 500) : null;
    const userAgent = body?.userAgent
        ? cleanText(body.userAgent, 400)
        : cleanText(req.headers.get("user-agent") || "", 400);
    const tz = body?.tz ? cleanText(body.tz, 80) : null;

    // локальный id для Telegram/Email (в БД будет свой uuid)
    const localId = crypto.randomBytes(6).toString("hex");

    const lead: LeadStored = {
        id: localId,
        createdAt: new Date().toISOString(),
        locale,
        name,
        company: company || null,
        email,
        website: website || null,
        goal,
        context: {
            utm,
            referrer,
            landing,
            userAgent: userAgent || null,
            tz,
            ipHash,
            host: host || null,
        },
    };

    // 1) Telegram (primary)
    const tg = await telegramSend(formatTelegramLead(lead));

    // 2) Email (optional)
    let emailOk = false;
    if (canSendEmail()) {
        try {
            const subject = `Vectora lead — ${lead.name}`;
            const mail = await emailSend(subject, formatEmailLead(lead));
            emailOk = mail.ok;
        } catch {
            emailOk = false;
        }
    }

    // 3) Store to Supabase (even if delivery fails)
    let stored = true;
    let storedId = lead.id;

    try {
        const ins = await storeLeadSupabase(lead, tg.ok, emailOk);
        if (!ins.ok) {
            stored = false;
        } else {
            storedId = ins.id;
        }
    } catch {
        stored = false;
    }

    return NextResponse.json<JsonOk>(
        {
            ok: true,
            id: storedId,
            delivered: { telegram: tg.ok, email: emailOk },
            stored,
        },
        { status: 200 },
    );
}

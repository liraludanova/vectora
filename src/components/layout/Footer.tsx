import Link from "next/link";
import Container from "./Container";

type Locale = "ua" | "en";

export default function Footer({ locale }: { locale: Locale }) {
    const base = `/${locale}`;

    const t =
        locale === "ua"
            ? {
                  brand: "Vectora Systems",
                  desc: "Робимо сайт швидшим і зрозумілішим для Google та клієнтів. Налаштовуємо аналітику й автоматизації, щоб заявки не губилися.",
                  navTitle: "Навігація",
                  actionsTitle: "Швидкий старт",
                  actionsDesc:
                      "Міні-аудит покаже 3–5 найсильніших точок росту: швидкість, SEO-основа, конверсія та «втрачені заявки».",
                  cta: "Запустити міні-аудит",
                  top: "Вгору ↑",
                  made: "Україна • Віддалено",
                  links: {
                      services: "Послуги",
                      ai: "AI-рішення",
                      cases: "Кейси",
                      demo: "Демо",
                      contact: "Контакти",
                  },
                  legalPrefix: "© ",
              }
            : {
                  brand: "Vectora Systems",
                  desc: "We make websites faster and clearer for Google and customers. We add analytics and automations so leads don’t get lost.",
                  navTitle: "Navigation",
                  actionsTitle: "Quick start",
                  actionsDesc:
                      "A mini-audit highlights 3–5 biggest growth levers: performance, SEO basics, conversion and lost-lead points.",
                  cta: "Run mini-audit",
                  top: "Back to top ↑",
                  made: "Ukraine • Remote",
                  links: {
                      services: "Services",
                      ai: "AI solutions",
                      cases: "Case studies",
                      demo: "Demo",
                      contact: "Contact",
                  },
                  legalPrefix: "© ",
              };

    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-white/10 bg-black">
            <Container>
                <div className="grid gap-10 py-12 lg:grid-cols-3">
                    {/* Brand */}
                    <div>
                        <div className="text-sm font-semibold text-white">
                            {t.brand}
                        </div>
                        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/65">
                            {t.desc}
                        </p>

                        <div className="mt-4">
                            <a
                                href="#top"
                                className="inline-flex items-center rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 backdrop-blur transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/25"
                            >
                                {t.top}
                            </a>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <div className="text-sm font-semibold text-white">
                            {t.navTitle}
                        </div>

                        <div className="mt-3 grid gap-2 text-sm text-white/70">
                            <Link
                                className="hover:text-white"
                                href={`${base}/services`}
                            >
                                {t.links.services}
                            </Link>
                            <Link
                                className="hover:text-white"
                                href={`${base}/ai-solutions`}
                            >
                                {t.links.ai}
                            </Link>
                            <Link
                                className="hover:text-white"
                                href={`${base}/case-studies`}
                            >
                                {t.links.cases}
                            </Link>
                            <Link
                                className="hover:text-white"
                                href={`${base}/demo`}
                            >
                                {t.links.demo}
                            </Link>
                            <Link
                                className="hover:text-white"
                                href={`${base}/contact`}
                            >
                                {t.links.contact}
                            </Link>
                        </div>
                    </div>

                    {/* Quick start */}
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <div className="text-sm font-semibold text-white">
                            {t.actionsTitle}
                        </div>
                        <p className="mt-2 text-sm text-white/65">
                            {t.actionsDesc}
                        </p>
                        <Link
                            href={`${base}/demo/audit`}
                            className="mt-4 inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                        >
                            {t.cta}
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                        {t.legalPrefix}
                        {year} {t.brand}
                    </span>
                    <span className="text-white/45">{t.made}</span>
                </div>
            </Container>
        </footer>
    );
}

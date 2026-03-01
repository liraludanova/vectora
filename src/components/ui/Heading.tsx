type Props = {
    kicker?: string;
    title: string;
    subtitle?: string;
    align?: "left" | "center";
    as?: "h1" | "h2" | "h3";
};

export default function Heading({
    kicker,
    title,
    subtitle,
    align = "left",
    as = "h2",
}: Props) {
    const a =
        align === "center"
            ? "text-center items-center"
            : "text-left items-start";

    const Tag = as;

    const titleClass =
        as === "h1"
            ? "text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl"
            : "text-balance text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-4xl";

    return (
        <div className={`flex flex-col gap-3 ${a}`}>
            {kicker ? (
                <div className="inline-flex w-fit rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs tracking-wide text-white/80">
                    {kicker}
                </div>
            ) : null}

            <Tag className={titleClass}>{title}</Tag>

            {subtitle ? (
                <p className="max-w-3xl text-pretty text-sm leading-relaxed text-white/70 sm:text-base">
                    {subtitle}
                </p>
            ) : null}
        </div>
    );
}

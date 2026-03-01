import type { ReactNode } from "react";

type Variant = "neutral" | "success" | "info" | "warning" | "danger";

type Props = {
    children: ReactNode;
    variant?: Variant;
    className?: string;
};

const variantClasses: Record<Variant, string> = {
    neutral: "border-white/12 bg-white/5 text-white/80",
    success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    info: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
    warning: "border-amber-400/20 bg-amber-400/10 text-amber-200",
    danger: "border-rose-400/20 bg-rose-400/10 text-rose-200",
};

export default function Badge({
    children,
    variant = "neutral",
    className = "",
}: Props) {
    return (
        <span
            className={[
                "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
                "backdrop-blur transition",
                "shadow-sm shadow-black/10",
                variantClasses[variant],
                className,
            ].join(" ")}
        >
            {children}
        </span>
    );
}

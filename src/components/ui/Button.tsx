import Link from "next/link";
import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonStyles = cva(
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition will-change-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--bg))] disabled:opacity-50 disabled:pointer-events-none",
    {
        variants: {
            variant: {
                primary:
                    "bg-[rgb(var(--accent))] text-white hover:brightness-110 focus:ring-[rgb(var(--accent))]",
                secondary:
                    "bg-white/10 text-white hover:bg-white/15 focus:ring-white/30",
                ghost: "bg-transparent text-white hover:bg-white/10 focus:ring-white/20",
            },
        },
        defaultVariants: {
            variant: "primary",
        },
    },
);

type Props = VariantProps<typeof buttonStyles> & {
    href?: string;
    children: ReactNode;
    className?: string;
    size?: string;
    type?: "button" | "submit";
    onClick?: () => void;
    disabled?: boolean;
};

export function Button({
    href,
    children,
    className,
    variant,

    type = "button",
    onClick,
    disabled,
}: Props) {
    const classes = cn(buttonStyles({ variant }), className);

    if (href) {
        return (
            <Link href={href} className={classes} aria-disabled={disabled}>
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

import type { ReactNode } from "react";
import Container from "@/components/layout/Container";

type Props = {
    id?: string;
    children: ReactNode;
    className?: string;
    variant?: "default" | "muted";
};

export default function Section({
    id,
    children,
    className = "",
    variant = "default",
}: Props) {
    const bg =
        variant === "muted"
            ? "bg-white/[0.02] border-y border-white/10"
            : "bg-transparent";

    return (
        <section
            id={id}
            className={`${bg} py-14 sm:py-16 lg:py-24 ${className}`}
        >
            <Container>{children}</Container>
        </section>
    );
}

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
    children: ReactNode;
    className?: string;
};

export function Card({ children, className }: Props) {
    return (
        <div
            className={cn(
                "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)]",
                className,
            )}
        >
            {children}
        </div>
    );
}

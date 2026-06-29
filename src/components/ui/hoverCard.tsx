import { memo } from "react";
import { cn } from "@/lib/utils";

export const Card = memo(({ children, className, hover }: {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}) => (
    <div
        className={cn(
            "rounded-2xl border border-[#e8eaef] transition-all duration-300 overflow-hidden bg-white shadow-sm",
            hover && "hover:shadow-2xl hover:-translate-y-1",
            className
        )}
    >
        {children}
    </div>
));

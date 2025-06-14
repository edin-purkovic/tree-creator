import { PropsWithChildren } from "react";
import { cn } from "@/utils/utils";

interface SplitLayoutProps {
    width?: "grow" | "full";
    column?: boolean;
    minWidth?: string;
    maxWidth?: string;
    minHeight?: string;
    maxHeight?: string;
}

export const SplitLayout = ({ children, width, column, minWidth, maxWidth, minHeight, maxHeight }: PropsWithChildren<SplitLayoutProps>) => (
    <div
        className={cn(
            "h-full flex bg-background-0 gap-2 overflow-hidden",
            column && "flex-col",
            width === "grow" && "grow",
            width === "full" && "w-full"
        )}

        style={{ minWidth, maxWidth, minHeight, maxHeight }}
    >
        {children}
    </div>
)
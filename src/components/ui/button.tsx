import { PropsWithChildren } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/utils/utils";

interface ButtonProps {
    onClick?: () => void;
    className?: string;
    tooltip?: string;
    danger?: boolean;
    icon?: boolean;
}

export const Button = ({ className, children, icon, danger, tooltip, onClick }: PropsWithChildren<ButtonProps>) => (
    <Tooltip text={tooltip}>
        <button
            className={cn(
                "h-8 flex justify-center items-center rounded-md text-xl px-4",
                "text-color-default [&_svg]:fill-color-default",
                "hover:text-[#fff] hover:bg-background-selectable [&_svg]:hover:fill-white",
                "active:bg-background-0/50",
                icon && "h-12 w-12 text-2xl p-0",
                danger && "hover:bg-red-700/20 [&_svg]:hover:fill-red-700",
                className
            )}

            onClick={onClick}
        >
            {children}
        </button>
    </Tooltip>
)
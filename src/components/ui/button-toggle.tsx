import { PropsWithChildren } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/utils/utils";

interface ButtonToggleProps {
    onChange: (value: boolean) => void;
    value: boolean;
    tooltip?: string;
}

export const ButtonToggle = ({ children, onChange, value, tooltip }: PropsWithChildren<ButtonToggleProps>) => {
    const onClick = () => onChange(!value);

    return (
        <Tooltip text={tooltip}>
            <button
                className={cn(
                    "w-12 h-12 text-2xl flex justify-center items-center rounded-md text-color-default",
                    "hover:text-[#fff] active:bg-background-selectable/40 hover:bg-background-selectable",
                    value && "text-[#fff]"
                )}
                onClick={onClick}
            >
                {children}
            </button>
        </Tooltip>
    )
}


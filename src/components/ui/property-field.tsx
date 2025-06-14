import { PropsWithChildren } from "react";
import { cn } from "@/utils/utils";

interface PropertyFieldProps {
    label: string;
    column?: boolean;
}

export const PropertyField = ({ label, children, column }: PropsWithChildren<PropertyFieldProps>) => (
    <div className={cn("flex p-1 text-[16px] transition-colors")}>
        <div className={cn("flex w-full p-0 rounded-2xl", column && "flex-col")}>
            <div className={cn("pl-3 pt-1 w-[40%] mw-[40%] flex tracking-wider", column && "w-full mb-4")}>
                {label}
            </div>

            <div className={cn("w-[60%] mw-[60%] overflow-hidden flex gap-2", column && "w-full")}>
                {children}
            </div>
        </div>
    </div>
)
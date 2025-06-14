import { PropsWithChildren } from "react";
import { cn } from "@/utils/utils";

export const ButtonGroup = ({ children, right }: PropsWithChildren<{ right?: boolean }>) => (
    <div className={cn("flex grow justify-start items-center gap-1", right && "justify-end")}>
        {children}
    </div>
)

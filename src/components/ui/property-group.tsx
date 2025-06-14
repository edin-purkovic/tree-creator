import { PropsWithChildren } from "react";
import { cn } from "@/utils/utils";

export const PropertyGroup = ({ children }: PropsWithChildren) => (
    <div className={cn("flex px-4 py-2 first-of-type:pt-4")}>
        <div className={cn("flex flex-col gap-2 w-full p-4 rounded-2xl bg-background-selectable")}>
            {children}
        </div>
    </div>
)
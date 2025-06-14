import { PropsWithChildren, ReactNode } from "react";
import { If } from "@/components/utils/if"
import { cn } from "@/utils/utils";

interface TabProps {
    header?: ReactNode;
    footer?: ReactNode;
    width?: string;
    height?: string;
    smallFooter?: boolean;
    darkFooter?: boolean;
}

export const Tab = ({ children, header, footer, width, height, smallFooter, darkFooter }: PropsWithChildren<TabProps>) => (
    <div
        className="flex flex-col h-full bg-background-1 rounded-b-xl border border-solid border-background-1"
        style={{ width, height }}
    >
        <If condtition={!!header}>
            <div className="flex min-h-[50px] border-b border-b-background-0 px-2">
                {header}
            </div>
        </If>

        <If condtition={!!children}>
            <div className="w-full h-full overflow-hidden">
                {children}
            </div>
        </If>

        <If condtition={!!footer}>
            <div
                className={cn(
                    "flex min-h-[50px] items-center border-t border-t-background-0 px-2",
                    smallFooter && "min-h-[36px]",
                    darkFooter && "bg-background-viewport rounded-b-xl"
                )}
            >
                {footer}
            </div>
        </If>
    </div>
)

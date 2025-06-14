import { MouseEvent, ReactNode, useState } from "react";
import { cn } from "@/utils/utils";

type TabGroupProps = {
    list: {
        id: string;
        name: string;
        tab: ReactNode;
    }[];

    defaultTab?: string;
    height?: string;
}

export const TabGroup = ({ list, defaultTab, height }: TabGroupProps) => {
    const [currentTabId, setCurrentTabId] = useState(defaultTab ?? "");

    const tabToRender = list.filter(tab => tab.id === currentTabId)?.[0]?.tab;
    const fullWidth = list.length === 1;

    const onButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        if (event.currentTarget.dataset.id) {
            setCurrentTabId(event.currentTarget.dataset.id);
        }
    }

    const tabbar = list.map(tab => (
        <button
            className={cn("flex justify-center rounded-t-xl items-center min-w-[10em] bg-background-tabbar px-10 py-2", fullWidth && "w-full")}
            onClick={onButtonClick}
            data-id={tab.id}
            key={tab.id}
        >
            {tab.name}
        </button>
    ));

    return (
        <div className="flex flex-col w-full h-full overflow-hidden" style={{ height }}>
            <div>
                {tabbar}
            </div>

            <div className="grow overflow-hidden">
                {tabToRender}
            </div>
        </div>
    )
}
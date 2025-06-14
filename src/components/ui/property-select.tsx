import { PropsWithChildren, ChangeEvent } from "react";
import TriangleDownIcon from "@/assets/triangle-down.svg?react"

export interface PropertySelectProps {
    onChange: (value: string) => void;
    value: string;
}

export const PropertySelect = ({ children, value, onChange }: PropsWithChildren<PropertySelectProps>) => {
    const onChangeSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        onChange(event.currentTarget.value);
    }

    return (
        <div className="flex p-0 grow overflow-hidden bg-background-1/70 rounded-xl relative">
            <select
                className="outline-none border-none px-4 text-center min-w-12 w-auto grow  h-[30px] bg-transparent appearance-none peer"
                onChange={onChangeSelect}
                value={value}
            >
                {children}
            </select>

            <div className="absolute pointer-events-none right-3 h-full flex items-center -peer-focus:rotate-180">
                <TriangleDownIcon height={16} className="arrow[&_.curve]:" />
            </div>
        </div>
    )
}
import { ChangeEvent, PropsWithChildren } from "react"
import { cn } from "@/utils/utils";

interface CheckmarkProps {
    onChange: (value: boolean) => void;
    value: boolean;
    className?: string;
}

export const Checkmark = ({ value, onChange, className }: CheckmarkProps) => {
    const onCheckmarkChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.currentTarget.checked);
    }

    return (
        <div
            className={cn("inline-flex relative w-[1em] min-w-[1em] h-[1em] min-h-[1em] left-0 top-0 rounded border-2 border-solid border-color-default cursor-pointer", className)}
        >
            <input
                className="hidden invisible absolute [&+svg]:fill-transparent [&:checked+svg]:stroke-color-default"
                onChange={onCheckmarkChange}
                checked={value}
                type="checkbox"
            />

            <svg viewBox="0 0 24 24" className="stroke-[3px] ">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        </div>
    )
}

export const Checkbox = ({ children, value, onChange, className }: PropsWithChildren<CheckmarkProps>) => (
    <label>
        <Checkmark value={value} onChange={onChange} className={className} />
        
        <div className="ml-[0.3em]">
            {children}
        </div>
    </label>
)
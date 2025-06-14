import { ChangeEvent, KeyboardEvent, useState } from "react";
import { If } from "@/components/utils/if";
import { cn } from "@/utils/utils";

export interface PropertyInputProps {
    onChange: (value: number) => void;
    value: number;
    min: number;
    max: number;
    relaxedMax?: number;
    step: number;
}

export const PropertyInput = ({ value, min, max, relaxedMax, step, onChange }: PropertyInputProps) => {
    const [editMode, setEditMode] = useState(false);

    const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(Number(event.currentTarget.value));
    }

    const onEnterEditMode = () => setEditMode(true);

    const onExitEditMode = () => setEditMode(false);

    return (
        <div className="flex p-0 grow overflow-hidden bg-background-1/70 rounded-xl">
            <If condtition={editMode}>
                <CustomInput
                    onExitEditMode={onExitEditMode}
                    onChange={onChange}
                    value={value}
                    min={min}
                    max={relaxedMax ?? max}
                    step={step}
                />
            </If>

            <If condtition={!editMode}>
                <input
                    className={cn(
                        "bg-background-1/70 outline-none border-none px-1 text-center min-w-12 w-auto grow appearance-none cursor-pointer",
                        `
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:bg-background-selectable 
                        [&::-webkit-slider-thumb]:w-4
                        [&::-webkit-slider-thumb]:h-7
                        [&::-webkit-slider-thumb]:hover:brightness-125
                        [&::-webkit-slider-thumb]:border-none
                        [&::-webkit-slider-thumb]:rounded-xl
                        [&::-webkit-slider-thumb]:cursor-ew-resize
                        `,
                        `
                        [&::-moz-range-thumb]:appearance-none
                        [&::-moz-range-thumb]:bg-background-selectable
                        [&::-moz-range-thumb]:w-4
                        [&::-moz-range-thumb]:h-7
                        [&::-moz-range-thumb]:hover:brightness-125
                        [&::-moz-range-thumb]:border-none
                        [&::-moz-range-thumb]:rounded-xl
                        [&::-moz-range-thumb]:cursor-ew-resize
                        `,
                        `
                        [&::-ms-thumb]:appearance-none
                        [&::-ms-thumb]:bg-background-selectable
                        [&::-ms-thumb]:w-4
                        [&::-ms-thumb]:h-7
                        [&::-ms-thumb]:hover:brightness-125
                        [&::-ms-thumb]:border-none
                        [&::-ms-thumb]:rounded-xl
                        [&::-ms-thumb]:cursor-ew-resize
                        `,
                    )}
                    type="range"
                    value={value}
                    min={min}
                    max={max}
                    step={step}
                    onChange={onChangeInput}
                />

                <button
                    className="px-2 h-[30px] w-[80px] border-l-2 border-solid border-background-selectable bg-background-1/70 rounded-r-xl transition-all hover:brightness-150 outline-none cursor-text"
                    onClick={onEnterEditMode}
                >
                    {value}
                </button>
            </If>
        </div>
    )
}

interface CustomInputProps {
    onChange: (value: number) => void;
    onExitEditMode: () => void;
    value: number;
    min: number;
    max: number;
    step: number;
}

const CustomInput = ({ value, min, max, step, onChange, onExitEditMode }: CustomInputProps) => {
    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") {
            onExitEditMode();
        }

        if (event.key === "Enter") {
            const newInput = Number(event.currentTarget.value);
            const isNumber = !isNaN(newInput) && !isNaN(parseFloat(event.currentTarget.value));

            if (isNumber) {
                let newValue = Number(Number(Math.round(newInput / step) * step).toFixed(4));

                if (newValue < min) {
                    newValue = min;
                }

                if (newValue > max) {
                    newValue = max;
                }

                onChange(newValue);
            }

            onExitEditMode();
        }
    }

    return (
        <input
            className="bg-background-1/70 outline-none border-none px-4 text-center min-w-12 w-auto grow h-[30px]"
            type="number"
            defaultValue={value}
            onBlur={onExitEditMode}
            onKeyDown={onKeyDown}
            autoFocus
        />
    )
}
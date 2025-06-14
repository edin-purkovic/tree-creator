import { FormEvent, KeyboardEvent, useState } from "react";
import { If } from "@/components/utils/if";
import { cn } from "@/utils/utils";

import EditIcon from "@/assets/edit.svg?react"

interface InlineEditProps {
    onChange: (value: string) => void;
    value: string;
    className?: string;
    filter?: RegExp
}

export const InlineEdit = ({ value, onChange, className, filter }: InlineEditProps) => {
    const [editMode, setEditMode] = useState(false);
    const [editValue, setEditValue] = useState(value);

    const setToEditable = () => {
        setEditMode(true);
        setEditValue(value);
    };

    const setToText = () => {
        onChange(editValue);
        setEditMode(false);
    };

    const onInputChange = (event: FormEvent<HTMLInputElement>) => {
        setEditValue(event.currentTarget.value)
    }

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") {
            return setEditMode(false);
        }

        if (event.key === "Enter") {
            return setToText();
        }
        
        if (filter) {
            const regex = new RegExp(filter);

            if (regex.test(event.key)) {
                event.preventDefault();
            }
        }
    }

    return (
        <div
            className={cn("p-2 font-bold flex justify-between items-center tracking-wider text-2xl w-full cursor-pointer hover:bg-background-selectable focus-within:bg-background-selectable rounded-md", className)}
            onClick={setToEditable}
        >
            <If condtition={editMode}>
                <input
                    className="w-full bg-transparent border-none outline-none"
                    onChange={onInputChange}
                    onBlur={setToText}
                    onKeyDown={onKeyDown}
                    value={editValue}
                    type="text"
                    autoFocus
                />
            </If>

            <If condtition={!editMode}>
                <div>{value}</div>
            </If>

            <EditIcon height={18} />
        </div>
    )
}
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs))
}

export const ON_CHANGE_NODE_PROPERTY = (nodeIndex: number | null, field: string, updateFunction: (value: any) => void) => {
    if (nodeIndex === null) {
        return () => { };
    }

    return (value: any) => {
        updateFunction((nodes: any) => {
            const newNodeProperties = nodes[nodeIndex].properties as any;
            newNodeProperties[field] = value;
        });
    }
}

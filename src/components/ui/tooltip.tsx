import { cloneElement, ReactElement, useState } from "react";
import { flip, shift, autoUpdate, useFloating, useInteractions, useHover, useRole, Placement } from "@floating-ui/react";

interface TooltipProps {
    children: ReactElement<any>;
    placement?: Placement;
    text?: string;
}

export const Tooltip = ({ children, text, placement }: TooltipProps) => {
    const [open, onOpenChange] = useState(false);

    if (!children) {
        return null;
    }

    const { x, y, refs, strategy: position, context } = useFloating({
        whileElementsMounted: autoUpdate,
        onOpenChange,
        open,
        placement,
        middleware: [flip(), shift({ padding: 8 })],
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        useHover(context),
        useRole(context, { role: "tooltip" }),
    ]);

    const style = { position, top: y, left: x };

    return (
        <>
            {cloneElement(children, getReferenceProps({ ref: refs.setReference, ...children.props }))}
            {open && text && (
                <div
                    {...getFloatingProps({ ref: refs.setFloating, style })}
                    className={"bg-zinc-900 px-4 py-2 absolute color-[#fff] z-[9999] rounded-xl shadow-xl"}
                >
                    {text}
                </div>
            )}
        </>
    );
};

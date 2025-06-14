import { useState, cloneElement, PropsWithChildren } from "react"
import { useFloating, useInteractions, useClick, useRole, useDismiss, FloatingPortal, FloatingOverlay, FloatingFocusManager } from "@floating-ui/react";
import { If } from "@/components/utils/if";

import CloseIcon from "@/assets/close.svg?react"

export const Modal = ({ trigger, children, header, footer }: PropsWithChildren<any>) => {
    const [open, setOpen] = useState(false);

    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);

    const { refs, context } = useFloating({
        onOpenChange: setOpen,
        open,
    });

    const { getFloatingProps } = useInteractions([
        useClick(context),
        useRole(context),
        useDismiss(context),
    ]);

    return (
        <>
            {cloneElement(trigger, { ...trigger.props, onClick: openModal })}

            <FloatingPortal>
                {open && (
                    <FloatingOverlay
                        className={"bg-black/60 grid place-content-center"}
                        lockScroll
                        data-backdrop={true}
                    >
                        <FloatingFocusManager context={context}>
                            <div {...getFloatingProps({
                                className: "w-[800px] max-w-[800px] min-h-[200px] bg-background-0 flex flex-col outline-none rounded-xl shadow-2xl border-2 border-background-1",
                                ref: refs.floating,
                            })}>
                                <If condtition={header}>
                                    <div className="px-6 h-[50px] flex justify-between items-center text-2xl ">
                                        {header}

                                        <button className="bg-background-0 w-[32px] h-[32px] flex justify-center items-center rounded-md hover:bg-background-1" onClick={closeModal}>
                                            <CloseIcon height={14} />
                                        </button>
                                    </div>
                                </If>

                                <div className="p-6">
                                    {children}
                                </div>

                                <If condtition={footer}>
                                    <div className="p-4 flex justify-end gap-2">
                                        {footer}
                                    </div>
                                </If>
                            </div>
                        </FloatingFocusManager>
                    </FloatingOverlay>
                )}
            </FloatingPortal>
        </>
    );
};
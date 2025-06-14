import { PropsWithChildren } from "react";

export const If = ({ children, condtition }: PropsWithChildren<{ condtition: boolean | undefined }>) => {
    if (condtition) {
        return children;
    }

    return null;
}
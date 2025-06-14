import { NodePortDetails, NodeDragType } from "@/components/node-editor/base";

export const nodeEditorHandleOnMouseLeave = (
    setCreateConnectionStart: (value: NodePortDetails | null) => void,
    createConnectionStart: NodePortDetails | null,
    setDragging: (value: NodeDragType | null) => void,
    dragging: NodeDragType | null,
    setDraggingTresholdPassed: (value: boolean) => void,
) => {
    if (dragging) {
        setDragging(null);
        setDraggingTresholdPassed(false);
    }

    if (createConnectionStart) {
        setCreateConnectionStart(null);
    }
}

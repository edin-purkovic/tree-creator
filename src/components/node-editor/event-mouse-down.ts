import { NodePosition2D, NodePortDetails, NodeDragType } from "@/components/node-editor/base";

export const nodeEditorHandleOnMouseDown = (
    event: any,
    onPortClick: (port: NodePortDetails) => void,
    setCreateConnectionStart: (value: NodePortDetails) => void,
    createConnectionStart: NodePortDetails | null,
    setDragging: (value: NodeDragType) => void,
    dragging: NodeDragType | null,
    containerRef: any,
    viewPosition: NodePosition2D,
) => {
    if (dragging || createConnectionStart) {
        return;
    }

    if (event.target?.dataset?.type === "port") {
        const portDetails: NodePortDetails = {
            nodeId: event.target.dataset.id,
            nodeType: event.target.dataset.nodeType,
            type: event.target.dataset.portType,
            position: {
                x: Number(event.target.dataset.px),
                y: Number(event.target.dataset.py),
            },
        };

        setCreateConnectionStart(portDetails);

        if (onPortClick) {
            onPortClick(portDetails);
        }
    }

    if (event.target?.dataset?.type === "node") {
        const targetRect = event.target.getBoundingClientRect();

        setDragging({
            id: event.target.dataset.id,
            index: event.target.dataset.index,
            type: "node",
            cursor: {
                x: Math.round(event.clientX - targetRect.left),
                y: Math.round(event.clientY - targetRect.top),
            },
            start: {
                x: Number(event.target.dataset.px),
                y: Number(event.target.dataset.py),
            }
        });
    }

    if (event.target?.dataset?.type === "view" && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();

        setDragging({
            id: "view",
            index: 0,
            type: "view",
            cursor: {
                x: event.clientX + viewPosition.x - containerRect.left,
                y: event.clientY + viewPosition.y - containerRect.top,
            },
            start: viewPosition
        });
    }
}

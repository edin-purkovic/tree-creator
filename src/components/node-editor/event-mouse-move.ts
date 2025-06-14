import { MouseEvent } from "react";
import { NodeBaseProps, NodePosition2D, NodePortDetails, NodeDragType } from "@/components/node-editor/base";

export const nodeEditorHandleOnMouseMove = (
    event: MouseEvent<SVGSVGElement>,
    width: number,
    height: number,
    createConnectionStart: NodePortDetails | null,
    setCreateConnectionEnd: (position: NodePosition2D | null) => void,
    setDraggingTresholdPassed: (value: boolean) => void,
    onNodesChange: (nodes: NodeBaseProps[]) => void,
    nodes: NodeBaseProps[],
    dragging: NodeDragType | null,
    setViewPosition: (position: NodePosition2D) => void,
    viewPosition: NodePosition2D,
    gridSnap: boolean | undefined,
    gridSize: number | undefined,
    svgRef: any,
) => {
    if (!svgRef.current) {
        return;
    }

    if (createConnectionStart) {
        const svgRect = svgRef.current.getBoundingClientRect();

        let svgX = event.clientX - svgRect.left;
        let svgY = event.clientY - svgRect.top;

        const viewBoxX = svgX * width / svgRect.width;
        const viewBoxY = svgY * height / svgRect.height;

        setCreateConnectionEnd({
            x: viewBoxX + viewPosition.x,
            y: viewBoxY + viewPosition.y
        });
    }

    if (!dragging) {
        return;
    }

    if (dragging.type === "node") {
        const svgRect = svgRef.current.getBoundingClientRect();

        let svgX = event.clientX - svgRect.left - dragging.cursor.x;
        let svgY = event.clientY - svgRect.top - dragging.cursor.y;

        if (gridSnap && gridSize) {
            svgX = Math.round(svgX / gridSize) * gridSize;
            svgY = Math.round(svgY / gridSize) * gridSize;
        }

        const viewBoxX = svgX * width / svgRect.width;
        const viewBoxY = svgY * height / svgRect.height;
        const finalX = Math.round(viewBoxX + viewPosition.x);
        const finalY = Math.round(viewBoxY + viewPosition.y);

        const newNodes = JSON.parse(JSON.stringify(nodes));
        newNodes[dragging.index].position = { x: finalX, y: finalY };

        if (dragging.start.x !== finalX || dragging.start.y !== finalY) {
            setDraggingTresholdPassed(true);
            onNodesChange(newNodes);
        }
    }

    if (dragging.type === "view") {
        const svgRect = svgRef.current.getBoundingClientRect();

        let svgX = event.clientX - svgRect.left - dragging.cursor.x;
        let svgY = event.clientY - svgRect.top - dragging.cursor.y;

        if (gridSnap && gridSize) {
            const halfGridSize = gridSize / 2;
            svgX = Math.round(svgX / halfGridSize) * halfGridSize;
            svgY = Math.round(svgY / halfGridSize) * halfGridSize;
        }

        const viewBoxX = svgX * width / svgRect.width;
        const viewBoxY = svgY * height / svgRect.height;

        setViewPosition({ x: -viewBoxX, y: -viewBoxY });
    }
}
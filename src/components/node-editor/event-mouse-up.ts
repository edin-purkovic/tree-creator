import { findNodeById, hasNodeConnectionCyclicReferences } from "@/components/node-editor/node-utils";
import { NodeBaseProps, NodePosition2D, NodePortDetails, NodeTypeDefinitionObject, NodeDragType } from "@/components/node-editor/base";

export const nodeEditorHandleOnMouseUp = (
    event: any,
    setCreateConnectionStart: (value: NodePortDetails | null) => void,
    createConnectionStart: NodePortDetails | null,
    setCreateConnectionEnd: (position: NodePosition2D | null) => void,
    setDragging: (value: NodeDragType | null) => void,
    dragging: NodeDragType | null,
    setDraggingTresholdPassed: (value: boolean) => void,
    draggingTresholdPassed: boolean,
    onNodeClick: (nodeId: string) => void,
    onNodesChange: (nodes: NodeBaseProps[]) => void,
    nodes: NodeBaseProps[],
    typeDefinitions: NodeTypeDefinitionObject | undefined,
) => {
    if (dragging) {
        if (!draggingTresholdPassed && dragging.type === "node" && onNodeClick) {
            onNodeClick(dragging.id);
        }

        setDragging(null);
        setDraggingTresholdPassed(false);
    }

    if (createConnectionStart) {
        const endType = event.target.dataset.type;
        const endPortType = event.target.dataset.portType;
        let startNodeId: string | null = null;
        let startNodeType: string = "_";
        let endNodeId: string | null = null;
        let endNodeType: string = "_";

        if (endType === "port") {
            if (createConnectionStart.type === "out" && endPortType === "in") {
                startNodeId = createConnectionStart.nodeId;
                startNodeType = createConnectionStart.nodeType;
                endNodeId = event.target.dataset.id as string;
                endNodeType = event.target.dataset.nodeType as string;
            }

            if (createConnectionStart.type === "in" && endPortType === "out") {
                startNodeId = event.target.dataset.id as string;
                startNodeType = event.target.dataset.nodeType as string;
                endNodeId = createConnectionStart.nodeId;
                endNodeType = createConnectionStart.nodeType;
            }
        }

        if (endType === "node") {
            if (createConnectionStart.type === "out") {
                startNodeId = createConnectionStart.nodeId;
                startNodeType = createConnectionStart.nodeType;
                endNodeId = event.target.dataset.id as string;
                endNodeType = event.target.dataset.nodeType as string;
            }

            if (createConnectionStart.type === "in") {
                startNodeId = event.target.dataset.id as string;
                startNodeType = event.target.dataset.nodeType as string;
                endNodeId = createConnectionStart.nodeId;
                endNodeType = createConnectionStart.nodeType;
            }
        }

        if (startNodeId && endNodeId) {
            let denyConnection = false;

            const startTypeDefinitions = typeDefinitions?.[startNodeType];
            const endTypeDefinitions = typeDefinitions?.[endNodeType];

            if (startTypeDefinitions?.outPortTypes?.length && endTypeDefinitions?.inPortTypes?.length) {
                if (!startTypeDefinitions.outPortTypes?.includes(endNodeType) || !endTypeDefinitions.inPortTypes?.includes(startNodeType)) {
                    denyConnection = true;
                }
            }

            const cyclic = hasNodeConnectionCyclicReferences(nodes, { from: startNodeId, to: endNodeId });

            if (!cyclic && !denyConnection) {
                const newNodes = JSON.parse(JSON.stringify(nodes));
                const node = findNodeById(newNodes, startNodeId);

                if (!node?.connectedTo?.includes(endNodeId)) {
                    node?.connectedTo?.push(endNodeId);
                    onNodesChange(newNodes);
                }
            }
        }

        setCreateConnectionStart(null);
        setCreateConnectionEnd(null);
    }
}
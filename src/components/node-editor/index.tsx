import { MouseEvent, useEffect, useRef, useState } from "react";
import { areNodeConnectionsEqual, findNodeById } from "@/components/node-editor/node-utils";
import { NodeCurve } from "@/components/node-editor/node-curve";
import { NodeInternal } from "@/components/node-editor/node-internal";
import { nodeEditorHandleOnMouseUp } from "./event-mouse-up";
import { nodeEditorHandleOnMouseMove } from "./event-mouse-move";
import { nodeEditorHandleOnMouseDown } from "./event-mouse-down";
import { nodeEditorHandleOnMouseLeave } from "./event-mouse-leave";
import {
    NodeBaseProps,
    NodeConnection,
    NodePosition2D,
    NodePortDetails,
    NodeEditorActiveItem,
    NodeTypeDefinitionObject,
    NodeConnectionDetils,
    NodeDragType,
    NODE_DEFAULT_TYPE_DEFINTIONS
} from "@/components/node-editor/base";
import { If } from "@/components/utils/if";

interface NodeEditor {
    onChange: (nodes: NodeBaseProps[]) => void;
    onChangeViewport?: (position: NodePosition2D) => void;
    onNodeClick?: (id: string) => void;
    onPortClick?: (port: NodePortDetails) => void;
    onConnectionClick?: (connection: NodeConnection) => void;
    nodes: NodeBaseProps[];
    width: number;
    height: number;
    gridSnap?: boolean;
    gridSize?: number;
    activeItem?: NodeEditorActiveItem | null | undefined;
    typeDefinitions?: NodeTypeDefinitionObject;
}

export const NodeEditor = ({
    onChange,
    onNodeClick,
    onPortClick,
    onConnectionClick,
    nodes,
    width,
    height,
    gridSnap,
    gridSize,
    activeItem,
    typeDefinitions
}: NodeEditor) => {
    const [viewPosition, setViewPosition] = useState<NodePosition2D>({ x: 0, y: 0 });
    const [dragging, setDragging] = useState<NodeDragType | null>(null);
    const [draggingTresholdPassed, setDraggingTresholdPassed] = useState<boolean>(false);
    const [createConnectionStart, setCreateConnectionStart] = useState<NodePortDetails | null>(null);
    const [createConnectionEnd, setCreateConnectionEnd] = useState<NodePosition2D | null>(null);
    const [visible, setVisible] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        setVisible(true);
    }, [containerRef.current])

    const onMouseDown = (event: any) => nodeEditorHandleOnMouseDown(
        event,
        onPortClick ?? ON_PORT_CLICK_EMPTY,
        setCreateConnectionStart, createConnectionStart,
        setDragging, dragging,
        containerRef,
        viewPosition,
    );

    const onMouseMove = (event: any) => nodeEditorHandleOnMouseMove(
        event,
        width, height,
        createConnectionStart,
        setCreateConnectionEnd,
        setDraggingTresholdPassed,
        onChange, nodes,
        dragging,
        setViewPosition, viewPosition,
        gridSnap, gridSize,
        svgRef,
    );

    const onMouseUp = (event: any) => nodeEditorHandleOnMouseUp(
        event,
        setCreateConnectionStart, createConnectionStart,
        setCreateConnectionEnd,
        setDragging, dragging,
        setDraggingTresholdPassed, draggingTresholdPassed,
        onNodeClick ?? ON_NODE_CLICK_EMPTY,
        onChange, nodes,
        typeDefinitions,
    );

    const onMouseLeave = () => nodeEditorHandleOnMouseLeave(
        setCreateConnectionStart,
        createConnectionStart,
        setDragging,
        dragging,
        setDraggingTresholdPassed,
    );

    const onContextMenu = (event: MouseEvent<SVGSVGElement>) => {
        event.preventDefault();
    };

    const { activeNode, activeConnection } = getActiveItem(activeItem);

    const connectionInstructions = generateConnectionInstructions(createConnectionStart, createConnectionEnd);
    const connections = generateNodeConnectionsDetails(nodes);

    const renderConnections = connections.map((connection: NodeConnectionDetils, index: number) => (
        <NodeCurve
            onClick={onConnectionClick}
            active={areNodeConnectionsEqual(connection.ids, activeConnection)}
            connection={connection}
            key={index}
        />
    ));

    const renderNodes = nodes.map((node: NodeBaseProps, index) => (
        <NodeInternal
            {...node}
            state={draggingTresholdPassed && dragging?.id === node.id ? "dragging" : "idle"}
            typeDefinition={typeDefinitions?.[node.type] ?? NODE_DEFAULT_TYPE_DEFINTIONS}
            active={node.id === activeNode}
            index={index}
            key={node.id}
        />
    ));

    return (
        <div ref={containerRef} className="w-full h-full relative object-fill">
            <If condtition={visible}>
                <svg
                    className="bg-background-0"
                    style={{
                        backgroundImage: "radial-gradient(#313131 2px, transparent 0)",
                        backgroundPosition: `${-viewPosition.x}px ${-viewPosition.y}px`,
                        backgroundSize: `${gridSize}px ${gridSize}px`,
                    }}

                    viewBox={`${viewPosition.x} ${viewPosition.y} ${width} ${height}`}
                    width={width}

                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onMouseMove={onMouseMove}
                    onMouseLeave={onMouseLeave}
                    onContextMenu={onContextMenu}

                    data-type="view"
                    ref={svgRef}
                    scale={1}
                >
                    {renderConnections}

                    {renderNodes}

                    <If condtition={!!createConnectionStart && !!connectionInstructions}>
                        <path
                            d={connectionInstructions}
                            fill="none"
                            stroke="#f1f1f1"
                            strokeWidth={2}
                            className="pointer-events-none"
                        />
                    </If>
                </svg>
            </If>
        </div>
    )
}

const getActiveItem = (activeItem: NodeEditorActiveItem | null | undefined) => {
    let activeNode: string | null = null;
    let activeConnection: NodeConnection | null = null;

    if (activeItem?.type === "node") {
        activeNode = activeItem.target as string;
    } else if (activeItem?.type === "connection") {
        activeConnection = activeItem.target as NodeConnection;
    }

    return { activeNode, activeConnection };
}

const generateConnectionInstructions = (connectionStart: NodePortDetails | null, connectionEnd: NodePosition2D | null) => {
    let createConnectionInstructions = undefined;
    
    if (connectionStart && connectionEnd) {
        const from = connectionStart?.position;
        const to = connectionEnd;

        createConnectionInstructions = `
            M ${from.x},${from.y}
            C ${from.x + 60},${from.y} ${to.x - 60},${to.y} ${to.x},${to.y}
        `;
    }

    return createConnectionInstructions;
}

const generateNodeConnectionsDetails = (nodes: NodeBaseProps[]) => {
    const connections: NodeConnectionDetils[] = [];
    const nodeWidth = 50;
    const nodeHeight = 50;

    for (let i = 0; i < nodes.length; i++) {
        const sourceNode = nodes[i];

        if (sourceNode && sourceNode.connectedTo) {
            for (let j = 0; j < sourceNode.connectedTo.length; j++) {
                const otherNodeId = sourceNode.connectedTo[j];
                const destinationNode = findNodeById(nodes, otherNodeId);

                if (destinationNode) {
                    connections.push({
                        positions: {
                            from: {
                                x: sourceNode.position.x + nodeWidth,
                                y: sourceNode.position.y + nodeHeight / 2,
                            },
                            to: {
                                x: destinationNode.position.x,
                                y: destinationNode.position.y + nodeHeight / 2,
                            },
                        },
                        ids: {
                            from: sourceNode.id,
                            to: destinationNode.id,
                        }
                    })
                }
            }
        }
    }

    return connections;
}

const ON_PORT_CLICK_EMPTY = (_port: NodePortDetails) => { }

const ON_NODE_CLICK_EMPTY = (_nodeId: string) => { }

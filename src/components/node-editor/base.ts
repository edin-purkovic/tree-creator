import { ReactNode } from "react";

export type NodePosition2D = {
    x: number;
    y: number;
}

export type NodeLinePosition2D = {
    from: NodePosition2D;
    to: NodePosition2D;
}

export type NodeTypeDefinition = {
    width: number;
    height: number;
    content?: ReactNode;
    className?: string;
    inPort?: boolean;
    inPortTypes?: string[];
    outPort?: boolean;
    outPortTypes?: string[];
}

export type NodeTypeDefinitionObject = {
    [type: string]: NodeTypeDefinition;
}

export interface NodeBaseProps {
    id: string;
    type: string;
    name?: string;
    enabled?: boolean;
    position: NodePosition2D;
    connectedTo?: string[];
    content?: ReactNode;
    properties?: any;
}

export type NodeConnection = {
    from: string;
    to: string;
}

export type NodeConnectionDetils = {
    ids: NodeConnection,
    positions: NodeLinePosition2D;
}

export type NodeEditorActiveItem = {
    target: string | NodeConnection;
    type: "node" | "connection";
}

export type NodePortDetails = {
    nodeId: string;
    nodeType: string;
    position: NodePosition2D;
    type: "in" | "out";
}

export type NodeDragType = {
    id: string;
    index: number;
    type: string;
    cursor: NodePosition2D;
    start: NodePosition2D;
}

export const NODE_DEFAULT_TYPE_DEFINTIONS: NodeTypeDefinition = {
    width: 50,
    height: 50,
}

import { NodeBaseProps, NodeConnection } from "@/components/node-editor/base";

export const findNodeIndex = (nodes: NodeBaseProps[], nodeId: string | null): number | false => {
    if (nodeId !== null) {
        for (let index = 0; index < nodes.length; index++) {
            if (nodes[index].id === nodeId) {
                return index;
            }
        }
    }

    return false;
}

export const findNodeById = (nodes: NodeBaseProps[], nodeId: string): NodeBaseProps | null => {
    for (let index = 0; index < nodes.length; index++) {
        if (nodes[index].id === nodeId) {
            return nodes[index];
        }
    }

    return null;
}

export const deleteNodeById = (nodes: NodeBaseProps[], nodeId: string): boolean => {
    const nodeIndex = findNodeIndex(nodes, nodeId);

    if (nodeIndex !== false) {
        deleteNodeConnections(nodes, nodeIndex);

        nodes.splice(nodeIndex, 1);

        return true;
    }

    return false;
}

export type NodeMap = Map<string, NodeBaseProps>;

export const nodesToMap = (nodes: NodeBaseProps[]): NodeMap => {
    const nodeMap = new Map<string, NodeBaseProps>();

    for (let index = nodes.length; index--;) {
        const node = nodes[index];

        nodeMap.set(node.id, node);
    }

    return nodeMap;
}

export const deleteNodeConnections = (nodes: NodeBaseProps[], nodeIndex: number | false): boolean => {
    if (nodeIndex !== false) {
        const node = nodes[nodeIndex];

        for (let index = 0; index < nodes.length; index++) {
            const parentNode = nodes[index];
            const connectionIndex = parentNode.connectedTo?.indexOf(node.id);

            if (connectionIndex !== undefined && connectionIndex !== -1) {
                parentNode.connectedTo?.splice(connectionIndex, 1);
            }
        }

        node.connectedTo = [];

        return true;
    }

    return false;
}

export const deleteNodeConnection = (nodes: NodeBaseProps[], conncetion: NodeConnection): boolean => {
    if (conncetion.from && conncetion.to) {
        for (let index = 0; index < nodes.length; index++) {
            const node = nodes[index];

            if (node.id === conncetion.from) {
                const toIndex = node.connectedTo?.indexOf(conncetion.to);

                if (toIndex === undefined || toIndex === -1) {
                    return false;
                }

                node.connectedTo?.splice(toIndex, 1);
                return true;
            }
        }
    }

    return false;
}

export const hasNodeConnectionCyclicReferences = (nodes: NodeBaseProps[], conncetion: NodeConnection) => {
    if (conncetion.from === conncetion.to) {
        return true;
    }

    const nodeMap = nodesToMap(nodes);
    const response = { cyclic: false };

    hasNodeConnectionCyclicReferencesInternal(nodeMap, conncetion.to, conncetion.from, response);

    return response.cyclic;
}

const hasNodeConnectionCyclicReferencesInternal = (nodeMap: NodeMap, nodeId: string, nodeIdToCheck: string, response: { cyclic: boolean }) => {
    const node = nodeMap.get(nodeId);

    if (node) {
        for (let index = node.connectedTo?.length ?? 0; index--;) {
            const nextNodeId = node.connectedTo?.[index] as string;

            if (nextNodeId === nodeIdToCheck) {
                response.cyclic = true;
                return;
            }

            hasNodeConnectionCyclicReferencesInternal(nodeMap, nextNodeId, nodeIdToCheck, response);
        }
    }
}

export const areNodeConnectionsEqual = (first: NodeConnection | null, second: NodeConnection | null) => {
    if (!first?.from || !second?.to) {
        return false;
    }

    if (first.from !== second.from || first.to !== second.to) {
        return false;
    }

    return true;
}
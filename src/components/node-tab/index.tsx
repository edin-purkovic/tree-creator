import { useEffect, useRef, useState } from "react"
import { useAtom } from 'jotai';
import { Tab } from "@/components/ui/tab"
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { NodeEditor } from "@/components/node-editor";
import { NodeBaseProps, NodeConnection, NodeTypeDefinitionObject } from "@/components/node-editor/base";
import { deleteNodeById, deleteNodeConnection } from "@/components/node-editor/node-utils";
import { addBranchNode, addLeavesNode, addTrunkNode, NODE_DEFAULT_TYPE_DEFINTIONS } from "@/components/node-tab/utils";
import { nodeDataAtom, selectedItemAtom } from '@/store';
import { If } from "@/components/utils/if";

import TreeIcon from "@/assets/tree.svg?react"
import TrunkIcon from "@/assets/trunk.svg?react"
import BranchIcon from "@/assets/branch.svg?react"
import LeavesIcon from "@/assets/leaves.svg?react"
import DeleteIcon from "@/assets/delete.svg?react"

const NodeEditorTab = () => {
    const canvasRef = useRef(null);
    const [nodes, setNodes] = useAtom(nodeDataAtom)
    const [selectedItem, setSelectedItem] = useAtom(selectedItemAtom)
    const [showEditor, setShowEditor] = useState(false);

    useEffect(() => { setShowEditor(true); }, [canvasRef.current]);

    const onClickAddTrunkNode = () => {
        setNodes((nodeList: NodeBaseProps[]) => addTrunkNode(nodeList));
    }

    const onClickAddBranchNode = () => {
        setNodes((nodeList: NodeBaseProps[]) => addBranchNode(nodeList));
    }

    const onClickAddLeavesNode = () => {
        setNodes((nodeList: NodeBaseProps[]) => addLeavesNode(nodeList));
    }

    const deleteSelectedNode = () => {
        if (selectedItem && selectedItem.type === "node" && selectedItem.target !== "tree") {
            setNodes((nodeList: NodeBaseProps[]) => {
                deleteNodeById(nodeList, selectedItem.target as string)
            });
        }

        setSelectedItem({ target: "tree", type: "node" });
    }

    const deleteSelectedConnection = () => {
        if (selectedItem && selectedItem.type === "connection") {
            setNodes((nd: NodeBaseProps[]) => {
                deleteNodeConnection(nd, selectedItem.target as NodeConnection)
            });

            setSelectedItem(null);
        }
    }

    const onNodeClick = (nodeId: string) => {
        setSelectedItem({ target: nodeId, type: "node" });
    }

    const onConnectionClick = (connection: NodeConnection) => {
        setSelectedItem({ target: connection, type: "connection" });
    }

    const header = (
        <ButtonGroup>
            <Button onClick={onClickAddTrunkNode} tooltip="Add Trunk Node" icon>
                <TrunkIcon height={18} />
            </Button>

            <Button onClick={onClickAddBranchNode} tooltip="Add Branch Node" icon>
                <BranchIcon height={18} />
            </Button>

            <Button onClick={onClickAddLeavesNode} tooltip="Add Leaves Node" icon>
                <LeavesIcon height={18} />
            </Button>
        </ButtonGroup>
    );

    const footer = (
        <>
            <ButtonGroup />

            <ButtonGroup right>
                <If condtition={!!selectedItem && selectedItem.type === "node" && selectedItem.target !== "tree"}>
                    <Button onClick={deleteSelectedNode} danger>
                        Delete Node <DeleteIcon height={16} />
                    </Button>
                </If>

                <If condtition={!!selectedItem && selectedItem.type === "connection"}>
                    <Button onClick={deleteSelectedConnection} danger>
                        Delete Connection <DeleteIcon height={16} />
                    </Button>
                </If>
            </ButtonGroup>

        </>
    );

    return (
        <Tab header={header} footer={footer} smallFooter>
            <div className="w-full h-full relative" ref={canvasRef}>
                <div className="w-full h-full absolute bg-background-0">
                    <If condtition={showEditor}>
                        <NodeEditor
                            nodes={nodes}
                            onChange={setNodes}
                            onNodeClick={onNodeClick}
                            onConnectionClick={onConnectionClick}
                            width={(canvasRef.current as any)?.clientWidth ?? 100}
                            typeDefinitions={NODE_TYPE_DEFINITIONS}
                            activeItem={selectedItem}
                            height={300}
                            gridSize={20}
                            gridSnap
                            key={canvasRef.current ? "0" : "1"}
                        />
                    </If>
                </div>
            </div>
        </Tab>
    )
}

export const NODE_TYPE_DEFINITIONS: NodeTypeDefinitionObject = {
    "tree": {
        outPortTypes: ["trunk"],
        outPort: true,
        content: <TreeIcon width={32} height={32} />,
        ...NODE_DEFAULT_TYPE_DEFINTIONS,
    },
    "trunk": {
        inPort: true,
        inPortTypes: ["tree"],
        outPort: true,
        outPortTypes: ["branch", "leaves", "additional"],
        content: <TrunkIcon width={32} height={32} />,
        ...NODE_DEFAULT_TYPE_DEFINTIONS,
    },
    "branch": {
        inPort: true,
        inPortTypes: ["trunk", "branch"],
        outPort: true,
        outPortTypes: ["branch", "leaves", "additional"],
        content: <BranchIcon width={32} height={32} />,
        ...NODE_DEFAULT_TYPE_DEFINTIONS,
    },
    "leaves": {
        inPort: true,
        inPortTypes: ["trunk", "branch"],
        content: <LeavesIcon width={32} height={32} />,
        ...NODE_DEFAULT_TYPE_DEFINTIONS,
    },
}

export { NodeEditorTab }

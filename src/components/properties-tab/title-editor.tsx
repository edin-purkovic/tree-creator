import { useAtom } from "jotai";
import { InlineEdit } from "@/components/ui/inline-edit";
import { Checkmark } from "@/components/ui/checkbox";
import { NodeBaseProps } from "@/components/node-editor/base";
import { nodeDataAtom } from "@/store";

export const TitleEditor = ({ selectedNodeIndex }: { selectedNodeIndex: number }) => {
    const [nodeData, setNodeData] = useAtom(nodeDataAtom);
    const node = nodeData[selectedNodeIndex];

    const onChangeName = (name: string) => {
        setNodeData((nodes: NodeBaseProps[]) => { nodes[selectedNodeIndex].name = name });
    }

    const onChangeEnabled = (name: boolean) => {
        setNodeData((nodes: NodeBaseProps[]) => { nodes[selectedNodeIndex].enabled = name });
    }

    return (
        <div className="flex justify-center items-center w-full text-2xl pr-2">
            <label className="p-3 hover:bg-background-selectable active:bg-background-0/40 rounded-md aspect-square h-[36px] mr-1 flex justify-center items-center cursor-pointer">
                <Checkmark
                    onChange={onChangeEnabled}
                    value={node.enabled ?? false}
                />
            </label>

            <InlineEdit
                onChange={onChangeName}
                value={node.name ?? ""}
                filter={/[^a-z\d\-]/ig}
                className="grow"
            />
        </div>
    )
}

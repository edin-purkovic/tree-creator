import { useAtom } from "jotai";
import { nodeDataAtom } from "@/store";
import { BranchGeneratorParameters } from "@/generator/branch";
import { PropertyField } from "@/components/ui/property-field";
import { PropertyInput } from "@/components/ui/property-input";
import { PropertyGroup } from "@/components/ui/property-group";
import { ON_CHANGE_NODE_PROPERTY } from "@/utils/utils";

export const TabTree = ({selectedNodeIndex} : { selectedNodeIndex: number}) => {
    const [nodeData, setNodeData] = useAtom(nodeDataAtom);

    const node = nodeData[selectedNodeIndex];
    const nodeProperties = node.properties as BranchGeneratorParameters;

    const onChangeSeed = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "seed", setNodeData);

    return (
        <div className="h-full overflow-x-hidden overflow-y-auto">
            <PropertyGroup>
                <PropertyField label="Seed" >
                    <PropertyInput onChange={onChangeSeed} value={nodeProperties.seed} min={0} max={100} step={1} />
                </PropertyField>
            </PropertyGroup>
        </div>
    )
}
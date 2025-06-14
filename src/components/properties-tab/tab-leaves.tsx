import { useAtom } from "jotai";
import { PropertyField } from "@/components/ui/property-field";
import { PropertyInput } from "@/components/ui/property-input";
import { PropertySplineEditor } from "@/components/ui/property-spline";
import { PropertyGroup } from "@/components/ui/property-group";
import { LeavesGeneratorParameters } from "@/generator/leaves";
import { ON_CHANGE_NODE_PROPERTY } from "@/utils/utils";
import { nodeDataAtom } from "@/store";

export const TabLeaves = ({ selectedNodeIndex }: { selectedNodeIndex: number }) => {
    const [nodeData, setNodeData] = useAtom(nodeDataAtom);

    const node = nodeData[selectedNodeIndex];
    const nodeProperties = node.properties as LeavesGeneratorParameters;

    const onChangeCount = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "count", setNodeData);
    const onChangeAngle = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "angle", setNodeData);
    const onChangeLength = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "length", setNodeData);
    const onChangeWidth = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "width", setNodeData);
    const onChangePositionCurve = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "positionCurveParameters", setNodeData);
    const onChangeStartU = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "startU", setNodeData);
    const onChangeStartV = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "startV", setNodeData);
    const onChangeEndU = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "endU", setNodeData);
    const onChangeEndV = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "endV", setNodeData);

    return (
        <div className="h-full overflow-x-hidden overflow-y-auto">
            <PropertyGroup>
                <PropertyField label="Count">
                    <PropertyInput onChange={onChangeCount} value={nodeProperties.count} min={0} max={100} step={1} />
                </PropertyField>
            </PropertyGroup>

            <PropertyGroup>

                <PropertyField label="Initial Angle">
                    <PropertyInput onChange={onChangeAngle} value={nodeProperties.angle} min={-100} max={100} step={1} />
                </PropertyField>
            </PropertyGroup>

            <PropertyGroup>
                <PropertyField label="Length / Width">
                    <PropertyInput onChange={onChangeLength} value={nodeProperties.length} min={.2} max={3} step={.2} />
                    <PropertyInput onChange={onChangeWidth} value={nodeProperties.width} min={.2} max={3} step={.2} />
                </PropertyField>
            </PropertyGroup>

            <PropertyGroup>
                <PropertyField label="Position Curve" column>
                    <PropertySplineEditor onChange={onChangePositionCurve} value={nodeProperties.positionCurveParameters} />
                </PropertyField>
            </PropertyGroup>

            <PropertyGroup>
                <PropertyField label="Texture Start U / V">
                    <PropertyInput onChange={onChangeStartU} value={nodeProperties.startU} min={0} max={1} step={.1} />
                    <PropertyInput onChange={onChangeStartV} value={nodeProperties.startV} min={0} max={1} step={.1} />
                </PropertyField>
                <PropertyField label="Texture End U / V">
                    <PropertyInput onChange={onChangeEndU} value={nodeProperties.endU} min={0} max={1} step={.1} />
                    <PropertyInput onChange={onChangeEndV} value={nodeProperties.endV} min={0} max={1} step={.1} />
                </PropertyField>
            </PropertyGroup>
        </div>
    )
}
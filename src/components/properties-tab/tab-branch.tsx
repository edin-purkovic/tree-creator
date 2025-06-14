import { useAtom } from "jotai";
import { BranchGeneratorParameters } from "@/generator/branch";
import { PropertyGroup } from "@/components/ui/property-group";
import { PropertyField } from "@/components/ui/property-field";
import { PropertyInput } from "@/components/ui/property-input";
import { PropertySplineEditor } from "@/components/ui/property-spline";
import { ON_CHANGE_NODE_PROPERTY } from "@/utils/utils";
import { nodeDataAtom } from "@/store";

export const TabBranch = ({selectedNodeIndex} : { selectedNodeIndex: number}) => {
    const [nodeData, setNodeData] = useAtom(nodeDataAtom);

    const node = nodeData[selectedNodeIndex];
    const nodeProperties = node.properties as BranchGeneratorParameters;

    const onChangeCount = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "count", setNodeData);
    const onChangeSegments = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "segments", setNodeData);
    const onChangeSegmentMultiplier = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "segmentsMultiplier", setNodeData);
    const onChangeSides = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "sides", setNodeData);
    const onChangeGravity = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "gravity", setNodeData);
    const onChangePull = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "pull", setNodeData);
    const onChangeAngle = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "angle", setNodeData);
    const onChangePositionCurve = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "positionCurveParameters", setNodeData);
    const onChangeLength = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "length", setNodeData);
    const onChangeLengthCurve = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "lengthCurveParameters", setNodeData);
    const onChangeRadiusScale = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "radiusScale", setNodeData);
    const onChangeRadiusCurve = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "radiusCurveParameters", setNodeData);
    const onChangeTurbulence = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "turbulence", setNodeData);
    const onChangeTwist = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "twist", setNodeData);
    const onChangeScaleU = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "scaleU", setNodeData);
    const onChangeScaleV = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "scaleV", setNodeData);
    const onChangeCapOffset = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "capOffset", setNodeData);

    return (
        <div className="h-full overflow-x-hidden overflow-y-auto">
            <PropertyGroup>
                <PropertyField label="Count">
                    <PropertyInput onChange={onChangeCount} value={nodeProperties.count} min={0} max={100} step={1} />
                </PropertyField>
            </PropertyGroup>

            <PropertyGroup>
                <PropertyField label="Gravity">
                    <PropertyInput onChange={onChangeGravity} value={nodeProperties.gravity} min={-50} max={50} step={5} />
                </PropertyField>

                <PropertyField label="Pull">
                    <PropertyInput onChange={onChangePull} value={nodeProperties.pull} min={-2} max={2} step={.1} />
                </PropertyField>

                <PropertyField label="Initial Angle">
                    <PropertyInput onChange={onChangeAngle} value={nodeProperties.angle} min={-100} max={100} step={1} />
                </PropertyField>

                <PropertyField label="Turbulence" >
                    <PropertyInput onChange={onChangeTurbulence} value={nodeProperties.turbulence} min={0} max={2} step={.05} />
                </PropertyField>

                <PropertyField label="Twist">
                    <PropertyInput onChange={onChangeTwist} value={nodeProperties.twist} min={0} max={360} step={15} />
                </PropertyField>
            </PropertyGroup>
            
            <PropertyGroup>
                <PropertyField label="Length">
                    <PropertyInput onChange={onChangeLength} value={nodeProperties.length} min={.1} max={15} step={.1} />
                </PropertyField>

                <PropertyField label="Length Curve" column>
                    <PropertySplineEditor onChange={onChangeLengthCurve} value={nodeProperties.lengthCurveParameters} />
                </PropertyField>
            </PropertyGroup>

            <PropertyGroup>
                <PropertyField label="Position Curve" column>
                    <PropertySplineEditor onChange={onChangePositionCurve} value={nodeProperties.positionCurveParameters} />
                </PropertyField>
            </PropertyGroup>

            <PropertyGroup>
                <PropertyField label="Radius Scale">
                    <PropertyInput onChange={onChangeRadiusScale} value={nodeProperties.radiusScale} min={.1} max={10} step={.1} />
                </PropertyField>

                <PropertyField label="Radius Curve" column>
                    <PropertySplineEditor onChange={onChangeRadiusCurve} value={nodeProperties.radiusCurveParameters} />
                </PropertyField>
            </PropertyGroup>

            <PropertyGroup>
                <PropertyField label="Segments / Multiplier">
                    <PropertyInput onChange={onChangeSegments} value={nodeProperties.segments} min={1} max={50} step={1} />
                    <PropertyInput onChange={onChangeSegmentMultiplier} value={nodeProperties.segmentsMultiplier} min={1} max={50} step={1} />
                </PropertyField>

                <PropertyField label="Sides">
                    <PropertyInput onChange={onChangeSides} value={nodeProperties.sides} min={2} max={100} step={1} />
                </PropertyField>
            </PropertyGroup>

            <PropertyGroup>
                <PropertyField label="Texture Scale U / V">
                    <PropertyInput onChange={onChangeScaleU} value={nodeProperties.scaleU} min={.1} max={10} step={.1} />
                    <PropertyInput onChange={onChangeScaleV} value={nodeProperties.scaleV} min={.1} max={10} step={.1} />
                </PropertyField>
            </PropertyGroup>

            <PropertyGroup>
                <PropertyField label="Cap Offset">
                    <PropertyInput onChange={onChangeCapOffset} value={nodeProperties.capOffset} min={-.5} max={.5} step={.1} />
                </PropertyField>
            </PropertyGroup>
        </div>
    )
}
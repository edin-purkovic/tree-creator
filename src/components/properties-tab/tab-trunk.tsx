import { useAtom } from "jotai";
import { TrunkGeneratorParameters } from "@/generator/trunk";
import { PropertyField } from "@/components/ui/property-field";
import { PropertyInput } from "@/components/ui/property-input";
import { PropertySplineEditor } from "@/components/ui/property-spline";
import { PropertyGroup } from "@/components/ui/property-group";
import { ON_CHANGE_NODE_PROPERTY } from "@/utils/utils";
import { nodeDataAtom } from "@/store";
 
export const TabTrunk = ({selectedNodeIndex} : { selectedNodeIndex: number}) => {
    const [nodeData, setNodeData] = useAtom(nodeDataAtom);

    const node = nodeData[selectedNodeIndex];
    const nodeProperties = node.properties as TrunkGeneratorParameters;

    const onChangeSegments = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "segments", setNodeData);
    const onChangeSegmentMultiplier = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "segmentsMultiplier", setNodeData);
    const onChangeSides = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "sides", setNodeData);
    const onChangeLength = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "length", setNodeData);
    const onChangeRadius = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "radius", setNodeData);
    const onChangeRadiusScale = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "radiusScale", setNodeData);
    const onChangeRadiusCurve = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "radiusCurveParameters", setNodeData);
    const onChangeShapeCurveX = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "shapeCurveX", setNodeData);
    const onChangeShapeCurveZ = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "shapeCurveZ", setNodeData);
    const onChangeShapeCurveScale = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "shapeCurveScale", setNodeData);
    const onChangeTurbulence = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "turbulence", setNodeData);
    const onChangeTwist = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "twist", setNodeData);
    const onChangeScaleU = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "scaleU", setNodeData);
    const onChangeScaleV = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "scaleV", setNodeData);
    const onChangeCapOffset = ON_CHANGE_NODE_PROPERTY(selectedNodeIndex, "capOffset", setNodeData);

    return (
        <div className="h-full overflow-x-hidden overflow-y-auto">
            <PropertyGroup>
                <PropertyField label="Length">
                    <PropertyInput onChange={onChangeLength} value={nodeProperties.length} min={.1} max={25} step={.1} />
                </PropertyField>
            </PropertyGroup>

            <PropertyGroup>
                <PropertyField label="Turbulence" >
                    <PropertyInput onChange={onChangeTurbulence} value={nodeProperties.turbulence} min={0} max={2} step={.05} />
                </PropertyField>

                <PropertyField label="Twist" >
                    <PropertyInput onChange={onChangeTwist} value={nodeProperties.twist} min={0} max={360} step={15} />
                </PropertyField>
            </PropertyGroup>

            <PropertyGroup>
                <PropertyField label="Radius / Scale" >
                    <PropertyInput onChange={onChangeRadius} value={nodeProperties.radius} min={.1} max={10} step={.1} />
                    <PropertyInput onChange={onChangeRadiusScale} value={nodeProperties.radiusScale} min={.1} max={10} step={.1} />
                </PropertyField>

                <PropertyField label="Radius Curve" column>
                    <PropertySplineEditor onChange={onChangeRadiusCurve} value={nodeProperties.radiusCurveParameters} />
                </PropertyField>
            </PropertyGroup>

            <PropertyGroup>
                <PropertyField label="Shape Curve Scale" >
                    <PropertyInput onChange={onChangeShapeCurveScale} value={nodeProperties.shapeCurveScale} min={0.1} max={10} step={.1} />
                </PropertyField>

                <PropertyField label="Shape Curve X" column>
                    <PropertySplineEditor onChange={onChangeShapeCurveX} value={nodeProperties.shapeCurveX} />
                </PropertyField>

                <PropertyField label="Shape Curve Z" column>
                    <PropertySplineEditor onChange={onChangeShapeCurveZ} value={nodeProperties.shapeCurveZ} />
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
                    <PropertyInput onChange={onChangeScaleU} value={nodeProperties.scaleU} min={0.1} max={10} step={.1} />
                    <PropertyInput onChange={onChangeScaleV} value={nodeProperties.scaleV} min={0.1} max={10} step={.1} />
                </PropertyField>
            </PropertyGroup>

            <PropertyGroup>
                <PropertyField label="Cap Offset" >
                    <PropertyInput onChange={onChangeCapOffset} value={nodeProperties.capOffset} min={-.5} max={.5} step={.1} />
                </PropertyField>
            </PropertyGroup>
        </div>
    )
}
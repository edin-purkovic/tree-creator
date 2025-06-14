import { nanoid } from "nanoid";
import { NodeBaseProps, NodePosition2D, NodeTypeDefinition } from "@/components/node-editor/base";
import { generateSpline2DParameters } from "@/generator/spline";

export const addTrunkNode = (nodes: NodeBaseProps[], position: NodePosition2D = { x: 0, y: 0 }) => {
    nodes.push({
        id: nanoid(),
        name: "trunk-new",
        type: "trunk",
        position: position,
        enabled: true,
        connectedTo: [],
        properties: {
            seed: 1,
            count: 1,
            length: 5,
            segments: 4,
            segmentsMultiplier: 2,
            sides: 8,
            radius: .5,
            radiusScale: 1,
            radiusCurveParameters: generateSpline2DParameters(.5, 0),
            shapeCurveX: generateSpline2DParameters(.5, .5),
            shapeCurveZ: generateSpline2DParameters(.5, .5),
            shapeCurveScale: 1,
            turbulence: .15,
            twist: 0,
            scaleU: 1,
            scaleV: 1,
            capOffset: .1,
        }
    });
}

export const addBranchNode = (nodes: NodeBaseProps[], position: NodePosition2D = { x: 0, y: 0 }) => {
    nodes.push({
        id: nanoid(),
        name: "branch-new",
        type: "branch",
        position: position,
        enabled: true,
        connectedTo: [],
        properties: {
            count: 4,
            length: 3,
            segments: 4,
            segmentsMultiplier: 2,
            sides: 6,
            seed: 2,
            radiusScale: 1,
            radiusCurveParameters: generateSpline2DParameters(.8, 0),
            lengthCurveParameters: generateSpline2DParameters(1, .3),
            positionCurveParameters: generateSpline2DParameters(.2, .8),
            lengthScale: 1,
            turbulence: .1,
            originOffset: 0,
            twist: 0,
            scaleU: 1,
            scaleV: 2,
            capOffset: .1,
            gravity: 10,
            pull: 0,
            angle: 30,
        }
    });
}

export const addLeavesNode = (nodes: NodeBaseProps[], position: NodePosition2D = { x: 0, y: 0 }) => {
    nodes.push({
        id: nanoid(),
        name: "leaves-new",
        type: "leaves",
        position: position,
        enabled: true,
        connectedTo: [],
        properties: {
            count: 8,
            segments: 4,
            startU: 0,
            startV: 0,
            endU: .5,
            endV: .5,
            length: .5,
            width: .5,
            positionCurveParameters: generateSpline2DParameters(.8, 1),
            scaleCurveParameters: generateSpline2DParameters(1, .8),
            angle: -5,
            gravity: -15,
            shape: "default",
        }
    });
}

export const NODE_DEFAULT_TYPE_DEFINTIONS: NodeTypeDefinition = {
    width: 50,
    height: 50,
}

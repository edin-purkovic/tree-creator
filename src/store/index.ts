import { atom } from "jotai"
import { atomWithImmer } from "jotai-immer"
import { atomWithStorage } from "jotai/utils"
import { generateSpline2DParameters } from "@/generator/spline";
import { NodeEditorActiveItem, NodeBaseProps } from "@/components/node-editor/base";

export const selectedItemAtom = atom<NodeEditorActiveItem | null>({ target: "trunk", type: "node" });

export const showGridAtom = atomWithStorage<boolean>("show_grid", true);

export const showCurvesAtom = atomWithStorage<boolean>("show_curves", false);

export const showMeshAtom = atomWithStorage<boolean>("show_mesh", true);

export const showShadowsAtom = atomWithStorage<boolean>("show_shadows", true);

export const showTexturesAtom = atomWithStorage<boolean>("show_textures", true);

export const showWireframeAtom = atomWithStorage<boolean>("show_wireframe", false);

export const showTrunksAtom = atomWithStorage<boolean>("show_trunks", true);

export const showBranchesAtom = atomWithStorage<boolean>("show_branches", true);

export const showLeavesAtom = atomWithStorage<boolean>("show_leaves", true);

export const nodeDataAtom = atomWithImmer<NodeBaseProps[]>([
    {
        id: "tree",
        name: "tree",
        type: "tree",
        position: { x: 60, y: 60 },
        enabled: true,
        connectedTo: ["trunk"],
        properties: {
            seed: 10,
        }
    },
    {
        id: "trunk",
        name: "trunk",
        type: "trunk",
        position: { x: 160, y: 60 },
        enabled: true,
        connectedTo: ["branch_1"],
        properties: {
            count: 1,
            length: 6,
            segments: 6,
            segmentsMultiplier: 5,
            sides: 8,
            radius: .5,
            radiusScale: 1,
            radiusCurveParameters: generateSpline2DParameters(.5, 0),
            shapeCurveX: generateSpline2DParameters(.5, .5),
            shapeCurveZ: generateSpline2DParameters(.5, .5),
            shapeCurveScale: 1,
            turbulence: .1,
            twist: 0,
            scaleU: 1,
            scaleV: 1,
            capOffset: .1,
        }
    },
    {
        id: "branch_1",
        name: "branch-1",
        type: "branch",
        position: { x: 260, y: 60 },
        enabled: true,
        connectedTo: ["branch_2"],
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
    },
    {
        id: "branch_2",
        name: "branch-2",
        type: "branch",
        position: { x: 360, y: 60 },
        enabled: true,
        connectedTo: ["branch_3", "leaves_1", "leaves_2", "additional"],
        properties: {
            count: 3,
            length: 1,
            segments: 4,
            segmentsMultiplier: 2,
            sides: 6,
            seed: 2,
            radiusScale: 1,
            radiusCurveParameters: generateSpline2DParameters(.8, 0),
            lengthCurveParameters: generateSpline2DParameters(1, .3),
            positionCurveParameters: generateSpline2DParameters(.1, .8),
            lengthScale: 1,
            turbulence: .1,
            originOffset: 0,
            twist: 0,
            scaleU: 1,
            scaleV: 2,
            capOffset: .1,
            gravity: 10,
            pull: 0,
            angle: 0,
        }
    },
    {
        id: "leaves_1",
        name: "leaves-1",
        type: "leaves",
        position: { x: 460, y: 20 },
        enabled: true,
        properties: {
            count: 8,
            segments: 4,
            startU: 0,
            startV: 0,
            endU: .5,
            endV: .5,
            length: 1,
            width: 1,
            positionCurveParameters: generateSpline2DParameters(.4, 1),
            scaleCurveParameters: generateSpline2DParameters(1, .8),
            angle: 45,
            gravity: 0,
            shape: "default",
        }
    },
    {
        id: "leaves_2",
        name: "leaves-2",
        type: "leaves",
        position: { x: 460, y: 120 },
        enabled: true,
        properties: {
            count: 8,
            segments: 4,
            startU: 0,
            startV: 0,
            endU: .5,
            endV: .5,
            length: 1,
            width: 1,
            positionCurveParameters: generateSpline2DParameters(.4, 1),
            scaleCurveParameters: generateSpline2DParameters(1, .8),
            angle: -45,
            gravity: 0,
            shape: "default",
        }
    },
    // {
    //     id: "additional",
    //     name: "additional",
    //     type: "additional",
    //     position: { x: 460, y: 120 },
    //     enabled: false,
    // },
]);


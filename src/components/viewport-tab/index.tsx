import { useAtom } from "jotai"
import { Tab } from "@/components/ui/tab"
import { ButtonGroup } from "@/components/ui/button-group"
import { ButtonToggle } from "@/components/ui/button-toggle"
import { StatsField } from "@/components/ui/stats-field"
import { TreeGenerator } from "@/generator/tree.js"
import { Viewport } from "@/components/viewport-tab/viewport"
import {
    nodeDataAtom,
    showBranchesAtom,
    showCurvesAtom,
    showGridAtom,
    showLeavesAtom,
    showMeshAtom,
    showShadowsAtom,
    showTexturesAtom,
    showTrunksAtom,
    showWireframeAtom
} from "@/store/index"

import GridIcon from "@/assets/grid.svg?react"
import CurveIcon from "@/assets/curve.svg?react"
import WireframeIcon from "@/assets/wireframe.svg?react"
import MaterialIcon from "@/assets/material.svg?react"
import TreeIcon from "@/assets/tree.svg?react"
import ShadowIcon from "@/assets/shadow.svg?react"
import TrunkIcon from "@/assets/trunk.svg?react"
import BranchIcon from "@/assets/branch.svg?react"
import LeavesIcon from "@/assets/leaves.svg?react"

export const ViewportTab = () => {
    const [showGrid, setShowGrid] = useAtom(showGridAtom);
    const [showCurves, setShowCurves] = useAtom(showCurvesAtom);
    const [showMesh, setShowMesh] = useAtom(showMeshAtom);
    const [showMaterials, setShowMaterials] = useAtom(showTexturesAtom);
    const [showWireframe, setShowWireframe] = useAtom(showWireframeAtom);
    const [showShadows, setShowShadows] = useAtom(showShadowsAtom);
    const [showTrunks, setShowTrunks] = useAtom(showTrunksAtom);
    const [showBranches, setShowBranches] = useAtom(showBranchesAtom);
    const [showLeaves, setShowLeaves] = useAtom(showLeavesAtom);
    const [nodeData] = useAtom(nodeDataAtom);

    const treeGenerator = new TreeGenerator(nodeData);

    const header = (
        <>
            <ButtonGroup>
                <ButtonToggle onChange={setShowGrid} value={showGrid} tooltip="Show Grid">
                    <GridIcon height={18} stroke={showGrid ? "#fff" : "#878787"} />
                </ButtonToggle>

                <ButtonToggle onChange={setShowCurves} value={showCurves} tooltip="Show Curves">
                    <CurveIcon height={18} stroke={showCurves ? "#fff" : "#878787"} />
                </ButtonToggle>

                <ButtonToggle onChange={setShowMaterials} value={showMaterials} tooltip="Show Materials">
                    <MaterialIcon height={18} fill={showMaterials ? "#fff" : "#878787"} />
                </ButtonToggle>

                <ButtonToggle onChange={setShowWireframe} value={showWireframe} tooltip="Show Wireframe">
                    <WireframeIcon height={18} stroke={showWireframe ? "#fff" : "#878787"} />
                </ButtonToggle>

                <ButtonToggle onChange={setShowShadows} value={showShadows} tooltip="Show Shadows">
                    <ShadowIcon height={18} stroke={showShadows ? "#fff" : "#878787"} />
                </ButtonToggle>
            </ButtonGroup>

            <ButtonGroup right>
                <ButtonToggle onChange={setShowMesh} value={showMesh} tooltip="Show Tree Mesh">
                    <TreeIcon height={18} fill={showMesh ? "#fff" : "#878787"} />
                </ButtonToggle>

                <ButtonToggle onChange={setShowTrunks} value={showTrunks} tooltip="Show Trunks">
                    <TrunkIcon height={18} fill={showTrunks ? "#fff" : "#878787"} />
                </ButtonToggle>

                <ButtonToggle onChange={setShowBranches} value={showBranches} tooltip="Show Branches">
                    <BranchIcon height={18} fill={showBranches ? "#fff" : "#878787"} />
                </ButtonToggle>

                <ButtonToggle onChange={setShowLeaves} value={showLeaves} tooltip="Show Leaves">
                    <LeavesIcon height={18} fill={showLeaves ? "#fff" : "#878787"} />
                </ButtonToggle>
            </ButtonGroup>
        </>
    );

    const footer = (
        <>
            <ButtonGroup>
                <StatsField label={"Trunks:"} count={treeGenerator?.trunks.length} />
                <StatsField label={"Branches:"} count={treeGenerator?.branches.length} />
            </ButtonGroup>

            <ButtonGroup right>
                <StatsField label={"Triangles:"} count={treeGenerator.meshStats.triangleCount} />
                <StatsField label={"Indices:"} count={treeGenerator.meshStats.indexCount} />
                <StatsField label={"Vertices:"} count={treeGenerator.meshStats.vertexCount} />
            </ButtonGroup>
        </>
    );

    return (
        <Tab header={header} footer={footer} smallFooter>
            <Viewport tree={treeGenerator} key={`viewport-${showShadows}`} />
        </Tab>
    )
}


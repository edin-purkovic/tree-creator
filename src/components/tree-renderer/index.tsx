import { useAtom } from "jotai";
import { TreeGenerator } from "@/generator/tree";
import { ElementRenderer } from "@/components/tree-renderer/element-renderer";
import { showBranchesAtom, showCurvesAtom, showLeavesAtom, showMeshAtom, showTexturesAtom, showTrunksAtom, showWireframeAtom } from "@/store"

export const TreeRenderer = ({ source }: { source: TreeGenerator }) => {
    const [showCurves] = useAtom(showCurvesAtom);
    const [showMesh] = useAtom(showMeshAtom);
    const [showTextures] = useAtom(showTexturesAtom)
    const [showWireframe] = useAtom(showWireframeAtom);
    const [showTrunks] = useAtom(showTrunksAtom)
    const [showBranches] = useAtom(showBranchesAtom)
    const [showLeaves] = useAtom(showLeavesAtom)

    if (!showCurves && !showMesh) {
        return null;
    }

    const trunkTextures = [
        "./textures/trunk/bark.png",
        "./textures/trunk/barkn.png",
    ];

    const leavesTextures = [
        "./textures/leaves/branch.png",
        "./textures/leaves/branchn.png",
    ];

    const renderedTrunks = source.trunks.map(
        (trunk, index) => (
            <ElementRenderer
                object={trunk}
                renderMesh={showMesh && showTrunks}
                renderCurves={showCurves}
                useTextures={showTextures}
                textureList={trunkTextures}
                showWireframe={showWireframe}

                key={`${trunk.name}-${showTextures}-${index}`}
            />
        )
    );

    const renderedBranches = source.branches.map(
        (branch, index) => (
            <ElementRenderer
                object={branch}
                renderMesh={showMesh && showBranches}
                renderCurves={showCurves}
                useTextures={showTextures}
                textureList={trunkTextures}
                showWireframe={showWireframe}

                key={`${branch.name}-${showTextures}-${index}`}
            />
        )
    )

    const renderedLeaves = source.leaves.map(
        (leaves, index) => (
            <ElementRenderer
                object={leaves}
                renderMesh={showMesh && showLeaves}
                renderCurves={showCurves}
                showWireframe={showWireframe}
                useTextures={showTextures}
                textureList={leavesTextures}
                transparent

                key={`${leaves.name}-${showTextures}-${index}`}
            />
        )
    )

    return [renderedTrunks, renderedBranches, renderedLeaves];
}
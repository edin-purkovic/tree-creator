import { Euler, RepeatWrapping, TextureLoader, Vector2, Vector3 } from "three";
import { useLoader } from "@react-three/fiber";
import { CatmullRomLine } from "@react-three/drei"
import { TreeMeshElement } from "@/generator/tree";
import { If } from "@/components/utils/if";

interface TrunkRendererProperties {
    object: TreeMeshElement;
    renderMesh?: boolean;
    renderCurves?: boolean;
    renderPoints?: boolean;
    showWireframe?: boolean;
    useTextures?: boolean;
    textureList?: string[];
    transparent?: boolean;
}

export const ElementRenderer = ({
    object,
    renderMesh,
    renderCurves,
    renderPoints,
    showWireframe,
    useTextures,
    textureList = [],
    transparent,
}: TrunkRendererProperties) => {
    const [colorMap, normalMap] = useLoader(TextureLoader, textureList);

    colorMap.wrapS = RepeatWrapping;
    colorMap.wrapT = RepeatWrapping;
    normalMap.wrapS = RepeatWrapping;
    normalMap.wrapT = RepeatWrapping;

    const flippedNormals = new Vector2(-1, 1);
    const accumulatedRotation = new Euler;
    let current = object.samplingData;
    let position = new Vector3();
    let rotation = new Vector3();

    // traverse the hierarchy and apply transforms
    while (current.parent) {
        accumulatedRotation.setFromVector3(current.parent.rotation);

        position.add(current.position.clone()).applyEuler(accumulatedRotation)
        rotation.add(current.rotation);

        current = current.parent;
    }

    accumulatedRotation.setFromVector3(rotation);

    return (
        <>
            <If condtition={renderCurves}>
                <CatmullRomLine
                    position={position}
                    rotation={accumulatedRotation}
                    points={object.samplingData.baseCurve.points}
                    tension={0}
                    renderOrder={999}
                    depthTest={false}
                />
            </If>

            <If condtition={renderPoints}>
                <points position={position}>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={object.mesh.positions.length / 3}
                            array={object.mesh.positions}
                            itemSize={3}
                        />
                    </bufferGeometry>

                    <pointsMaterial
                        size={.05}
                        color="#fff"
                    />
                </points>
            </If>

            <If condtition={renderMesh}>
                <mesh castShadow position={position} rotation={accumulatedRotation} >
                    <bufferGeometry attach="geometry">
                        <bufferAttribute
                            array={object.mesh.indices}
                            attach="index"
                            count={object.mesh.indices.length}
                            itemSize={1}
                        />

                        <bufferAttribute
                            attach="attributes-position"
                            count={object.mesh.positions.length / 3}
                            array={object.mesh.positions}
                            itemSize={3}
                        />

                        <bufferAttribute
                            attach="attributes-uv"
                            count={object.mesh.uvs.length / 2}
                            array={object.mesh.uvs}
                            itemSize={2}
                        />

                        <bufferAttribute
                            attach="attributes-normal"
                            count={object.mesh.normals.length / 3}
                            array={object.mesh.normals}
                            itemSize={3}
                        />
                    </bufferGeometry>

                    <If condtition={useTextures && !showWireframe}>
                        <meshStandardMaterial
                            map={colorMap}
                            normalMap={normalMap}
                            normalScale={flippedNormals}
                            wireframe={showWireframe}
                            transparent={transparent}
                            alphaTest={.01}
                            roughness={1}
                            metalness={0}
                        />
                    </If>

                    <If condtition={!useTextures}>
                        <meshStandardMaterial
                            metalness={0}
                            roughness={1}
                            wireframe={showWireframe || showWireframe}
                            color="#666"
                        />
                    </If>
                </mesh>
            </If>
        </>
    )
}

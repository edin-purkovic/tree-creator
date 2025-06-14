import { Suspense } from "react"
import { useAtom } from "jotai"
import { Euler } from "three"
import { Canvas } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import { TreeRenderer } from "@/components/tree-renderer"
import { ViewportCamera } from "@/components/viewport-tab/viewport-camera"
import { ViewportGrid } from "@/components/viewport-tab/viewport-grid"
import { showShadowsAtom } from "@/store/index.js"

export const Viewport = ({ tree }: any) => {
    const [showShadows] = useAtom(showShadowsAtom);

    const envRotation = new Euler(0, -1.3);

    return (
        <div className="w-full h-full relative select-none">
            <div className="w-full h-full absolute bg-background-viewport" >
                <Canvas shadows={showShadows} frameloop="demand" camera={{ position: [6, 3, 3] }}>
                    <Suspense fallback={null}>
                        <ambientLight intensity={1} />

                        <directionalLight
                            castShadow
                            position={[100, 100, 200]}
                            intensity={.1}
                            shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={20} shadow-camera-bottom={-20}
                        />

                        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -.01, 0]}>
                            <shadowMaterial color={"#000"} opacity={.2} />
                            <planeGeometry args={[2000, 2000]} />
                        </mesh>

                        <ViewportGrid />

                        <TreeRenderer source={tree} key={tree.version} />

                        <Environment
                            preset={'city'}
                            background
                            blur={1}
                            backgroundBlurriness={1}
                            environmentIntensity={0.3}
                            environmentRotation={envRotation}
                        />

                        <ViewportCamera tx={0} ty={4} tz={0} />
                    </Suspense>
                </Canvas>
            </div>
        </div>
    )
}
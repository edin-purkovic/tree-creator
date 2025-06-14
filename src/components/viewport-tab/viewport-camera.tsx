import { useEffect, useRef } from "react"
import { OrbitControls } from "@react-three/drei"
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

export const ViewportCamera = ({tx, ty, tz}: {tx: number, ty: number, tz: number}) => {
    const ref = useRef<OrbitControlsImpl>(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.target.set(tx, ty, tz);
        }
    }, [ref.current]);

    return (
        <OrbitControls
            makeDefault
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
            target={[tx, ty, tz]}
            ref={ref}
        />
    );
};
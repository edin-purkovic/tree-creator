import { useAtom } from "jotai"
import { showGridAtom } from "@/store/index.js"

export const ViewportGrid = () => {
    const [showGrid] = useAtom(showGridAtom);
    
    if(!showGrid) {
        return null;
    }

    return (
        <gridHelper args={[10, 10]}>
            <lineBasicMaterial opacity={.25} transparent={true} />
        </gridHelper>
    )
}
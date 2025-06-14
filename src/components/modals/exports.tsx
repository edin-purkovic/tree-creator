import { useAtom } from "jotai";
import { saveAs } from "file-saver";
import { Modal } from "@/components/ui/modal";
import { findNodeIndex } from "@/components/node-editor/node-utils";
import { nodeDataAtom } from '@/store';

export const ExportsModal = () => {
    const [nodes] = useAtom(nodeDataAtom);

    const exportJSON = () => {
        const index = findNodeIndex(nodes, "tree");

        if (index !== false) {
            const name = `${nodes[index].name}.json`;
            var blob = new Blob([JSON.stringify(nodes)], { type: "text/plain;charset=utf-8" });
            saveAs(blob, name);
        }
    }

    return (
        <Modal
            header="Export"
            trigger={
                <button className="h-full px-5 flex justify-center items-center hover:bg-background-1/50">
                    Export
                </button>
            }
        >
            <div className="flex flex-col h-full w-full gap-4 p-6">
                <button className="bg-background-1/50 p-4 rounded-xl text-2xl hover:brightness-150 cursor-pointer" onClick={exportJSON}>
                    Export JSON
                </button>
            </div>
        </Modal>
    )
}
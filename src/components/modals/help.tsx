import { Modal } from "@/components/ui/modal";

export const HelpModal = () => (
    <Modal
        header="Help"
        trigger={
            <button className="h-full px-5 flex justify-center items-center hover:bg-background-1/50">
                Help
            </button>
        }
    >
        <div className="flex flex-col text-2xl p-8 gap-6">
            <div>Left-Click and Hold to Rotate</div>
            <div>Right-Click and Hold  to Pan</div>
            <div>Middle-Click and Hold / Scroll-Wheel to zoom</div>
        </div>

        <div className="flex flex-col text-2xl p-8 gap-6">
        <div>Created By Edin Purković</div>
        </div>
    </Modal>
)

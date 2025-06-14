import { Modal } from "@/components/ui/modal";

export const TemplatesModal = () => (
    <Modal
        header="Templates"
        trigger={
            <button className="h-full px-5 flex justify-center items-center hover:bg-background-1/50">
                Templates
            </button>
        }
    >
        <div className="flex flex-col h-full w-full gap-4 p-6">
            <button className="bg-background-1/50 p-4 rounded-xl text-2xl hover:brightness-150 cursor-pointer">
                Default Tree
            </button>

            <button className="bg-background-1/50 p-4 rounded-xl text-2xl hover:brightness-150 cursor-pointer">
                Complex Tree
            </button>

            <button className="bg-background-1/50 p-4 rounded-xl text-2xl hover:brightness-150 cursor-pointer">
                Bush
            </button>
        </div>
    </Modal>
)

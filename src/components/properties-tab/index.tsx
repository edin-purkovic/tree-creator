import { useAtom } from "jotai";
import { Tab } from "@/components/ui/tab"
import { ButtonGroup } from "@/components/ui/button-group";
import { TitleEditor } from "@/components/properties-tab/title-editor";
import { TabTree } from "@/components/properties-tab/tab-tree";
import { TabTrunk } from "@/components/properties-tab/tab-trunk";
import { TabBranch } from "@/components/properties-tab/tab-branch";
import { TabLeaves } from "@/components/properties-tab/tab-leaves";
import { findNodeIndex } from "@/components/node-editor/node-utils";
import { nodeDataAtom, selectedItemAtom } from "@/store";

export const PropertiesTab = () => {
    const [selectedItem] = useAtom(selectedItemAtom);
    const [nodeData] = useAtom(nodeDataAtom);

    if (selectedItem?.type === "connection") {
        return <Tab />;
    }

    const selectedNodeIndex = findNodeIndex(nodeData, selectedItem?.target as string);

    if (selectedNodeIndex === false) {
        return <Tab />;
    }

    const propertyEditor = {
        "tree": <TabTree selectedNodeIndex={selectedNodeIndex} />,
        "trunk": <TabTrunk selectedNodeIndex={selectedNodeIndex} />,
        "branch": <TabBranch selectedNodeIndex={selectedNodeIndex} />,
        "leaves": <TabLeaves selectedNodeIndex={selectedNodeIndex} />,
    }[nodeData[selectedNodeIndex]?.type] ?? <div className="p-4">No Properties Available</div>;

    return (
        <Tab
            header={
                <ButtonGroup>
                    <TitleEditor selectedNodeIndex={selectedNodeIndex} />
                </ButtonGroup>
            }

            children={propertyEditor}
        />
    )
}

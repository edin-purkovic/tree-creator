import { SplitLayout } from '@/components/ui/split-layout'
import { TabGroup } from '@/components/ui/tab-group'
import { NodeEditorTab } from '@/components/node-tab'
import { PropertiesTab } from '@/components/properties-tab'
import { ViewportTab } from '@/components/viewport-tab'
import { TemplatesModal } from './components/modals/templates'
import { ExportsModal } from './components/modals/exports'
import { HelpModal } from './components/modals/help'
import { cn } from '@/utils/utils'

function App() {
    return (
        <div className='w-full h-full flex flex-col p-2 pt-0 bg-background-0'>
            <div className={cn("h-[34px] min-h-[34px] bg-background-viewport flex text-color-menu rounded-b-xl mb-2")}>
                <TemplatesModal />
                <ExportsModal />
                <HelpModal />
            </div>

            <div className="grow overflow-hidden">
                <SplitLayout width="full">
                    <SplitLayout width="grow">
                        <TabGroup
                            list={[{ id: "viewport", name: "Viewport", tab: <ViewportTab /> }]}
                            defaultTab="viewport"
                        />
                    </SplitLayout>

                    <SplitLayout minWidth="700px" maxWidth="700px" column>
                        <TabGroup
                            list={[{ id: "node_editor", name: "Nodes", tab: <NodeEditorTab /> }]}
                            defaultTab="node_editor"
                            height="470px"
                        />

                        <TabGroup
                            list={[{ id: "properties", name: "Properties", tab: <PropertiesTab /> }]}
                            defaultTab="properties"
                        />
                    </SplitLayout>
                </SplitLayout>
            </div>
        </div>
    )
}

export default App

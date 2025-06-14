import { NodeBaseProps, NodeTypeDefinition } from "@/components/node-editor/base";
import { If } from "@/components/utils/if";

interface NodeProps extends NodeBaseProps {
    index: number;
    state: "dragging" | "idle";
    active: boolean;
    typeDefinition: NodeTypeDefinition;
};

export const NodeInternal = ({ id, position, index, name, type, active, enabled, content, typeDefinition }: NodeProps) => {
    let rectColor = "#494949";
    let strokeColor = "transparent";

    if (enabled === false) {
        strokeColor = "#494949";
        rectColor = "#292929";
    }

    if (active) {
        strokeColor = "#fff";
    }

    const inPortX = position.x;
    const inPortY = position.y + (typeDefinition.height / 2);
    const outPortX = position.x + typeDefinition.width;
    const outPortY = position.y + (typeDefinition.height / 2);

    return (
        <g>
            <rect
                x={position.x}
                y={position.y}
                width={typeDefinition.width}
                height={typeDefinition.height}
                rx={10}
                className="cursor-grab active:cursor-grabbing hover:brightness-150"
                fill={rectColor}
                data-type="node"
                data-node-type={type}
                data-id={id}
                data-px={position.x}
                data-py={position.y}
                data-index={index}
                stroke={strokeColor}
                strokeWidth={2}
            />

            <If condtition={!!typeDefinition.content || !!content}>
                <foreignObject
                    x={position.x}
                    y={position.y}
                    width={50}
                    height={50}
                    className="pointer-events-none"
                >
                    <div className="flex justify-center items-center w-full h-full pointer-events-none">
                        {typeDefinition?.content} {content}
                    </div>
                </foreignObject>
            </If>

            <If condtition={!!name}>
                <text
                    x={position.x}
                    y={position.y + 64}
                    textAnchor="right"
                    fill="#fff"
                >
                    {name}
                </text>
            </If>

            <g key={index}>
                <If condtition={!!typeDefinition.inPort}>
                    <ellipse
                        cx={inPortX}
                        cy={inPortY}
                        rx={4}
                        ry={4}
                        fill="rgb(255, 255, 255)"
                        className="stroke-transparent hover:stroke-neutral-100/30 cursor-pointer active:cursor-grabbing"
                        strokeWidth={10}
                        data-type="port"
                        data-node-type={type}
                        data-px={inPortX}
                        data-py={inPortY}
                        data-port-type="in"
                        data-id={id}
                    />
                </If>

                <If condtition={!!typeDefinition.outPort}>
                    <ellipse
                        cx={outPortX}
                        cy={outPortY}
                        rx={4}
                        ry={4}
                        fill="rgb(255, 255, 255)"
                        className="stroke-transparent hover:stroke-neutral-100/30 cursor-pointer active:cursor-grabbing"
                        strokeWidth={10}
                        data-type="port"
                        data-node-type={type}
                        data-px={outPortX}
                        data-py={outPortY}
                        data-port-type="out"
                        data-id={id}
                    />
                </If>
            </g>

        </g>
    )
}
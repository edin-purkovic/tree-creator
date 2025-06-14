import { NodeLinePosition2D, NodeConnection, NodeConnectionDetils } from "@/components/node-editor/base";
import { cn } from "@/utils/utils";

interface NodeCurveProps {
    onClick?: (connection: NodeConnection, position?: NodeLinePosition2D) => void;
    connection: NodeConnectionDetils;
    active: boolean;
}

export const NodeCurve = ({ connection, active, onClick }: NodeCurveProps) => {
    const fromPosition = connection.positions.from;
    const toPosition = connection.positions.to;

    const instructions = `
        M ${fromPosition.x},${fromPosition.y}
        C ${fromPosition.x + 60},${fromPosition.y} ${toPosition.x - 60},${toPosition.y} ${toPosition.x},${toPosition.y}
    `;

    const onCurveClick = () => {
        if (onClick) {
            onClick(connection.ids, connection.positions);
        }
    }

    return (
        <g
            className={cn(
                "[&>.selectable]:hover:stroke-neutral-600 cursor-pointer",
                active && "[&>.selectable]:stroke-neutral-400 [&>.selectable]:hover:stroke-neutral-400"
            )}
        >
            <path
                d={instructions}
                fill="none"
                stroke="transparent"
                strokeWidth={8}
                className="selectable"
                onClick={onCurveClick}
            />
            <path
                d={instructions}
                fill="none"
                stroke="rgb(125, 125, 125)"
                strokeWidth={2}
                className="pointer-events-none"
            />
        </g>
    )
}

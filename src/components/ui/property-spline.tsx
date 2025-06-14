import { MouseEvent, useEffect, useRef, useState } from "react";
import { clamp } from "three/src/math/MathUtils.js";
import { produce } from "immer"
import { Spline2DParameters } from "@/generator/spline";

export interface PropertySplineEditorProps {
    onChange: (value: Spline2DParameters) => void;
    value: Spline2DParameters;
    height?: number;
    width?: number;
}

export const PropertySplineEditor = ({ onChange, value }: PropertySplineEditorProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    const gridStyle = {
        backgroundImage: "linear-gradient(to right, #333 2px, transparent 2px), linear-gradient(to bottom, #333 2px, transparent 2px)",
        backgroundPosition: "10px 0",
        backgroundSize: `${(width - 20) / 10}px 15px`,
    };

    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setWidth(rect.right - rect.left);
        }
    }, [ref]);

    return (
        <div className="w-full bg-background-1 rounded-xl" style={gridStyle} ref={ref}>
            <SplineEditorInternal
                points={value}
                onChange={onChange}
                width={width}
                height={150}
            />
        </div>
    )
}

type DragType = {
    index: number;
    elementType: string;
    controlType: string;
    cursor: { x: number; y: number };
    start: { x: number; y: number };
}

type SplineEditorInternalProps = {
    onChange: (value: Spline2DParameters) => void;
    points: Spline2DParameters;
    height: number;
    width: number;
    gridSize?: number;
    snap?: boolean;
}

const SplineEditorInternal = ({ points, onChange, width, height }: SplineEditorInternalProps) => {
    const ref = useRef<SVGSVGElement | null>(null);
    const [dragging, setDragging] = useState<DragType | null>(null);

    // fix this...
    useEffect(() => { onChange(JSON.parse(JSON.stringify(points))); }, []);

    if (points.length < 4) {
        return null;
    }

    const lines = createControlLines(points, width, height);
    const data = createControlPointsAndInstructions(points, width, height);

    const onMouseDown = (event: any) => {
        if (!dragging && event.target?.dataset?.elementType === "point") {
            const targetRect = event.target.getBoundingClientRect();

            setDragging({
                index: event.target.dataset.index,
                elementType: "point",
                controlType: event.target.dataset.controlType,
                cursor: {
                    x: Math.round(event.clientX - targetRect.left),
                    y: Math.round(event.clientY - targetRect.top),
                },
                start: {
                    x: Number(event.target.dataset.px),
                    y: Number(event.target.dataset.py),
                }
            });
        }
    }

    const onMouseMove = ({ clientX, clientY }: MouseEvent<SVGSVGElement>) => {
        if (ref.current && dragging && dragging.elementType === "point") {
            const rect = ref.current.getBoundingClientRect();

            let svgX = clientX - rect.left - dragging.cursor.x;
            let svgY = clientY - rect.top - dragging.cursor.y;

            let x = clamp((svgX * width / rect.width) / width, 0, 1);
            let y = clamp((svgY * height / rect.height) / height, 0, 1);

            x = dragging.controlType === "first" ? 0 : x;
            x = dragging.controlType === "last" ? 1 : x;

            onChange(
                produce(points, draft => {
                    draft[dragging.index] = { x, y: 1 - y };
                })
            );
        }
    }

    const onMouseUp = () => dragging && setDragging(null);

    const onMouseLeave = () => dragging && setDragging(null);

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            width={width}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            ref={ref}
        >
            <path d={data.instructions} fill="none" strokeWidth={2} className="stroke-[#666]" />

            {lines}
            {data.pointList}
        </svg>
    )
}

const createControlPointsAndInstructions = (points: Spline2DParameters, width: number, height: number) => {
    const firstX = points[0].x * width;
    const firstY = (1 - points[0].y) * height;
    const pointList = [];
    const nPoints = points.length;

    let instructions = `M ${firstX},${firstY} C`;

    pointList.push(
        <ControlPoint x={firstX + 10} y={firstY} index={0} type="first" key={0} />
    );

    for (let index = 1; index < nPoints; index++) {
        const last = index === nPoints - 1;
        const point = points[index];
        const px = point.x * width;
        const py = (1 - point.y) * height;
        const type = last ? "last" : "control";
        const offsetX = Number(last) * 10;

        instructions += ` ${px},${py}`;

        pointList.push(
            <ControlPoint x={px - offsetX} y={py} index={index} type={type} key={index} />
        );
    }

    return { pointList, instructions };
}

const createControlLines = (points: Spline2DParameters, width: number, height: number) => {
    const lineList = [];

    for (let index = 0; index < points.length; index += 2) {
        const point1 = points[index];
        const point2 = points[index + 1];

        lineList.push(
            <ControlLine
                x1={point1.x * width}
                y1={(1 - point1.y) * height}
                x2={point2.x * width}
                y2={(1 - point2.y) * height}
                key={index}
            />
        );
    }

    return lineList;
}

const ControlPoint = ({ x, y, type, index }: { x: number, y: number, index: number, type: "first" | "last" | "control" }) => (
    <circle
        cx={x}
        cy={y}
        r={10}
        data-px={x}
        data-py={y}
        data-index={index}
        data-element-type="point"
        data-control-type={type}
        className="fill-background-selectable stroke-background-0/30 cursor-grab active:cursor-grabbing brightness-150"
        strokeWidth={2}
    />
)

const ControlLine = ({ x1, y1, x2, y2 }: { x1: number, x2: number, y1: number, y2: number }) => (
    <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className="stroke-[#999] "
        strokeDasharray={6}
        strokeWidth={2}
    />
)
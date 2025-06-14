import { SplineCurve, Vector2 } from "three";
import { lerp } from "three/src/math/MathUtils.js"

export type Spline2DParameters = { x: number; y: number; }[];

export class ParametricSpline2D {
    private curve = new SplineCurve();
    private scale: number;
    private radius: number;

    constructor(parameters: Spline2DParameters, radius: number, scale: number = 1) {
        this.curve.points = [];

        for (let i = 0; i < parameters.length; i++) {
            this.curve.points.push(new Vector2(parameters[i].x, parameters[i].y))
        }

        this.scale = scale;
        this.radius = radius;
    }

    getAt(t: number): number {
        return this.curve.getPointAt(t).y * this.scale * this.radius;
    }
}

export const generateSpline2DParameters = (start: number, end: number): Spline2DParameters => {
    const p1 = lerp(start, end, 0.25);
    const p2 = lerp(start, end, 0.75);

    return [
        { x: 0, y: start },
        { x: .25, y: p1 },
        { x: .75, y: p2 },
        { x: 1, y: end },
    ];
}

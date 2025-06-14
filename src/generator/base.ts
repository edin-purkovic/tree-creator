import { CatmullRomCurve3, Vector3 } from "three";
import { generateSpline2DParameters, ParametricSpline2D } from "@/generator/spline";

export interface SamplingData {
    parent: SamplingData | null;
    baseCurve: InstanceType<typeof CatmullRomCurve3>;
    position: Vector3;
    rotation: Vector3;
    radiusCurve: ParametricSpline2D;
    offset: number;
    normal: Vector3;
}

export const ZERO_VECTOR = new Vector3(0, 0, 0);

export const RIGHT_VECTOR = new Vector3(1, 0, 0);

export const FORWARD_VECTOR = new Vector3(0, 0, 1);

export const EMPTY_RADIUS_CURVE = new ParametricSpline2D(generateSpline2DParameters(1, 1), 1);

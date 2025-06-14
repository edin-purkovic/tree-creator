import { CatmullRomCurve3, Vector3 } from "three";
import { SamplingData, ZERO_VECTOR } from "@/generator/base";
import { ParametricSpline2D, Spline2DParameters } from "@/generator/spline";
import { SeededRandom } from "@/utils/random";

export interface BaseGeneratorParameters {
    segmentsMultiplier: number;
    segments: number;
    sides: number;
    twist: number;
    scaleU: number;
    scaleV: number;
    seed: number;
    capOffset: number;
}

export interface TrunkGeneratorParameters extends BaseGeneratorParameters {
    length: number;
    radius: number;
    radiusScale: number;
    radiusCurveParameters: Spline2DParameters;
    turbulence: number;
    count: number;
    shapeCurveX: Spline2DParameters;
    shapeCurveZ: Spline2DParameters;
    shapeCurveScale: number;
}

export const generateTrunkSamplingData = (
    parameters: TrunkGeneratorParameters,
    random: SeededRandom,
): SamplingData[] => {
    const segmentLength = parameters.length / parameters.segments;

    const radiusCurve = new ParametricSpline2D(parameters.radiusCurveParameters, parameters.radius, parameters.radiusScale);
    const shapeCurveX = new ParametricSpline2D(parameters.shapeCurveX, 1, parameters.shapeCurveScale);
    const shapeCurveZ = new ParametricSpline2D(parameters.shapeCurveZ, 1, parameters.shapeCurveScale);

    const shapeScaleHalf = parameters.shapeCurveScale / 2;
    const generatedSamplingData: SamplingData[] = [];
    const normal = new Vector3(0, 1, 0);

    for (let countIndex = 0; countIndex < parameters.count; countIndex++) {
        const firstPoint = new Vector3(
            shapeCurveX.getAt(0) - shapeScaleHalf,
            0,
            shapeCurveZ.getAt(0) - shapeScaleHalf
        );

        const baseCurve = new CatmullRomCurve3([firstPoint], false, "catmullrom", 1);

        for (let segmentIndex = 1; segmentIndex <= parameters.segments; segmentIndex++) {
            const t = segmentIndex / parameters.segments;
            const point = new Vector3(0, segmentIndex * segmentLength, 0);

            point.x += shapeCurveX.getAt(t) - shapeScaleHalf;
            point.z += shapeCurveZ.getAt(t) - shapeScaleHalf;

            if (parameters.turbulence) {
                point.x += random.nextRange(-parameters.turbulence, parameters.turbulence);
                point.z += random.nextRange(-parameters.turbulence, parameters.turbulence);
            }

            baseCurve.points.push(point);
        }

        const offset = 0;

        generatedSamplingData.push({
            parent: null,
            baseCurve,
            radiusCurve,
            offset,
            normal,
            position: ZERO_VECTOR,
            rotation: ZERO_VECTOR,
        })
    }

    return generatedSamplingData;
}

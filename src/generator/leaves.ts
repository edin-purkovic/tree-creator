import { CatmullRomCurve3, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { SamplingData, EMPTY_RADIUS_CURVE, ZERO_VECTOR, RIGHT_VECTOR, FORWARD_VECTOR } from "@/generator/base";
import { ParametricSpline2D, Spline2DParameters } from "@/generator/spline";
import { SeededRandom } from "@/utils/random";

export interface LeavesGeneratorParameters {
    segments: number;
    startU: number;
    startV: number;
    endU: number;
    endV: number;
    length: number;
    width: number;
    positionCurveParameters: Spline2DParameters;
    scaleCurveParameters: Spline2DParameters;
    angle: number;
    gravity: number;
    count: number;
    shape: "default";
}

export type SampledLeavesPosition = {
    positionT: number;
    directionAngle: number;
}

export const sampleLeavesPositions = (
    _samplingSource: SamplingData,
    parameters: LeavesGeneratorParameters,
    random: SeededRandom,
): SampledLeavesPosition[] => {
    const positionCurve = new ParametricSpline2D(parameters.positionCurveParameters, 1);

    const positions: SampledLeavesPosition[] = [];

    for (let branchIndex = 1; branchIndex <= parameters.count; branchIndex++) {
        const t = branchIndex / parameters.count;
        const positionT = positionCurve.getAt(t);

        const directionAngle = random.nextMaxInt(360);

        positions.push({
            positionT,
            directionAngle,
        });
    }

    return positions;
}

export const generateLeaveInstanceSamplingData = (
    leavesPosition: SampledLeavesPosition,
    samplingSource: SamplingData,
    parameters: LeavesGeneratorParameters,
    _random: SeededRandom,
): SamplingData => {
    const scaleCurve = new ParametricSpline2D(parameters.scaleCurveParameters, 1);
    const baseCurve = new CatmullRomCurve3([], false, "catmullrom", 1);


    const radiusBase = samplingSource.radiusCurve.getAt(leavesPosition.positionT);
    let position = samplingSource.baseCurve.getPointAt(leavesPosition.positionT);

    const length = scaleCurve.getAt(leavesPosition.positionT) * parameters.length;
    const rotation = new Vector3(0, degToRad(leavesPosition.directionAngle), 0);

    const direction = RIGHT_VECTOR.clone().multiplyScalar(length);
    const firstPointOffset = direction.clone().multiplyScalar(radiusBase);
    const endPoint = RIGHT_VECTOR.clone().add(direction).add(firstPointOffset);

    const startPoint = ZERO_VECTOR.clone().add(firstPointOffset);

    let previousPointLocal: Vector3 = startPoint;
    let previousPoint: Vector3 = startPoint;

    const gravityStep = parameters.gravity;

    const normal = direction.clone();

    baseCurve.points.push(startPoint);

    for (let i = 1; i <= parameters.segments; i++) {
        const t = i / parameters.segments;
        const angle = degToRad(gravityStep * i);

        const nextPoint = startPoint.clone().lerp(endPoint, t);
        const segmentEndpoint = nextPoint.clone().sub(previousPointLocal);

        segmentEndpoint.applyAxisAngle(new Vector3(0, 0, 1), angle)

        previousPoint = previousPoint.clone().add(segmentEndpoint)

        baseCurve.points.push(previousPoint);

        previousPointLocal = nextPoint;
    }

    for (let i = 1; i <= parameters.segments; i++) {
        baseCurve.points[i].applyAxisAngle(FORWARD_VECTOR, degToRad(parameters.angle))
    }

    return {
        parent: samplingSource,
        baseCurve,
        radiusCurve: EMPTY_RADIUS_CURVE,
        offset: 0,
        normal: normal,
        position: position,
        rotation: rotation,
    }
}

export const generateLeavesSamplingData = (
    positions: SampledLeavesPosition[],
    parentSamplingSource: SamplingData,
    parameters: LeavesGeneratorParameters,
    random: SeededRandom
): SamplingData[] => {
    const branchSamplingSources: SamplingData[] = [];

    for (let positionIndex = 0; positionIndex < positions.length; positionIndex++) {
        const position = positions[positionIndex];

        branchSamplingSources.push(
            generateLeaveInstanceSamplingData(position, parentSamplingSource, parameters, random)
        );
    }

    return branchSamplingSources;
}

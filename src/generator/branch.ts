import { CatmullRomCurve3, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { SamplingData, ZERO_VECTOR, FORWARD_VECTOR, RIGHT_VECTOR } from "@/generator/base";
import { ParametricSpline2D, Spline2DParameters } from "@/generator/spline";
import { BaseGeneratorParameters } from "@/generator/trunk";
import { SeededRandom } from "@/utils/random";

export interface BranchGeneratorParameters extends BaseGeneratorParameters {
    length: number;
    lengthScale: number;
    lengthCurveParameters: Spline2DParameters;
    radiusScale: number;
    radiusCurveParameters: Spline2DParameters;
    positionCurveParameters: Spline2DParameters;
    turbulence: number;
    originOffset: number;
    angle: number;
    gravity: number;
    pull: number;
    count: number;
}

export type SampledBranchPosition = {
    positionT: number;
    directionAngle: number;
}

export const sampleBranchPositions = (
    _samplingSource: SamplingData,
    parameters: BranchGeneratorParameters,
    random: SeededRandom,
): SampledBranchPosition[] => {

    const positionCurve = new ParametricSpline2D(parameters.positionCurveParameters, 1);

    const positions: SampledBranchPosition[] = [];

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

export const generateBranchSamplingData = (
    branchPosition: SampledBranchPosition,
    samplingSource: SamplingData,
    parameters: BranchGeneratorParameters,
    random: SeededRandom,
): SamplingData => {
    const radiusBase = samplingSource.radiusCurve.getAt(branchPosition.positionT);
    const radiusCurve = new ParametricSpline2D(parameters.radiusCurveParameters, radiusBase, parameters.radiusScale);
    const lengthCurve = new ParametricSpline2D(parameters.lengthCurveParameters, 1);
    const baseCurve = new CatmullRomCurve3([], false, "catmullrom", 1);

    const length = lengthCurve.getAt(branchPosition.positionT) * parameters.length;
    const position = samplingSource.baseCurve.getPointAt(branchPosition.positionT);
    const rotation = new Vector3(0, degToRad(branchPosition.directionAngle), 0);

    const direction = RIGHT_VECTOR.clone().multiplyScalar(length);
    const firstPointOffset = direction.clone().multiplyScalar(radiusBase);
    const endPoint = RIGHT_VECTOR.clone().add(direction).add(firstPointOffset);

    if (parameters.originOffset) {
        let offsetT = branchPosition.positionT;

        if (parameters.originOffset > 0) {
            // TODO: handle positive origin offset
        }

        // TODO: fix negative origin offset
        if (parameters.originOffset < 0 && branchPosition.positionT > -parameters.originOffset) {
            offsetT = branchPosition.positionT + parameters.originOffset;
        }

        const originOffsetPoint = samplingSource.baseCurve.getPointAt(offsetT);

        baseCurve.points.push(originOffsetPoint.clone().sub(position));
    } else {
        baseCurve.points.push(ZERO_VECTOR);
    }

    const startPoint = ZERO_VECTOR.clone().add(firstPointOffset);

    let previousPointLocal: Vector3 = startPoint;
    let previousPoint: Vector3 = startPoint;

    const gravityStep = parameters.gravity;

    const normal = direction.clone();

    for (let i = 1; i <= parameters.segments; i++) {
        const t = i / parameters.segments;
        const angle = degToRad(gravityStep * i);

        const nextPoint = startPoint.clone().lerp(endPoint, t);
        const segmentEndpoint = nextPoint.clone().sub(previousPointLocal);

        segmentEndpoint.applyAxisAngle(new Vector3(0, 0, 1), angle)
        segmentEndpoint.y += parameters.pull;

        if (parameters.turbulence) {
            segmentEndpoint.y += random.nextRange(-parameters.turbulence, parameters.turbulence);
            segmentEndpoint.z += random.nextRange(-parameters.turbulence, parameters.turbulence);
        }

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
        radiusCurve,
        offset: 0,
        normal: normal,
        position: position,
        rotation: rotation,
    }
}

export const generateBranchesSamplingData = (
    positions: SampledBranchPosition[],
    parentSamplingSource: SamplingData,
    parameters: BranchGeneratorParameters,
    random: SeededRandom,
): SamplingData[] => {
    const branchSamplingSources: SamplingData[] = [];

    for (let positionIndex = 0; positionIndex < positions.length; positionIndex++) {
        const position = positions[positionIndex];

        branchSamplingSources.push(
            generateBranchSamplingData(position, parentSamplingSource, parameters, random)
        );
    }

    return branchSamplingSources;
}

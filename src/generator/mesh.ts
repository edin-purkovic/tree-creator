import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { SamplingData } from "@/generator/base";
import { BaseGeneratorParameters } from "@/generator/trunk";
import { LeavesGeneratorParameters } from "@/generator/leaves";

export type MeshStats = {
    vertexCount: number;
    indexCount: number;
    triangleCount: number;
}

export type MeshDataType = {
    positions: Float32Array;
    normals: Float32Array;
    uvs: Float32Array;
    indices: Uint32Array;
}

export const generateMeshDataBySamplingData = (
    samplingData: SamplingData,
    parameters: BaseGeneratorParameters,
    flatStart: boolean,
    meshStats?: MeshStats,
): MeshDataType => {
    const segments = parameters.segments;
    const segmentResolution = segments * parameters.segmentsMultiplier;
    const sides = parameters.sides;

    const endRadius = samplingData.radiusCurve.getAt(1) > 0.05;
    const vertexCount = ((segmentResolution + 1) * (sides + 1)) + (endRadius ? sides + 2 : 0);
    const indexCount = (segmentResolution * sides * 6) + (endRadius ? sides * 3 : 0);

    const positions = new Float32Array(vertexCount * 3)
    const normals = new Float32Array(vertexCount * 3)
    const uvs = new Float32Array(vertexCount * 2)
    const indices = new Uint32Array(indexCount);

    const length = samplingData.baseCurve.getLength();

    const angleStep = 360 / sides;
    const twistStep = parameters.twist / (segmentResolution + 1);
    const uvStep = 1 / sides;

    let segmentNormal = new Vector3(0, 0, -1);
    let segmentBinormal = new Vector3();
    let segmentRight = new Vector3(1, 0, 0);
    let segmentUp = new Vector3(0, 1, 0);

    let vertexFloatOffset = 0;
    let uvFloatOffset = 0;
    let indexOffset = 0;

    for (let segmentIndex = 0; segmentIndex <= segmentResolution; segmentIndex++) {
        const t = segmentIndex / segmentResolution;
        const lt = length / segmentResolution;
        const point = samplingData.baseCurve.getPointAt(t);
        const initialRadius = samplingData.radiusCurve.getAt(t);
        let radius = initialRadius;

        const tangent = segmentIndex === 0 && flatStart ? segmentUp : samplingData.baseCurve.getTangent(t);

        segmentBinormal.crossVectors(segmentNormal, tangent);
        segmentNormal.crossVectors(tangent, segmentBinormal);

        segmentBinormal.normalize();
        segmentNormal.normalize();

        const direction = segmentIndex === 0 && flatStart ? segmentRight : segmentBinormal;

        const indexSegmentOffset = segmentIndex * (sides + 1);

        const twistAngle = degToRad(twistStep * segmentIndex);

        // generate side vertices
        for (let sideIndex = 0; sideIndex <= sides; sideIndex++) {
            const angle = degToRad(angleStep * sideIndex);

            const vertex = direction.clone().multiplyScalar(radius).applyAxisAngle(tangent, angle + twistAngle).add(point);
            const normal = direction.clone().applyAxisAngle(tangent, angle + twistAngle);

            positions[vertexFloatOffset] = vertex.x;
            positions[vertexFloatOffset + 1] = vertex.y;
            positions[vertexFloatOffset + 2] = vertex.z;

            normals[vertexFloatOffset] = normal.x;
            normals[vertexFloatOffset + 1] = normal.y;
            normals[vertexFloatOffset + 2] = normal.z;

            uvs[uvFloatOffset] = sideIndex * uvStep * parameters.scaleU;
            uvs[uvFloatOffset + 1] = segmentIndex * lt * parameters.scaleV;

            vertexFloatOffset += 3;
            uvFloatOffset += 2;
        }

        // generate side indices
        for (let sideIndex = 0; sideIndex < sides; sideIndex++) {
            if (segmentIndex < segmentResolution) {
                const indexAnchor = indexSegmentOffset + sideIndex;

                // first triangle
                indices[indexOffset + 0] = indexAnchor;
                indices[indexOffset + 1] = indexAnchor + 1;
                indices[indexOffset + 2] = indexAnchor + sides + 1;

                // second triangle
                indices[indexOffset + 3] = indexAnchor + sides + 1;
                indices[indexOffset + 4] = indexAnchor + 1;
                indices[indexOffset + 5] = indexAnchor + sides + 2;

                indexOffset += 6
            }
        }

        // generate cap vertices and indices
        if (segmentIndex === segmentResolution && endRadius) {
            generateMeshCap(
                samplingData,
                parameters,
                tangent,
                direction,
                positions,
                normals,
                uvs,
                indices,
                vertexFloatOffset,
                uvFloatOffset,
                indexOffset
            );
        }
    }

    if (meshStats) {
        meshStats.vertexCount += vertexCount;
        meshStats.indexCount += indexCount;
        meshStats.triangleCount += (indexCount / 3);
    }

    return { positions, normals, uvs, indices }
}

const generateMeshCap = (
    samplingData: SamplingData,
    parameters: BaseGeneratorParameters,
    tangent: Vector3,
    direction: Vector3,
    positions: Float32Array,
    normals: Float32Array,
    uvs: Float32Array,
    indices: Uint32Array,
    vertexFloatOffset: number,
    uvFloatOffset: number,
    indexOffset: number,
) => {
    const point = samplingData.baseCurve.getPointAt(1);
    const radius = samplingData.radiusCurve.getAt(1);
    const centerIndex = vertexFloatOffset / 3;
    const angleStep = 360 / parameters.sides;
    const twistAngle = degToRad(parameters.twist);
    const capOffsetPoint = point.clone().add(tangent.clone().multiplyScalar(parameters.capOffset));

    // generate cap center vertex
    positions[vertexFloatOffset] = capOffsetPoint.x;
    positions[vertexFloatOffset + 1] = capOffsetPoint.y;
    positions[vertexFloatOffset + 2] = capOffsetPoint.z;
    normals[vertexFloatOffset] = tangent.x;
    normals[vertexFloatOffset + 1] = tangent.y;
    normals[vertexFloatOffset + 2] = tangent.z;
    uvs[uvFloatOffset] = .5;
    uvs[uvFloatOffset + 1] = .5;

    vertexFloatOffset += 3;
    uvFloatOffset += 2;

    // generate cap side vertices
    for (let sideIndex = 0; sideIndex <= parameters.sides; sideIndex++) {
        const angle = degToRad(angleStep * sideIndex);

        const vertex = direction.clone().multiplyScalar(radius).applyAxisAngle(tangent, angle + twistAngle).add(point);

        positions[vertexFloatOffset] = vertex.x;
        positions[vertexFloatOffset + 1] = vertex.y;
        positions[vertexFloatOffset + 2] = vertex.z;
        normals[vertexFloatOffset] = tangent.x;
        normals[vertexFloatOffset + 1] = tangent.y;
        normals[vertexFloatOffset + 2] = tangent.z;
        uvs[uvFloatOffset] = Math.sin(angle);
        uvs[uvFloatOffset + 1] = Math.cos(angle);

        vertexFloatOffset += 3;
        uvFloatOffset += 2;
    }

    // generate cap triangle fan indices
    for (let sideIndex = 0; sideIndex < parameters.sides; sideIndex++) {
        const indexAnchor = 1 + sideIndex;

        indices[indexOffset + 0] = centerIndex;
        indices[indexOffset + 1] = centerIndex + indexAnchor;
        indices[indexOffset + 2] = centerIndex + indexAnchor + 1;

        indexOffset += 3
    }
}

export const generateLeavesMeshDataBySamplingData = (
    _samplingData: SamplingData,
    parameters: LeavesGeneratorParameters,
    meshStats?: MeshStats,
): MeshDataType => {
    const middle = parameters.length / 2;

    const positions = new Float32Array([
        /* start-top */ 0, 0, 0, /* end-top */ parameters.length, 0, 0, /* right-top */ middle, 0, parameters.width,
        /* left-top */ middle, 0, -parameters.width, /* top-top */ middle, parameters.width, 0, /* bottom-top */ middle, -parameters.width, 0,
        /* start-bottom */ 0, 0, 0, /* end-bottom */ parameters.length, 0, 0, /* right-bottom */ middle, 0, parameters.width,
        /* left-bottom */ middle, 0, -parameters.width, /* top-bottom */ middle, parameters.width, 0, /* bottom-bottom */ middle, -parameters.width, 0,
    ]);

    const normals = new Float32Array([
        /* start-top */ 0, 1, 0, /* end-top */ 0, 1, 0, /* right-top */ 0, 1, 0,
        /* left-top */ 0, 1, 0, /* top-top */ 1, 0, 0, /* bottom-top */ 1, 0, 0,
        /* start-bottom */ 0, -1, 0, /* end-bottom */ 0, -1, 0, /* right-bottom */ 0, -1, 0,
        /* left-bottom */ 0, -1, 0, /* top-bottom */ -1, 0, 0, /* bottom-bottom */ -1, 0, 0,
    ]);

    const uvs = new Float32Array([
        /* start-top */ 0, 0, /* end-top */ 1, 1, /* right-top */ 1, 0, /* left-top */ 0, 1, /* top-top */ 0, 1,/* bottom-top */ 0, 1,
        /* start-bottom */ 0, 0, /* end-bottom */ 1, 1, /* right-bottom */ 1, 0, /* left-bottom */ 0, 1, /* top-bottom */ 0, 1,/* bottom-bottom */ 0, 1,
    ]);

    const indices = new Uint32Array([
        /* right-top */ 0, 2, 1, /* left-top */ 0, 1, 3, /* top-top */ 0, 4, 1,/* bottom-top */ 0, 1, 5,
        /* right-bottom */ 6, 7, 8, /* left-bottom */ 6, 9, 7, /* top-bottom */ 6, 7, 10,/* bottom-bottom */ 6, 11, 7,
    ]);

    const xyz = new Vector3();
    const axisAngle = new Vector3(0, 0, 1);

    for (let index = positions.length / 3; index--;) {
        const offset = index * 3;

        xyz.set(
            positions[offset],
            positions[offset + 1],
            positions[offset + 2]
        ).applyAxisAngle(axisAngle, degToRad(parameters.angle));

        positions[offset] = xyz.x;
        positions[offset + 1] = xyz.y;
        positions[offset + 2] = xyz.z;

        xyz.set(
            normals[offset],
            normals[offset + 1],
            normals[offset + 2]
        ).applyAxisAngle(axisAngle, degToRad(parameters.angle));

        normals[offset] = xyz.x;
        normals[offset + 1] = xyz.y;
        normals[offset + 2] = xyz.z;
    }

    if (meshStats) {
        meshStats.vertexCount += 12;
        meshStats.indexCount += 24;
        meshStats.triangleCount += 8;
    }

    return { positions, normals, uvs, indices }
}

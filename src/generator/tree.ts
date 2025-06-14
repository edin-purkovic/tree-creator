import { nanoid } from "nanoid";
import { SamplingData } from "@/generator/base";
import { generateTrunkSamplingData, TrunkGeneratorParameters } from "@/generator/trunk";
import { BranchGeneratorParameters, generateBranchesSamplingData, sampleBranchPositions } from "@/generator/branch";
import { generateLeavesSamplingData, LeavesGeneratorParameters, sampleLeavesPositions } from "@/generator/leaves";
import { generateLeavesMeshDataBySamplingData, generateMeshDataBySamplingData, MeshDataType, MeshStats } from "@/generator/mesh";
import { NodeBaseProps } from '@/components/node-editor/base';
import { NodeMap, nodesToMap } from '@/components/node-editor/node-utils';
import { SeededRandom } from "@/utils/random";

export class TreeMeshElement {
    samplingData: SamplingData;
    mesh: MeshDataType;
    name: string;

    constructor(name: string, samplingData: SamplingData, mesh: MeshDataType) {
        this.samplingData = samplingData;
        this.mesh = mesh;
        this.name = name;
    }
}

export class TreeGenerator {
    trunks: TreeMeshElement[] = [];
    branches: TreeMeshElement[] = [];
    leaves: TreeMeshElement[] = [];
    random: SeededRandom = new SeededRandom(1);

    meshStats: MeshStats = {
        vertexCount: 0,
        indexCount: 0,
        triangleCount: 0,
    }

    version: string;

    constructor(nodes?: NodeBaseProps[]) {
        this.version = nanoid();
        
        if (nodes && nodes.length) {
            const nodeMap = nodesToMap(nodes);
            if (!nodeMap.has("tree")) {
                return;
            }

            this.random = new SeededRandom(nodeMap.get("tree")?.properties.seed);
            this.generateFromNodes(nodeMap);
        }
    }

    generateFromNodes(nodeMap: NodeMap) {
        this.trunks = [];
        this.branches = [];

        this.executeNode(nodeMap, "tree", null, null);
    }

    private executeNode(nodeMap: NodeMap, nodeId: string, _parent: any, payload: any) {
        const node = nodeMap.get(nodeId);

        if (!node || !node.enabled) {
            return;
        }

        const connectionsCount = node.connectedTo?.length ?? 0;

        let generated_payload = null;

        if (node.type === "trunk") {
            generated_payload = this.generateTrunks(node, nodeId, payload)
        }

        if (node.type === "branch") {
            generated_payload = this.generateBranches(node, nodeId, payload)
        }

        if (node.type === "leaves") {
            generated_payload = this.generateLeaves(node, nodeId, payload)
        }

        for (let index = 0; index < connectionsCount; index++) {
            const nodeConnection = node.connectedTo?.[index];

            if (nodeConnection) {
                this.executeNode(nodeMap, nodeConnection, node, generated_payload);
            }
        }
    }

    private generateTrunks(node: any, _nodeId: string, _payload: any) {
        const trunkParameters = node.properties as TrunkGeneratorParameters;
        const trunkCurves = generateTrunkSamplingData(trunkParameters, this.random);

        for (let sourceIndex = 0; sourceIndex < trunkCurves.length; sourceIndex++) {
            const samplingSource = trunkCurves[sourceIndex];
            const trunkMesh = generateMeshDataBySamplingData(samplingSource, trunkParameters, true, this.meshStats);
            const trunkName = `${node.name}__${sourceIndex}`;

            this.trunks.push(new TreeMeshElement(trunkName, samplingSource, trunkMesh));
        }

        return trunkCurves;
    }

    private generateBranches(node: any, _nodeId: string, payload: any) {
        const samplingSources = payload as SamplingData[];
        const returnedSampleSources: SamplingData[] = [];

        for (let sourceIndex = 0; sourceIndex < samplingSources.length; sourceIndex++) {
            const samplingSource = samplingSources[sourceIndex];
            const branchParameters = node.properties as BranchGeneratorParameters;
            const branchPositions = sampleBranchPositions(samplingSource, branchParameters, this.random);
            const branchesSamplingData = generateBranchesSamplingData(branchPositions, samplingSource, branchParameters, this.random);

            for (let branchIndex = 0; branchIndex < branchesSamplingData.length; branchIndex++) {
                const branchSamplingData = branchesSamplingData[branchIndex];
                const branchMesh = generateMeshDataBySamplingData(branchSamplingData, branchParameters, false, this.meshStats);
                const branchName = `${node.name}__${nanoid()}`;

                returnedSampleSources.push(branchSamplingData);
                this.branches.push(new TreeMeshElement(branchName, branchSamplingData, branchMesh));
            }
        }

        return returnedSampleSources;
    }

    private generateLeaves(node: any, _nodeId: string, payload: any) {
        const samplingSources = payload as SamplingData[];
        const returnedSampleSources: SamplingData[] = [];

        for (let sourceIndex = 0; sourceIndex < samplingSources.length; sourceIndex++) {
            const samplingSource = samplingSources[sourceIndex];
            const leavesParameters = node.properties as LeavesGeneratorParameters;
            const leavesPositions = sampleLeavesPositions(samplingSource, leavesParameters, this.random);
            const leavesSamplingData = generateLeavesSamplingData(leavesPositions, samplingSource, leavesParameters, this.random);

            for (let leavesIndex = 0; leavesIndex < leavesSamplingData.length; leavesIndex++) {
                const leavesInstanceSamplingData = leavesSamplingData[leavesIndex];
                const leavesMesh = generateLeavesMeshDataBySamplingData(leavesInstanceSamplingData, leavesParameters, this.meshStats);
                const leavesName = `${node.name}__${nanoid()}`;

                returnedSampleSources.push(leavesInstanceSamplingData);
                this.leaves.push(new TreeMeshElement(leavesName, leavesInstanceSamplingData, leavesMesh));
            }
        }

        return returnedSampleSources;
    }
}
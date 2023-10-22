import {
    Edge,
    Node,
    OnConnect,
    OnEdgesChange,
    OnNodesChange,
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
} from "reactflow";
import { create } from "zustand";

import {
    DEFAULT_TASK_NODE_POSX,
    DEFAULT_TASK_NODE_POSY,
    DEFAULT_WORKFLOW_NAME,
} from "../constants";
import { Task, Workflow } from "../interfaces/workflow";

export type TaskNodeData = {
    repo?: string;
    rev?: string;
    moduleId: string;
    config: {
        [k: string]: unknown;
    };
};

export const TASK_NODE_TYPE = "task";

export type TaskNode = Node<TaskNodeData, typeof TASK_NODE_TYPE>;

export type WorkflowState = {
    filename?: string;
    name: string;
    nodes: Node[];
    edges: Edge[];
};

type WorkflowActions = {
    setName: (name: string) => void;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    clear: () => void;
    save: () => Workflow;
    load: (workflow: Workflow, filename?: string) => void;
};

const defaultWorkflowState: WorkflowState = {
    filename: undefined,
    name: DEFAULT_WORKFLOW_NAME,
    nodes: [],
    edges: [],
};

const useWorkflowStore = create<WorkflowState & WorkflowActions>()(
    (set, get) => ({
        ...defaultWorkflowState,
        setName: (name) => set({ name: name }),
        setNodes: (nodes) => set({ nodes: nodes }),
        setEdges: (edges) => set({ edges: edges }),
        onNodesChange: (changes) =>
            set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),
        onEdgesChange: (changes) =>
            set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),
        onConnect: (connection) =>
            set((state) => ({ edges: addEdge(connection, state.edges) })),
        clear: () => set({ ...defaultWorkflowState }),
        save: () => {
            const state = get();
            return {
                name: state.name,
                tasks: state.nodes
                    .filter((node) => node.type === TASK_NODE_TYPE)
                    .map((node) =>
                        getTask(
                            node as TaskNode,
                            state.edges.filter(
                                (edge) => edge.target === node.id,
                            ),
                            state.edges.filter(
                                (edge) => edge.source === node.id,
                            ),
                        ),
                    ),
            };
        },
        load: (workflow, filename?: string) => {
            set({
                ...defaultWorkflowState,
                filename: filename,
                name: workflow.name,
                nodes: workflow.tasks?.map((task) => createTaskNode(task)),
                edges: createWorkflowEdges(workflow),
            });
        },
    }),
);

function getTask(
    node: TaskNode,
    inputEdges: Edge[],
    outputEdges: Edge[],
): Task {
    return {
        id: node.id,
        repo: node.data.repo,
        rev: node.data.rev,
        module: node.data.moduleId,
        inputs: inputEdges.map((edge) => ({
            channel: edge.targetHandle!,
            resource: edge.id,
        })),
        outputs: outputEdges.map((edge) => ({
            channel: edge.sourceHandle!,
            resource: edge.id,
        })),
        config: node.data.config,
        props: {
            posx: node.position.x,
            posy: node.position.y,
            width: node.width,
            height: node.height,
        },
    };
}

function createTaskNode(task: Task): TaskNode {
    return {
        id: task.id,
        type: TASK_NODE_TYPE,
        position: {
            x: task.props?.posx ?? DEFAULT_TASK_NODE_POSX,
            y: task.props?.posy ?? DEFAULT_TASK_NODE_POSY,
        },
        width: task.props?.width,
        height: task.props?.height,
        data: {
            repo: task.repo ?? undefined,
            rev: task.rev ?? undefined,
            moduleId: task.module,
            config: task.config as { [k: string]: unknown },
        },
    };
}

function createWorkflowEdges(workflow: Workflow) {
    const resources = new Set<string>();
    const resourceSources = new Map<string, [string, string][]>();
    const resourceTargets = new Map<string, [string, string][]>();
    for (const task of workflow.tasks ?? []) {
        for (const output of task.outputs ?? []) {
            resources.add(output.resource);
            if (!resourceSources.has(output.resource)) {
                resourceSources.set(output.resource, []);
            }
            resourceSources
                .get(output.resource)!
                .push([task.id, output.channel]);
        }
        for (const input of task.inputs ?? []) {
            resources.add(input.resource);
            if (!resourceTargets.has(input.resource)) {
                resourceTargets.set(input.resource, []);
            }
            resourceTargets.get(input.resource)!.push([task.id, input.channel]);
        }
    }
    const edges: Edge[] = [];
    for (const resource of resources) {
        const sources = resourceSources.get(resource) ?? [];
        const targets = resourceTargets.get(resource) ?? [];
        for (const [sourceTaskId, sourceChannel] of sources) {
            for (const [targetTaskId, targetChannel] of targets) {
                edges.push({
                    id: resource,
                    source: sourceTaskId,
                    sourceHandle: sourceChannel,
                    target: targetTaskId,
                    targetHandle: targetChannel,
                });
            }
        }
    }
    return edges;
}

export default useWorkflowStore;

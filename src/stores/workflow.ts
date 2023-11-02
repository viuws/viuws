import {
    Edge,
    Node,
    OnConnect,
    OnEdgesChange,
    OnNodesChange,
    XYPosition,
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
} from "reactflow";
import { create } from "zustand";

import { DEFAULT_WORKFLOW_NAME } from "../constants";
import { Workflow } from "../interfaces/workflow";
import { RESOURCE_EDGE_TYPE, ResourceEdge } from "../model/edges/ResourceEdge";
import { TASK_NODE_TYPE, TaskNode } from "../model/nodes/TaskNode";
import { fetchLatestGithubRevision, parseGithubRepo } from "../utils/github";
import {
    getNextId,
    getWorkflowEdges,
    getWorkflowNodes,
    getWorkflowTasks,
} from "../utils/model";

type WorkflowState = {
    filename: string | null;
    name: string;
    nodes: Node[];
    edges: Edge[];
};

type WorkflowActions = {
    setName: (name: string) => void;
    addTaskNodeAsync: (
        repo: string | null,
        moduleId: string,
        position: XYPosition,
        onError: (error: string) => void,
    ) => void;
    setTaskNodeId: (taskNodeId: string, newId: string) => void;
    setTaskNodeConfig: (
        taskNodeId: string,
        newConfig: { [k: string]: unknown },
    ) => void;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    load: (workflow: Workflow, filename: string) => void;
    save: () => { workflow: Workflow; filename: string };
    clear: () => void;
};

const defaultWorkflowState: WorkflowState = {
    filename: null,
    name: DEFAULT_WORKFLOW_NAME,
    nodes: [],
    edges: [],
};

const useWorkflowStore = create<WorkflowState & WorkflowActions>()(
    (set, get) => ({
        ...defaultWorkflowState,
        setName: (name) => {
            set({ name: name });
        },
        addTaskNodeAsync: (repo, moduleId, position, onError) => {
            let revPromise = Promise.resolve(null as string | null);
            if (repo) {
                const github = parseGithubRepo(repo);
                if (github) {
                    revPromise = fetchLatestGithubRevision(github);
                }
            }
            revPromise.then((rev) => {
                set((state) => {
                    const taskNodeId = getNextId(
                        moduleId,
                        state.nodes
                            .filter((node) => node.type == TASK_NODE_TYPE)
                            .map((node) => node.id),
                    );
                    const taskNode: TaskNode = {
                        id: taskNodeId,
                        type: TASK_NODE_TYPE,
                        position: position,
                        data: {
                            repo: repo ?? undefined,
                            rev: rev ?? undefined,
                            moduleId: moduleId,
                            config: {},
                        },
                    };
                    return { nodes: [...state.nodes, taskNode] };
                });
            }, onError);
        },
        setTaskNodeId: (taskNodeId, newId) => {
            set((state) => ({
                nodes: state.nodes.map((node) => {
                    if (
                        node.id === taskNodeId &&
                        node.type === TASK_NODE_TYPE
                    ) {
                        const taskNode: TaskNode = {
                            ...(node as TaskNode),
                            id: newId,
                        };
                        return taskNode;
                    }
                    return node;
                }),
            }));
        },
        setTaskNodeConfig: (taskNodeId, newConfig) => {
            set((state) => ({
                nodes: state.nodes.map((node) => {
                    if (
                        node.id === taskNodeId &&
                        node.type === TASK_NODE_TYPE
                    ) {
                        const taskNode: TaskNode = {
                            ...(node as TaskNode),
                            data: {
                                ...(node as TaskNode).data,
                                config: newConfig,
                            },
                        };
                        return taskNode;
                    }
                    return node;
                }),
            }));
        },
        onNodesChange: (changes) => {
            set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) }));
        },
        onEdgesChange: (changes) => {
            set((state) => ({ edges: applyEdgeChanges(changes, state.edges) }));
        },
        onConnect: (connection) => {
            set((state) => {
                const resourceEdgeId = getNextId(
                    connection.sourceHandle!,
                    state.edges
                        .filter((edge) => edge.type == RESOURCE_EDGE_TYPE)
                        .map((edge) => edge.id),
                );
                const resourceEdge: ResourceEdge = {
                    ...connection,
                    id: resourceEdgeId,
                    type: RESOURCE_EDGE_TYPE,
                    data: { resource: connection.sourceHandle! },
                } as ResourceEdge;
                return { edges: addEdge(resourceEdge, state.edges) };
            });
        },
        load: (workflow, filename) => {
            set({
                ...defaultWorkflowState,
                filename: filename,
                name: workflow.name,
                nodes: getWorkflowNodes(workflow),
                edges: getWorkflowEdges(workflow),
            });
        },
        save: () => {
            const state = get();
            const workflow: Workflow = {
                name: state.name,
                tasks: getWorkflowTasks(state.nodes, state.edges),
            };
            let filename = state.filename;
            if (!filename) {
                filename = `${state.name
                    .toLowerCase()
                    .replace(" ", "_")
                    .replace(/[^a-z0-9-_]/g, "")}.yaml`;
                set({ filename: filename });
            }
            return { workflow, filename };
        },
        clear: () => {
            set(defaultWorkflowState);
        },
    }),
);

export default useWorkflowStore;

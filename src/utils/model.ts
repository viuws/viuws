import { Edge, Node } from "reactflow";

import { DEFAULT_TASK_NODE_POSX, DEFAULT_TASK_NODE_POSY } from "../constants";
import { Task, Workflow } from "../interfaces/workflow";
import { RESOURCE_EDGE_TYPE, ResourceEdge } from "../model/edges/ResourceEdge";
import { TASK_NODE_TYPE, TaskNode } from "../model/nodes/TaskNode";

export function getNextId(prefix: string, currentIds: string[], sep = "_") {
    let n = 1;
    const ns = currentIds
        .filter((id) => id.startsWith(prefix + sep))
        .map((id) => parseInt(id.slice(prefix.length + sep.length)))
        .filter((n) => !isNaN(n) && n > 0);
    if (ns.length > 0) {
        n = Math.max(...ns) + 1;
    }
    return `${prefix}${sep}${n}`;
}

export function getWorkflowNodes(workflow: Workflow) {
    const nodes: Node[] = [];
    if (workflow.tasks) {
        for (const task of workflow.tasks) {
            const taskNode: TaskNode = {
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
                    config: task.config ?? {},
                },
            };
            nodes.push(taskNode);
        }
    }
    return nodes;
}

export function getWorkflowEdges(workflow: Workflow) {
    const resources = new Set<string>();
    const resourceSources = new Map<string, [string, string][]>();
    const resourceTargets = new Map<string, [string, string][]>();
    if (workflow.tasks) {
        for (const task of workflow.tasks) {
            if (task.outputs) {
                for (const output of task.outputs) {
                    resources.add(output.resource);
                    if (!resourceSources.has(output.resource)) {
                        resourceSources.set(output.resource, []);
                    }
                    resourceSources
                        .get(output.resource)!
                        .push([task.id, output.channel]);
                }
            }
            if (task.inputs) {
                for (const input of task.inputs) {
                    resources.add(input.resource);
                    if (!resourceTargets.has(input.resource)) {
                        resourceTargets.set(input.resource, []);
                    }
                    resourceTargets
                        .get(input.resource)!
                        .push([task.id, input.channel]);
                }
            }
        }
    }
    const edges: Edge[] = [];
    for (const resource of resources) {
        const sources = resourceSources.get(resource);
        const targets = resourceTargets.get(resource);
        if (sources && targets) {
            let i = 0;
            for (const [sourceTaskId, sourceChannel] of sources) {
                for (const [targetTaskId, targetChannel] of targets) {
                    const resourceEdge: ResourceEdge = {
                        id: `resource_${++i}`,
                        source: sourceTaskId,
                        sourceHandle: sourceChannel,
                        target: targetTaskId,
                        targetHandle: targetChannel,
                        data: {
                            resource: resource,
                        },
                    };
                    edges.push(resourceEdge);
                }
            }
        }
    }
    return edges;
}

export function getWorkflowTasks(nodes: Node[], edges: Edge[]) {
    const tasks: Task[] = [];
    const resourceEdges = edges
        .filter((edge) => edge.type == RESOURCE_EDGE_TYPE)
        .map((edge) => edge as ResourceEdge);
    for (const node of nodes) {
        if (node.type === TASK_NODE_TYPE) {
            const taskNode = node as TaskNode;
            const task: Task = {
                id: taskNode.id,
                repo: taskNode.data.repo,
                rev: taskNode.data.rev,
                module: taskNode.data.moduleId,
                inputs: resourceEdges
                    .filter(
                        (edge) =>
                            edge.target === taskNode.id &&
                            edge.data !== undefined,
                    )
                    .map((edge) => ({
                        channel: edge.targetHandle!,
                        resource: edge.data!.resource,
                    })),
                outputs: resourceEdges
                    .filter(
                        (edge) =>
                            edge.source === taskNode.id &&
                            edge.data !== undefined,
                    )
                    .map((edge) => ({
                        channel: edge.sourceHandle!,
                        resource: edge.data!.resource,
                    })),
                config: taskNode.data.config,
                props: {
                    posx: taskNode.position.x,
                    posy: taskNode.position.y,
                    width: taskNode.width,
                    height: taskNode.height,
                },
            };
            tasks.push(task);
        }
    }
    return tasks;
}

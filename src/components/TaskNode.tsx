import {
    JsonFormsCore,
    JsonSchema,
    UISchemaElement,
    createAjv,
} from "@jsonforms/core";
import { materialRenderers } from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Handle, Node, NodeProps, Position } from "reactflow";

import { Module } from "../interfaces/module";
import { Registry } from "../interfaces/registry";
import useWorkflowStore from "../stores/workflow";
import fetchYaml from "../utils/fetchYaml";
import getFetchableUrl from "../utils/getFetchableUrl";

export type TaskNodeData = {
    repo?: string;
    rev?: string;
    moduleId: string;
    config: unknown;
};

export type TaskNode = Node<TaskNodeData, "task">;

export default function TaskNodeComponent(props: NodeProps<TaskNodeData>) {
    const [module, setModule] = useState<Module | null>(null);
    const ajv = createAjv({ useDefaults: true });

    const workflowNodes = useWorkflowStore((workflow) => workflow.nodes);
    const setWorkflowNodes = useWorkflowStore((workflow) => workflow.setNodes);

    useEffect(() => {
        let ignore = false;
        const basePath = ".viuws";
        const registryPath = `${basePath}/registry.yaml`;
        const registryUrl = getFetchableUrl(props.data.repo, registryPath);
        fetchYaml<Registry>(registryUrl).then((registry) => {
            if (!ignore) {
                const moduleRef = registry.modules?.find(
                    (moduleRef) => moduleRef.id === props.data.moduleId,
                );
                if (moduleRef) {
                    const modulePath = `${basePath}/${moduleRef.path}`;
                    const moduleUrl = getFetchableUrl(
                        props.data.repo,
                        modulePath,
                    );
                    fetchYaml<Module>(moduleUrl).then((module) => {
                        if (!ignore) {
                            setModule(module);
                        }
                    }, console.error);
                }
            }
        }, console.error);
        return () => {
            ignore = true;
        };
    }, [props.data, setModule]);

    const onTaskIdChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setWorkflowNodes(
                workflowNodes.map((node) => {
                    if (node.type == "task" && node.id === props.id) {
                        const taskNode = node as TaskNode;
                        const newTaskNode: TaskNode = {
                            ...taskNode,
                            id: event.target.value,
                        };
                        return newTaskNode;
                    }
                    return node;
                }),
            );
        },
        [props.id, workflowNodes, setWorkflowNodes],
    );

    const onTaskConfigChange = useCallback(
        (state: Pick<JsonFormsCore, "data" | "errors">) => {
            setWorkflowNodes(
                workflowNodes.map((node: Node) => {
                    if (node.type == "task" && node.id === props.id) {
                        const taskNode = node as TaskNode;
                        const newTaskNode: TaskNode = {
                            ...taskNode,
                            data: {
                                ...taskNode.data,
                                config: state.data,
                            },
                        };
                        return newTaskNode;
                    }
                    return node;
                }),
            );
        },
        [props.id, workflowNodes, setWorkflowNodes],
    );

    if (!module) {
        return (
            <div className="flex items-center justify-center">
                <p>{props.id} (loading...)</p>
            </div>
        );
    }

    return (
        <>
            <div className="border rounded bg-gray-100 p-2 space-y-2">
                <div className="flex justify-center">
                    {module.iconUrl && (
                        <img
                            src={module.iconUrl}
                            alt={module.name}
                            className="inline-block max-h-12"
                        />
                    )}
                    <input
                        className="input input-ghost font-bold ml-2"
                        value={props.id}
                        onChange={onTaskIdChange}
                    />
                </div>
                {module.configSchema && module.configUISchema && (
                    <div>
                        <JsonForms
                            data={props.data.config}
                            schema={module.configSchema as JsonSchema}
                            uischema={
                                module.configUISchema as unknown as UISchemaElement
                            }
                            renderers={materialRenderers}
                            onChange={onTaskConfigChange}
                            ajv={ajv}
                        />
                    </div>
                )}
            </div>
            {module.inputChannels?.map((inputChannel) => (
                <Handle
                    id={inputChannel.id}
                    type="target"
                    position={Position.Left}
                />
            ))}
            {module.outputChannels?.map((outputChannel) => (
                <Handle
                    id={outputChannel.id}
                    type="source"
                    position={Position.Right}
                />
            ))}
        </>
    );
}

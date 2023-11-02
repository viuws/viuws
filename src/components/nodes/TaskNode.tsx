import { faPen, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    JsonFormsCore,
    JsonSchema,
    UISchemaElement,
    createAjv,
} from "@jsonforms/core";
import { materialRenderers } from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";

import { REGISTRY_PATH } from "../../constants";
import { Module } from "../../interfaces/module";
import { TaskNodeData } from "../../model/nodes/TaskNode";
import useConfigStore from "../../stores/config";
import useWorkflowStore from "../../stores/workflow";
import { fetchModule, fetchRegistry } from "../../utils/fetch";

export default function TaskNode(props: NodeProps<TaskNodeData>) {
    const ajv = useMemo(() => createAjv({ useDefaults: true }), []);
    const [module, setModule] = useState<Module | null>(null);

    const configAsRegistry = useConfigStore((config) => config.asRegistry);

    const setWorkflowTaskNodeId = useWorkflowStore(
        (workflow) => workflow.setTaskNodeId,
    );
    const setWorkflowTaskNodeConfig = useWorkflowStore(
        (workflow) => workflow.setTaskNodeConfig,
    );

    useEffect(() => {
        let ignore = false;
        let registryPromise;
        if (props.data.repo) {
            registryPromise = fetchRegistry(
                REGISTRY_PATH,
                props.data.repo,
                props.data.rev,
            );
        } else {
            registryPromise = Promise.resolve(configAsRegistry());
        }
        registryPromise.then((registry) => {
            if (!ignore) {
                const moduleRef = registry.modules?.find(
                    (moduleRef) => moduleRef.id === props.data.moduleId,
                );
                if (moduleRef) {
                    fetchModule(
                        moduleRef.path,
                        props.data.repo,
                        props.data.rev,
                    ).then((module) => {
                        if (!ignore) {
                            setModule(module);
                        }
                    }, console.error);
                } else {
                    console.error(`Module ${props.data.moduleId} not found`);
                }
            }
        }, console.error);
        return () => {
            ignore = true;
        };
    }, [props.data, configAsRegistry, setModule]);

    const onTaskIdChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const id = event.target.value;
            setWorkflowTaskNodeId(props.id, id);
        },
        [setWorkflowTaskNodeId, props.id],
    );

    const onTaskConfigChange = useCallback(
        ({ data }: Pick<JsonFormsCore, "data" | "errors">) => {
            const config = data as { [k: string]: unknown };
            setWorkflowTaskNodeConfig(props.id, config);
        },
        [setWorkflowTaskNodeConfig, props.id],
    );

    const onPlayButtonClick = useCallback(() => {
        // TODO play button
    }, []);

    const onEditButtonClick = useCallback(() => {
        // TODO edit button
    }, []);

    const onStopButtonClick = useCallback(() => {
        // TODO stop button
    }, []);

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
                <div className="space-x-2">
                    {module.iconUrl && (
                        <img
                            src={module.iconUrl}
                            alt={module.name}
                            className="inline-block max-h-12"
                        />
                    )}
                    <input
                        className="input input-ghost font-bold ml-2 w-40"
                        value={props.id}
                        onChange={onTaskIdChange}
                    />
                    <button className="btn btn-sm text-green-500">
                        <FontAwesomeIcon
                            icon={faPlay}
                            onClick={onPlayButtonClick}
                        />
                    </button>
                    <button className="btn btn-sm text-yellow-500">
                        <FontAwesomeIcon
                            icon={faPen}
                            onClick={onEditButtonClick}
                        />
                    </button>
                    <button className="btn btn-sm text-red-500">
                        <FontAwesomeIcon
                            icon={faStop}
                            onClick={onStopButtonClick}
                        />
                    </button>
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
                    key={inputChannel.id}
                    id={inputChannel.id}
                    type="target"
                    position={Position.Left}
                />
            ))}
            {module.outputChannels?.map((outputChannel) => (
                <Handle
                    key={outputChannel.id}
                    id={outputChannel.id}
                    type="source"
                    position={Position.Right}
                />
            ))}
        </>
    );
}

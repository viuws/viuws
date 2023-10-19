import { JsonSchema, UISchemaElement } from "@jsonforms/core";
import { materialRenderers } from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { useEffect, useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";

import { Module } from "../interfaces/module";
import { Registry } from "../interfaces/registry";
import fetchYaml from "../utils/fetchYaml";
import getFetchableUrl from "../utils/getFetchableUrl";

export type TaskNodeData = {
    repo?: string;
    rev?: string;
    module: string;
    envData: unknown;
    argsData: unknown;
};

export default function TaskNode(props: NodeProps) {
    const data = props.data as TaskNodeData;
    const [module, setModule] = useState<Module | null>(null);

    useEffect(() => {
        let ignore = false;

        function loadModule() {
            const basePath = ".viuws";
            const registryPath = `${basePath}/registry.yaml`;
            const registryUrl = getFetchableUrl(
                data.repo,
                registryPath,
                data.rev,
            );
            fetchYaml<Registry>(registryUrl).then((registry) => {
                if (!ignore) {
                    const moduleRef = registry.modules?.find(
                        (moduleRef) => moduleRef.id === data.module,
                    );
                    if (moduleRef) {
                        const modulePath = `${basePath}/${moduleRef.path}`;
                        const moduleUrl = getFetchableUrl(
                            data.repo,
                            modulePath,
                            data.rev,
                        );
                        fetchYaml<Module>(moduleUrl).then((module) => {
                            if (!ignore) {
                                setModule(module);
                            }
                        }, console.error);
                    }
                }
            }, console.error);
        }

        loadModule();

        return () => {
            ignore = true;
        };
    }, [data, setModule]);

    if (!module) {
        return (
            <div className="flex items-center justify-center">
                <p>{props.id} (loading...)</p>
            </div>
        );
    }

    return (
        <>
            <div className="border-2 rounded-lg bg-gray-100">
                <div className="mx-2 mt-2 flex justify-center">
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
                        onChange={undefined} // TODO
                    />
                </div>
                <details className="collapse collapse-arrow font-bold">
                    <summary className="collapse-title">Environment</summary>
                    <div className="collapse-content">
                        <JsonForms
                            schema={module.envSchema as JsonSchema}
                            uischema={module.envUISchema as UISchemaElement}
                            data={data.envData}
                            renderers={materialRenderers}
                            onChange={undefined} // TODO
                        />
                    </div>
                </details>
                <details className="collapse collapse-arrow font-bold">
                    <summary className="collapse-title">Arguments</summary>
                    <div className="collapse-content">
                        <JsonForms
                            schema={module.argsSchema as JsonSchema}
                            uischema={module.argsUISchema as UISchemaElement}
                            data={data.argsData}
                            renderers={materialRenderers}
                            onChange={undefined} // TODO
                        />
                    </div>
                </details>
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

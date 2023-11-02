import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dump as dumpYaml, load as loadYaml } from "js-yaml";
import { ChangeEvent, useCallback, useRef } from "react";

import { Workflow } from "../interfaces/workflow";
import useAppStore from "../stores/app";
import useWorkflowStore from "../stores/workflow";
import { createHiddenDownloadElement } from "../utils/dom";

export default function MenuBar() {
    const openWorkflowInput = useRef<HTMLInputElement>(null);

    const importPlugins = useAppStore((app) => app.importPlugins);
    const exportPlugins = useAppStore((app) => app.exportPlugins);

    const workflowName = useWorkflowStore((workflow) => workflow.name);
    const setWorkflowName = useWorkflowStore((workflow) => workflow.setName);
    const loadWorkflow = useWorkflowStore((workflow) => workflow.load);
    const saveWorkflow = useWorkflowStore((workflow) => workflow.save);
    const clearWorkflow = useWorkflowStore((workflow) => workflow.clear);

    const onNewWorkflowMenuItemClick = useCallback(() => {
        clearWorkflow();
    }, [clearWorkflow]);

    const onOpenWorkflowMenuItemClick = useCallback(() => {
        openWorkflowInput.current?.click();
    }, [openWorkflowInput]);

    const onOpenWorkflowInputChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            if (event.target.files) {
                const file = event.target.files[0];
                file.text().then((text) => {
                    const workflow = loadYaml(text) as Workflow;
                    loadWorkflow(workflow, file.name);
                }, console.error);
            }
        },
        [loadWorkflow],
    );

    const onDownloadWorkflowMenuItemClick = useCallback(() => {
        const { workflow, filename } = saveWorkflow();
        const downloadElement = createHiddenDownloadElement(
            new Blob([dumpYaml(workflow)], { type: "application/yaml" }),
            filename,
        );
        try {
            document.body.appendChild(downloadElement);
            downloadElement.click();
        } finally {
            document.body.removeChild(downloadElement);
        }
    }, [saveWorkflow]);

    return (
        <div className="navbar">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost btn-square">
                        <FontAwesomeIcon className="text-lg" icon={faBars} />
                    </label>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu shadow bg-base-100 rounded-box"
                    >
                        <li>
                            <a onClick={onNewWorkflowMenuItemClick}>New</a>
                        </li>
                        <li>
                            <a onClick={onOpenWorkflowMenuItemClick}>Open</a>
                        </li>
                        {importPlugins.size > 0 && (
                            <li>
                                <details>
                                    <summary>Import</summary>
                                    <ul>
                                        {[...importPlugins].map(
                                            ([pluginKey, plugin]) => (
                                                <li key={pluginKey}>
                                                    <a
                                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                        onClick={(_event) =>
                                                            (
                                                                plugin.importFunction as () => void
                                                            )()
                                                        }
                                                    >
                                                        {plugin.importMenuItem}
                                                    </a>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </details>
                            </li>
                        )}
                        {exportPlugins.size > 0 && (
                            <li>
                                <details>
                                    <summary>Export</summary>
                                    <ul>
                                        {[...exportPlugins].map(
                                            ([pluginKey, plugin]) => (
                                                <li key={pluginKey}>
                                                    <a
                                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                        onClick={(_event) =>
                                                            (
                                                                plugin.exportFunction as () => void
                                                            )()
                                                        }
                                                    >
                                                        {plugin.exportMenuItem}
                                                    </a>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </details>
                            </li>
                        )}
                        <li>
                            <a onClick={onDownloadWorkflowMenuItemClick}>
                                Download
                            </a>
                        </li>
                    </ul>
                </div>
                <input
                    className="input input-ghost font-bold"
                    value={workflowName}
                    onChange={(event) => setWorkflowName(event.target.value)}
                />
                <ul className="menu menu-horizontal"></ul>
            </div>
            <input
                type="file"
                ref={openWorkflowInput}
                onChange={onOpenWorkflowInputChange}
                hidden
            />
        </div>
    );
}

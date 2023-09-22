import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useAppStore from "../stores/app";
import useWorkflowStore from "../stores/workflow";

export default function Navbar() {
    const workflowName = useWorkflowStore((state) => state.name);
    const setWorkflowName = useWorkflowStore((state) => state.setName);
    const workflowImportPlugins = useAppStore(
        (state) => state.workflowImportPlugins,
    );
    const workflowExportPlugins = useAppStore(
        (state) => state.workflowExportPlugins,
    );

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
                            <a>New</a>
                        </li>
                        <li>
                            <a>Open</a>
                        </li>
                        {workflowImportPlugins.length > 0 && (
                            <li>
                                <details>
                                    <summary>Import</summary>
                                    <ul>
                                        {workflowImportPlugins.map(
                                            (workflowImportPlugin) => (
                                                <li
                                                    key={
                                                        workflowImportPlugin.name
                                                    }
                                                >
                                                    <a
                                                        onClick={(_event) => {
                                                            workflowImportPlugin.importFunction();
                                                        }}
                                                    >
                                                        {
                                                            workflowImportPlugin.importMenuItem
                                                        }
                                                    </a>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </details>
                            </li>
                        )}
                        {workflowExportPlugins.length > 0 && (
                            <li>
                                <details>
                                    <summary>Export</summary>
                                    <ul>
                                        {workflowExportPlugins.map(
                                            (workflowExportPlugin) => (
                                                <li
                                                    key={
                                                        workflowExportPlugin.name
                                                    }
                                                >
                                                    <a
                                                        onClick={(_event) => {
                                                            workflowExportPlugin.exportFunction();
                                                        }}
                                                    >
                                                        {
                                                            workflowExportPlugin.exportMenuItem
                                                        }
                                                    </a>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </details>
                            </li>
                        )}
                        <li>
                            <a>Download</a>
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
        </div>
    );
}

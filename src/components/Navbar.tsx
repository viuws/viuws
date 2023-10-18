import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useAppStore from "../stores/app";
import useWorkflowStore from "../stores/workflow";

export default function Navbar() {
    const importPlugins = useAppStore((app) => app.importPlugins);
    const exportPlugins = useAppStore((app) => app.exportPlugins);

    const workflowName = useWorkflowStore((workflow) => workflow.name);
    const setWorkflowName = useWorkflowStore((workflow) => workflow.setName);

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
                                                        onClick={(_event) => {
                                                            (
                                                                plugin.importFunction as () => void
                                                            )();
                                                        }}
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
                                                        onClick={(_event) => {
                                                            (
                                                                plugin.exportFunction as () => void
                                                            )();
                                                        }}
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

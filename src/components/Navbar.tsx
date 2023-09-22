import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useWorkflowStore from "../stores/workflow";

export default function Navbar() {
    const workflowName = useWorkflowStore((state) => state.name);
    const setWorkflowName = useWorkflowStore((state) => state.setName);

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

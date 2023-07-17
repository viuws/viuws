import ReactFlow, { Background, Controls, MiniMap, Panel } from "reactflow";
import "reactflow/dist/style.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import useRFStore from "./stores/rfStore";
import useWorkflowStore from "./stores/workflowtStore";

import "./App.css";

function App() {
  const workflowName = useWorkflowStore((state) => state.name);
  const setWorkflowName = useWorkflowStore((state) => state.setName);

  const rfNodes = useRFStore((state) => state.nodes);
  const rfEdges = useRFStore((state) => state.edges);
  const onRFNodesChange = useRFStore((state) => state.onNodesChange);
  const onRFEdgesChange = useRFStore((state) => state.onEdgesChange);
  const onRFConnect = useRFStore((state) => state.onConnect);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onRFNodesChange}
        onEdgesChange={onRFEdgesChange}
        onConnect={onRFConnect}
      >
        <Background />
        <MiniMap position="top-right" pannable zoomable />
        <Controls position="bottom-right" />
        <Panel position="top-left">
          <div className="navbar">
            <div className="navbar-start">
              <div className="dropdown">
                <label tabIndex={0} className="btn btn-ghost btn-square">
                  <FontAwesomeIcon className="text-lg" icon={faBars} />
                </label>
                <ul
                  tabIndex={0}
                  id="workflowMenu"
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
                onChange={(e) => setWorkflowName(e.target.value)}
              />
              <ul id="workflowToolbar" className="menu menu-horizontal"></ul>
            </div>
          </div>
        </Panel>
        <Panel position="bottom-left">
          <div className="flex flex-col items-start space-y-2">
            <button className="btn">+ Process</button>
            <button className="btn">+ Environment</button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default App;

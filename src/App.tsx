import { useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
} from "reactflow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import "reactflow/dist/style.css";
import "./App.css";

function App() {
  const [projectName, setProjectName] = useState("New project");  
  const [nodes, _setNodes, onNodesChanged] = useNodesState([]); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [edges, _setEdges, onEdgesChanged] = useEdgesState([]); // eslint-disable-line @typescript-eslint/no-unused-vars

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChanged}
        onEdgesChange={onEdgesChanged}
      >
        <Background />
        <Controls position="bottom-right" />
        <MiniMap position="top-right" pannable zoomable />
        <Panel position="top-left">
          <div className="navbar space-x-2">
            <div className="flex-1">
              <input
                className="input input-ghost text-2xl w-80"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div className="flex-none">
              <div className="drawer drawer-end">
                <input id="drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                  <label
                    htmlFor="drawer"
                    className="btn btn-ghost drawer-button text-2xl"
                  >
                    <FontAwesomeIcon icon={faEllipsis} />
                  </label>
                </div>
                <div className="drawer-side">
                  <label htmlFor="drawer" className="drawer-overlay"></label>
                  <div className="bg-base-200 w-96 h-full p-2">
                    Sidebar content
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-80 bg-base-300 rounded-lg m-2 p-2 space-y-2">
            <input className="input w-full" placeholder="Process name" />
            <ul className="max-h-96 p-2 space-y-2 overflow-auto">
              <span className="italic">No processes found</span>
            </ul>
          </div>
        </Panel>
        <Panel position="bottom-left">Local environment</Panel>
      </ReactFlow>
    </div>
  );
}

export default App;

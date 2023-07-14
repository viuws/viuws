import { useState } from "react";

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

import ProjectNavbar from "./components/ProjectNavbar";

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
        <MiniMap position="top-right" pannable zoomable />
        <Controls position="bottom-right" />
        <Panel position="top-left">
          <ProjectNavbar
            projectName={projectName}
            onProjectNameChange={setProjectName}
          />
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default App;

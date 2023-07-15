import ReactFlow, { Background, Controls, MiniMap, Panel } from "reactflow";
import "reactflow/dist/style.css";

import useRFStore from "./stores/rfStore";
import ProjectNavbar from "./components/ProjectNavbar";

import "./App.css";

function App() {
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
          <ProjectNavbar />
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default App;

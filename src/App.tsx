import ReactFlow, { Background, Controls, MiniMap, Panel } from "reactflow";
import "reactflow/dist/style.css";

import useRFStore from "./stores/rfStore";
import ProjectNavbar from "./components/ProjectNavbar";

import "./App.css";

function App() {
  const nodes = useRFStore((state) => state.nodes);
  const edges = useRFStore((state) => state.edges);
  const onNodesChange = useRFStore((state) => state.onNodesChange);
  const onEdgesChange = useRFStore((state) => state.onEdgesChange);
  const onConnect = useRFStore((state) => state.onConnect);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
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

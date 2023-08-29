import "./Home.css";

import Split from "react-split";

import ReactFlow, { Background, Controls, MiniMap, Panel } from "reactflow";
import "reactflow/dist/style.css";

import Navbar from "../components/Navbar";
import ProcessPanel from "../components/ProcessPanel";

import useReactFlowStore from "../stores/reactFlow";

function Home() {
  const nodes = useReactFlowStore((state) => state.nodes);
  const edges = useReactFlowStore((state) => state.edges);
  const onNodesChange = useReactFlowStore((state) => state.onNodesChange);
  const onEdgesChange = useReactFlowStore((state) => state.onEdgesChange);
  const onConnect = useReactFlowStore((state) => state.onConnect);
  return (
    <Split
      className="split-flex"
      style={{ width: "100vw", height: "100vh" }}
      sizes={[80, 20]}
      minSize={0}
    >
      <div id="reactFlowContainer">
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
            <Navbar />
          </Panel>
        </ReactFlow>
      </div>
      <div id="processPanelContainer">
        <ProcessPanel />
      </div>
    </Split>
  );
}

export default Home;

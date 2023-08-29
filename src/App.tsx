import { useEffect } from "react";

import ReactFlow, { Background, Controls, MiniMap, Panel } from "reactflow";
import "reactflow/dist/style.css";

import Split from "react-split";

import "./App.css";

import Navbar from "./components/Navbar";
import ProcessPanel from "./components/ProcessPanel";

import useConfigStore, { Config } from "./stores/ConfigStore";
import useReactFlowStore from "./stores/ReactFlowStore";

const CONFIG_FILE_ENVVAR = "VIUWS_CONFIG";
const DEFAULT_CONFIG_FILE = "config.json";

function App() {
  const loadConfig = useConfigStore((state) => state.load);

  useEffect(() => {
    async function fetchConfig() {
      const configFile = process.env[CONFIG_FILE_ENVVAR] || DEFAULT_CONFIG_FILE;
      const response = await fetch(configFile);
      if (response.ok) {
        const configData = (await response.json()) as Config;
        if (!ignore) {
          loadConfig(configData);
        }
      }
    }
    let ignore = false;
    void fetchConfig();
    return () => {
      ignore = true;
    };
  });

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

export default App;

import Split from "react-split";
import ReactFlow, { Background, Controls, MiniMap, Panel } from "reactflow";
import "reactflow/dist/style.css";

import ModulePanel from "../components/ModulePanel";
import Navbar from "../components/Navbar";
import useReactFlowStore from "../stores/reactFlow";
import "./Home.css";

function Home() {
    const reactFlowNodes = useReactFlowStore((state) => state.nodes);
    const reactFlowEdges = useReactFlowStore((state) => state.edges);
    const onReactFlowNodesChange = useReactFlowStore(
        (state) => state.onNodesChange,
    );
    const onReactFlowEdgesChange = useReactFlowStore(
        (state) => state.onEdgesChange,
    );
    const onReactFlowConnect = useReactFlowStore((state) => state.onConnect);
    return (
        <Split
            className="split-flex"
            style={{ width: "100vw", height: "100vh" }}
            sizes={[80, 20]}
            minSize={0}
        >
            <div id="reactFlowContainer">
                <ReactFlow
                    nodes={reactFlowNodes}
                    edges={reactFlowEdges}
                    onNodesChange={onReactFlowNodesChange}
                    onEdgesChange={onReactFlowEdgesChange}
                    onConnect={onReactFlowConnect}
                >
                    <Background />
                    <MiniMap position="top-right" pannable zoomable />
                    <Controls position="bottom-right" />
                    <Panel position="top-left">
                        <Navbar />
                    </Panel>
                </ReactFlow>
            </div>
            <div id="modulePanelContainer">
                <ModulePanel />
            </div>
        </Split>
    );
}

export default Home;

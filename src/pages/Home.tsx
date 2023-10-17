import { useCallback } from "react";
import Split from "react-split";
import ReactFlow, { Background, Controls, MiniMap, Panel } from "reactflow";
import "reactflow/dist/style.css";

import ModulePanel from "../components/ModulePanel";
import Navbar from "../components/Navbar";
import useWorkflowStore from "../stores/workflow";
import "./Home.css";

export default function Home() {
    const workflowNodes = useWorkflowStore((workflow) => workflow.nodes);
    const workflowEdges = useWorkflowStore((workflow) => workflow.edges);
    const onWorkflowNodesChange = useWorkflowStore(
        (workflow) => workflow.onNodesChange,
    );
    const onWorkflowEdgesChange = useWorkflowStore(
        (workflow) => workflow.onEdgesChange,
    );
    const onWorkflowConnect = useWorkflowStore(
        (workflow) => workflow.onConnect,
    );

    const onDragOver = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_event: React.DragEvent<HTMLDivElement>) => {
            // TODO
        },
        [],
    );

    const onDrop = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_event: React.DragEvent<HTMLDivElement>) => {
            // TODO
        },
        [],
    );

    return (
        <Split
            className="split-flex"
            style={{ width: "100vw", height: "100vh" }}
            sizes={[80, 20]}
            minSize={0}
        >
            <div id="reactFlowContainer">
                <ReactFlow
                    nodes={workflowNodes}
                    edges={workflowEdges}
                    onNodesChange={onWorkflowNodesChange}
                    onEdgesChange={onWorkflowEdgesChange}
                    onConnect={onWorkflowConnect}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
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

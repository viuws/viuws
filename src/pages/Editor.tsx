import { useCallback, useMemo, useRef, useState } from "react";
import Split from "react-split";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Node,
    Panel,
    ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";

import ModulePanel from "../components/ModulePanel";
import Navbar from "../components/Navbar";
import TaskNode from "../components/TaskNode";
import useWorkflowStore from "../stores/workflow";
import "./Editor.css";

export default function Editor() {
    const nodeTypes = useMemo(() => ({ task: TaskNode }), []);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [reactFlowInstance, setReactFlowInstance] =
        useState<ReactFlowInstance | null>(null);

    const workflowNodes = useWorkflowStore((workflow) => workflow.nodes);
    const workflowEdges = useWorkflowStore((workflow) => workflow.edges);
    const addWorkflowNode = useWorkflowStore((workflow) => workflow.addNode);
    const onWorkflowNodesChange = useWorkflowStore(
        (workflow) => workflow.onNodesChange,
    );
    const onWorkflowEdgesChange = useWorkflowStore(
        (workflow) => workflow.onEdgesChange,
    );
    const onWorkflowConnect = useWorkflowStore(
        (workflow) => workflow.onConnect,
    );

    const onInit = useCallback(
        (instance: ReactFlowInstance) => {
            setReactFlowInstance(instance);
        },
        [setReactFlowInstance],
    );

    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const moduleUrl = event.dataTransfer.getData("viuws/module");
        if (moduleUrl) {
            event.dataTransfer.dropEffect = "move";
        }
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            const moduleUrl = event.dataTransfer.getData("viuws/module");
            if (moduleUrl) {
                const reactFlowBounds =
                    reactFlowWrapper.current!.getBoundingClientRect();
                const position = reactFlowInstance!.project({
                    x: event.clientX - reactFlowBounds.left,
                    y: event.clientY - reactFlowBounds.top,
                });
                const node: Node = {
                    id: "new_node", // TODO
                    type: "task",
                    position: position,
                    data: {}, // TODO
                };
                addWorkflowNode(node);
            }
        },
        [reactFlowInstance, addWorkflowNode],
    );

    return (
        <Split
            className="split-flex"
            style={{ width: "100vw", height: "100vh" }}
            sizes={[80, 20]}
            minSize={0}
        >
            <div id="reactFlowWrapper" ref={reactFlowWrapper}>
                <ReactFlow
                    nodeTypes={nodeTypes}
                    nodes={workflowNodes}
                    edges={workflowEdges}
                    onNodesChange={onWorkflowNodesChange}
                    onEdgesChange={onWorkflowEdgesChange}
                    onConnect={onWorkflowConnect}
                    onInit={onInit}
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
            <div id="modulePanelWrapper">
                <ModulePanel />
            </div>
        </Split>
    );
}

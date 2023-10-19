import { useCallback, useMemo, useRef, useState } from "react";
import Split from "react-split";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Panel,
    ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";

import ModulePanel from "../components/ModulePanel";
import Navbar from "../components/Navbar";
import TaskNode, { TaskNodeData } from "../components/TaskNode";
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
        const moduleKey = event.dataTransfer.getData("viuws/module");
        if (moduleKey) {
            event.dataTransfer.dropEffect = "move";
        }
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            const moduleKey = event.dataTransfer.getData("viuws/module");
            if (moduleKey) {
                const [repo, moduleId] = moduleKey.split("#");
                let n = 0;
                for (const node of workflowNodes) {
                    if (node.id.startsWith(moduleId + "_")) {
                        const x = parseInt(node.id.slice(moduleId.length + 1));
                        if (!isNaN(x) && x > n) {
                            n = x;
                        }
                    }
                }
                const reactFlowBounds =
                    reactFlowWrapper.current!.getBoundingClientRect();
                const position = reactFlowInstance!.project({
                    x: event.clientX - reactFlowBounds.left,
                    y: event.clientY - reactFlowBounds.top,
                });
                const data: TaskNodeData = {
                    repo: repo,
                    rev: "main", // TODO
                    module: moduleId,
                    envData: {},
                    argsData: {},
                };
                addWorkflowNode({
                    id: `${moduleId}_${n + 1}`,
                    type: "task",
                    position: position,
                    data: data,
                });
            }
        },
        [reactFlowInstance, workflowNodes, addWorkflowNode],
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

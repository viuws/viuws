import { useCallback, useMemo, useRef } from "react";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Panel,
    useReactFlow,
} from "reactflow";

import useWorkflowStore, { TaskNode } from "../stores/workflow";
import isGitHubUrl from "../utils/isGitHubUrl";
import Navbar from "./Navbar";
import TaskNodeComponent from "./TaskNode";

export default function WorkflowEditor() {
    const nodeTypes = useMemo(() => ({ task: TaskNodeComponent }), []);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const reactFlowInstance = useReactFlow();

    const workflowNodes = useWorkflowStore((workflow) => workflow.nodes);
    const workflowEdges = useWorkflowStore((workflow) => workflow.edges);
    const setWorkflowNodes = useWorkflowStore((workflow) => workflow.setNodes);
    const onWorkflowNodesChange = useWorkflowStore(
        (workflow) => workflow.onNodesChange,
    );
    const onWorkflowEdgesChange = useWorkflowStore(
        (workflow) => workflow.onEdgesChange,
    );
    const onWorkflowConnect = useWorkflowStore(
        (workflow) => workflow.onConnect,
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
                const position = reactFlowInstance.project({
                    x: event.clientX - reactFlowBounds.left,
                    y: event.clientY - reactFlowBounds.top,
                });
                const taskNode: TaskNode = {
                    id: `${moduleId}_${n + 1}`,
                    type: "task",
                    position: position,
                    data: {
                        repo: repo,
                        moduleId: moduleId,
                        config: {},
                    },
                };
                if (isGitHubUrl(repo)) {
                    taskNode.data.rev = "main"; // TODO
                }
                setWorkflowNodes([...workflowNodes, taskNode]);
            }
        },
        [reactFlowWrapper, reactFlowInstance, workflowNodes, setWorkflowNodes],
    );

    return (
        <div id="reactFlowWrapper" ref={reactFlowWrapper}>
            <ReactFlow
                nodeTypes={nodeTypes}
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
    );
}

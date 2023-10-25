import { useCallback, useMemo, useRef } from "react";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Panel,
    useReactFlow,
} from "reactflow";

import { MODULE_TRANSFER_FORMAT } from "../constants";
import useWorkflowStore, { TASK_NODE_TYPE, TaskNode } from "../stores/workflow";
import { fetchLatestGitHubRelease, parseGitHubUrl } from "../utils/github";
import Navbar from "./Navbar";
import StatusBar from "./StatusBar";
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

    const getNextTaskId = useCallback(
        (moduleId: string) => {
            let n = 0;
            for (const node of workflowNodes) {
                if (node.id.startsWith(moduleId + "_")) {
                    const x = parseInt(node.id.slice(moduleId.length + 1));
                    if (!isNaN(x) && x > n) {
                        n = x;
                    }
                }
            }
            return `${moduleId}_${n + 1}`;
        },
        [workflowNodes],
    );

    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const moduleKey = event.dataTransfer.getData(MODULE_TRANSFER_FORMAT);
        if (moduleKey) {
            event.dataTransfer.dropEffect = "move";
        }
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            const moduleKey = event.dataTransfer.getData(
                MODULE_TRANSFER_FORMAT,
            );
            if (moduleKey) {
                const [repo, moduleId] = moduleKey.split("#");

                const reactFlowBounds =
                    reactFlowWrapper.current!.getBoundingClientRect();
                const position = reactFlowInstance.project({
                    x: event.clientX - reactFlowBounds.left,
                    y: event.clientY - reactFlowBounds.top,
                });
                const taskNode: TaskNode = {
                    id: getNextTaskId(moduleId),
                    type: TASK_NODE_TYPE,
                    position: position,
                    data: {
                        repo: repo,
                        moduleId: moduleId,
                        config: {},
                    },
                };
                const github = parseGitHubUrl(repo);
                if (github) {
                    fetchLatestGitHubRelease(github).then((tagName) => {
                        taskNode.data.rev = tagName;
                        setWorkflowNodes([...workflowNodes, taskNode]);
                    }, console.error);
                } else {
                    setWorkflowNodes([...workflowNodes, taskNode]);
                }
            }
        },
        [
            reactFlowWrapper,
            reactFlowInstance,
            workflowNodes,
            getNextTaskId,
            setWorkflowNodes,
        ],
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
                <Panel position="bottom-left">
                    <StatusBar />
                </Panel>
            </ReactFlow>
        </div>
    );
}

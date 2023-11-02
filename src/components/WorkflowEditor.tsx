import { useCallback, useMemo, useRef } from "react";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Panel,
    useReactFlow,
} from "reactflow";

import { MODULE_TRANSFER_FORMAT } from "../constants";
import { RESOURCE_EDGE_TYPE } from "../model/edges/ResourceEdge";
import { TASK_NODE_TYPE } from "../model/nodes/TaskNode";
import useWorkflowStore from "../stores/workflow";
import { parseModuleKey } from "../utils/stores";
import MenuBar from "./MenuBar";
import StatusBar from "./StatusBar";
import ResourceEdge from "./edges/ResourceEdge";
import TaskNode from "./nodes/TaskNode";

export default function WorkflowEditor() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const reactFlowInstance = useReactFlow();
    const nodeTypes = useMemo(() => ({ [TASK_NODE_TYPE]: TaskNode }), []);
    const edgeTypes = useMemo(
        () => ({ [RESOURCE_EDGE_TYPE]: ResourceEdge }),
        [],
    );

    const workflowNodes = useWorkflowStore((workflow) => workflow.nodes);
    const workflowEdges = useWorkflowStore((workflow) => workflow.edges);
    const addWorkflowTaskNodeAsync = useWorkflowStore(
        (workflow) => workflow.addTaskNodeAsync,
    );
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
        if (event.dataTransfer.types.includes(MODULE_TRANSFER_FORMAT)) {
            event.preventDefault(); // prevent default to allow drop
            event.dataTransfer.dropEffect = "move";
        }
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            if (
                reactFlowWrapper.current &&
                event.dataTransfer.types.includes(MODULE_TRANSFER_FORMAT)
            ) {
                event.preventDefault();
                const moduleKey = event.dataTransfer.getData(
                    MODULE_TRANSFER_FORMAT,
                );
                const { repo, moduleId } = parseModuleKey(moduleKey);
                const bounds = reactFlowWrapper.current.getBoundingClientRect();
                const position = reactFlowInstance.project({
                    x: event.clientX - bounds.left,
                    y: event.clientY - bounds.top,
                });
                addWorkflowTaskNodeAsync(
                    repo,
                    moduleId,
                    position,
                    console.error,
                );
            }
        },
        [reactFlowWrapper, reactFlowInstance, addWorkflowTaskNodeAsync],
    );

    return (
        <div id="reactFlowWrapper" ref={reactFlowWrapper}>
            <ReactFlow
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                nodes={workflowNodes}
                edges={workflowEdges}
                onNodesChange={onWorkflowNodesChange}
                onEdgesChange={onWorkflowEdgesChange}
                onConnect={onWorkflowConnect}
                onDragOver={onDragOver}
                onDrop={onDrop}
                deleteKeyCode="Delete"
            >
                <Background />
                <MiniMap position="top-right" pannable zoomable />
                <Controls position="bottom-right" />
                <Panel position="top-left">
                    <MenuBar />
                </Panel>
                <Panel position="bottom-left">
                    <StatusBar />
                </Panel>
            </ReactFlow>
        </div>
    );
}

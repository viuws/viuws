import { Node } from "reactflow";

export const TASK_NODE_TYPE = "task";

export type TaskNodeData = {
    repo?: string;
    rev?: string;
    moduleId: string;
    config: {
        [k: string]: unknown;
    }; // has to be empty (not undefined) for JSON Forms
};

export type TaskNode = Node<TaskNodeData, typeof TASK_NODE_TYPE>;

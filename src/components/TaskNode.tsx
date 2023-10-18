import { NodeProps } from "reactflow";

export default function TaskNode(nodeProps: NodeProps) {
    return <div>{nodeProps.id}</div>;
}

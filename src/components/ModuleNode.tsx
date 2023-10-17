import { Node } from "reactflow";

export default function ModuleNode(node: Node) {
    return <div>{node.id}</div>;
}

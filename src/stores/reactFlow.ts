import {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    OnConnect,
    OnEdgesChange,
    OnNodesChange,
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
} from "reactflow";
import { create } from "zustand";

export type ReactFlowState = {
    nodes: Node[];
    edges: Edge[];
};

type ReactFlowActions = {
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
};

const defaultReactFlowState: ReactFlowState = {
    nodes: [],
    edges: [],
};

const useReactFlowStore = create<ReactFlowState & ReactFlowActions>()(
    (set, get) => ({
        ...defaultReactFlowState,
        setNodes: (nodes) => set({ nodes: nodes }),
        setEdges: (edges) => set({ edges: edges }),
        onNodesChange: (changes) =>
            set({ nodes: applyNodeChanges(changes, get().nodes) }),
        onEdgesChange: (changes) =>
            set({ edges: applyEdgeChanges(changes, get().edges) }),
        onConnect: (connection) =>
            set({ edges: addEdge(connection, get().edges) }),
    }),
);

export default useReactFlowStore;

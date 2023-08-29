import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";

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
    setNodes: (nodes: Node[]) => set({ nodes: nodes }),
    setEdges: (edges: Edge[]) => set({ edges: edges }),
    onNodesChange: (changes: NodeChange[]) =>
      set({ nodes: applyNodeChanges(changes, get().nodes) }),
    onEdgesChange: (changes: EdgeChange[]) =>
      set({ edges: applyEdgeChanges(changes, get().edges) }),
    onConnect: (connection: Connection) =>
      set({ edges: addEdge(connection, get().edges) }),
  }),
);

export default useReactFlowStore;

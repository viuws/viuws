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

type RFStore = {
  nodes: Node[];
  edges: Edge[];
  setNodes: (newNodes: Node[]) => void;
  setEdges: (newEdges: Edge[]) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
};

const useRFStore = create<RFStore>((set, get) => ({
  nodes: [],
  edges: [],
  setNodes: (newNodes: Node[]) => set({ nodes: newNodes }),
  setEdges: (newEdges: Edge[]) => set({ edges: newEdges }),
  onNodesChange: (changes: NodeChange[]) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes: EdgeChange[]) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (connection: Connection) =>
    set({ edges: addEdge(connection, get().edges) }),
}));

export default useRFStore;

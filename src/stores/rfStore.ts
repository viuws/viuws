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
  setNodes: (value: Node[]) => void;
  setEdges: (value: Edge[]) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
};

const useRFStore = create<RFStore>((set, get) => ({
  nodes: [],
  edges: [],
  setNodes: (value: Node[]) => set({ nodes: value }),
  setEdges: (value: Edge[]) => set({ edges: value }),
  onNodesChange: (changes: NodeChange[]) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes: EdgeChange[]) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (connection: Connection) =>
    set({ edges: addEdge(connection, get().edges) }),
}));

export default useRFStore;

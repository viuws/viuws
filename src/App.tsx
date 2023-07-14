import ReactFlow, {
  Background,
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import "./App.css";

function App() {
  const [nodes, _setNodes, onNodesChanged] = useNodesState([]); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [edges, _setEdges, onEdgesChanged] = useEdgesState([]); // eslint-disable-line @typescript-eslint/no-unused-vars

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChanged}
        onEdgesChange={onEdgesChanged}
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;

import Split from "react-split";
import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";

import ModulePanel from "../components/ModulePanel";
import WorkflowEditor from "../components/WorkflowEditor";
import "./Home.css";

export default function Home() {
    return (
        <Split
            className="split-flex"
            style={{ width: "100vw", height: "100vh" }}
            sizes={[80, 20]}
            minSize={0}
        >
            <ReactFlowProvider>
                <WorkflowEditor />
            </ReactFlowProvider>
            <ModulePanel />
        </Split>
    );
}

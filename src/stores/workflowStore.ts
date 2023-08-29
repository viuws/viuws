import { create } from "zustand";
import { Workflow } from "../interfaces/workflow";

interface WorkflowStore extends Workflow {
  setName: (name: string) => void;
}

const useWorkflowStore = create<WorkflowStore>()((set) => ({
  name: "New workflow",
  setName: (name: string) => set({ name: name }),
}));

export default useWorkflowStore;

import { create } from "zustand";
import { Workflow } from "../interfaces/Workflow";

interface WorkflowStore extends Workflow {
  setName: (value: string) => void;
}

const useWorkflowStore = create<WorkflowStore>((set) => ({
  name: "New workflow",
  setName: (value: string) => set({ name: value }),
}));

export default useWorkflowStore;

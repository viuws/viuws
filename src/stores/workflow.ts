import { create } from "zustand";

import { Workflow as WorkflowState } from "../interfaces/workflow";

export type { WorkflowState };

type WorkflowActions = {
    setName: (name: string) => void;
};

const defaultWorkflowState: WorkflowState = {
    name: "New workflow",
};

const useWorkflowStore = create<WorkflowState & WorkflowActions>()((set) => ({
    ...defaultWorkflowState,
    setName: (name) => set({ name: name }),
}));

export default useWorkflowStore;

import { create } from "zustand";

type WorkflowStore = {
  name: string;
  setName: (newName: string) => void;
};

const useWorkflowStore = create<WorkflowStore>((set) => ({
  name: "New workflow",
  setName: (newName: string) => set({ name: newName }),
}));

export default useWorkflowStore;

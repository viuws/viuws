import { create } from "zustand";

type WorkflowStore = {
  name: string;
  setName: (value: string) => void;
};

const useWorkflowStore = create<WorkflowStore>((set) => ({
  name: "New workflow",
  setName: (value: string) => set({ name: value }),
}));

export default useWorkflowStore;

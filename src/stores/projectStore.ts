import { create } from "zustand";

type ProjectStore = {
  name: string;
  setName: (newName: string) => void;
};

const useProjectStore = create<ProjectStore>((set) => ({
  name: "New project",
  setName: (newName: string) => set({ name: newName }),
}));

export default useProjectStore;

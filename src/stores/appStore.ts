import { create } from "zustand";

export enum Sidebar {
  Processes = "Processes",
  Environments = "Environments",
}

type AppStore = {
  sidebar: Sidebar | null;
  setSidebar: (value: Sidebar | null) => void;
};

const useAppStore = create<AppStore>((set) => ({
  sidebar: null,
  setSidebar: (value: Sidebar | null) => set({ sidebar: value }),
}));

export default useAppStore;

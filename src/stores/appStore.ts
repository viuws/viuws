import { create } from "zustand";

import { Process } from "../interfaces/process";

export type AppState = {
  loaded: boolean;
  processes: Process[];
};

type AppActions = {
  setLoaded: (loaded: boolean) => void;
  registerProcess: (process: Process) => void;
};

const defaultAppState: AppState = {
  loaded: false,
  processes: [],
};

const useAppStore = create<AppState & AppActions>()((set) => ({
  ...defaultAppState,
  setLoaded: (loaded) => set({ loaded: loaded }),
  registerProcess: (process) =>
    set((state) => ({ processes: [...state.processes, process] })),
}));

export default useAppStore;

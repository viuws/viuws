import { create } from "zustand";

import { Process } from "../interfaces/process";

export type AppState = {
  status: string;
  loaded: boolean;
  processes: Process[];
};

type AppActions = {
  setStatus: (status: string) => void;
  setLoaded: (loaded: boolean) => void;
  registerProcess: (process: Process) => void;
};

const defaultAppState: AppState = {
  status: "",
  loaded: false,
  processes: [],
};

const useAppStore = create<AppState & AppActions>()((set) => ({
  ...defaultAppState,
  setStatus: (status) => set({ status: status }),
  setLoaded: (loaded) => set({ loaded: loaded }),
  registerProcess: (process) =>
    set((state) => ({ processes: [...state.processes, process] })),
}));

export default useAppStore;

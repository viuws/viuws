import { create } from "zustand";

import { Process } from "../interfaces/process";

interface AppStore {
  processes: Process[];
  registerProcess: (process: Process) => void;
}

const useAppStore = create<AppStore>()((set) => ({
  processes: [],
  registerProcess: (process) =>
    set((state) => ({ processes: [...state.processes, process] })),
}));

export default useAppStore;

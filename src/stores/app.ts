import { create } from "zustand";

import { Module } from "../interfaces/module";

export type AppState = {
    loaded: boolean;
    modules: Module[];
};

type AppActions = {
    setLoaded: (loaded: boolean) => void;
    registerModule: (module: Module) => void;
    refreshPlugins: () => void;
};

const defaultAppState: AppState = {
    loaded: false,
    modules: [],
};

const useAppStore = create<AppState & AppActions>()((set) => ({
    ...defaultAppState,
    setLoaded: (loaded) => set({ loaded: loaded }),
    registerModule: (module) =>
        set((state) => ({ modules: [...state.modules, module] })),
    refreshPlugins: () => {
        console.info("refreshPlugins");
    },
}));

export default useAppStore;

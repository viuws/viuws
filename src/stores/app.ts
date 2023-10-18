import { create } from "zustand";

import { Module } from "../interfaces/module";
import { ExportPlugin, ImportPlugin, Plugin } from "../interfaces/plugin";

export type AppState = {
    loaded: boolean;
    modules: Map<string, Module>;
    importPlugins: Map<string, ImportPlugin>;
    exportPlugins: Map<string, ExportPlugin>;
};

type AppActions = {
    setLoaded: (loaded: boolean) => void;
    registerModule: (repo: string, moduleId: string, module: Module) => void;
    registerPlugin: (repo: string, pluginId: string, plugin: Plugin) => void;
};

const defaultAppState: AppState = {
    loaded: false,
    modules: new Map<string, Module>(),
    importPlugins: new Map<string, ImportPlugin>(),
    exportPlugins: new Map<string, ExportPlugin>(),
};

const useAppStore = create<AppState & AppActions>()((set) => ({
    ...defaultAppState,
    setLoaded: (loaded) => set({ loaded: loaded }),
    registerModule: (repo, moduleId, module) =>
        set((state) => ({
            modules: new Map(state.modules).set(`${repo}#${moduleId}`, module),
        })),
    registerPlugin: (repo, pluginId, plugin) => {
        switch (plugin.plugin.type) {
            case "import":
                set((state) => ({
                    importPlugins: new Map(state.importPlugins).set(
                        `${repo}#${pluginId}`,
                        plugin.plugin as ImportPlugin,
                    ),
                }));
                break;
            case "export":
                set((state) => ({
                    exportPlugins: new Map(state.exportPlugins).set(
                        `${repo}#${pluginId}`,
                        plugin.plugin as ExportPlugin,
                    ),
                }));
                break;
        }
    },
}));

export default useAppStore;

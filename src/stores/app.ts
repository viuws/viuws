import { create } from "zustand";

import { Module } from "../interfaces/module";
import {
    Plugin,
    WorkflowExportPluginInstance,
    WorkflowImportPluginInstance,
} from "../interfaces/plugin";

export type AppState = {
    loaded: boolean;
    modules: Module[];
    workflowImportPlugins: WorkflowImportPluginInstance[];
    workflowExportPlugins: WorkflowExportPluginInstance[];
};

type AppActions = {
    setLoaded: (loaded: boolean) => void;
    registerModule: (module: Module) => void;
    registerPlugin: (plugin: Plugin) => void;
};

const defaultAppState: AppState = {
    loaded: false,
    modules: [],
    workflowImportPlugins: [],
    workflowExportPlugins: [],
};

const useAppStore = create<AppState & AppActions>()((set) => ({
    ...defaultAppState,
    setLoaded: (loaded) => set({ loaded: loaded }),
    registerModule: (module) =>
        set((state) => ({ modules: [...state.modules, module] })),
    registerPlugin: (plugin) => {
        switch (plugin.plugin.type) {
            case "workflowImport":
                set((state) => ({
                    workflowImportPlugins: [
                        ...state.workflowImportPlugins,
                        plugin.plugin as WorkflowImportPluginInstance,
                    ],
                }));
                break;
            case "workflowExport":
                set((state) => ({
                    workflowExportPlugins: [
                        ...state.workflowExportPlugins,
                        plugin.plugin as WorkflowExportPluginInstance,
                    ],
                }));
                break;
        }
    },
}));

export default useAppStore;

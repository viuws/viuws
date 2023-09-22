import { create } from "zustand";

import { Module } from "../interfaces/module";
import {
    Plugin,
    WorkflowExportPluginInstance,
    WorkflowImportPluginInstance,
    WorkflowUIPluginInstance,
} from "../interfaces/plugin";

export type AppState = {
    loaded: boolean;
    modules: Module[];
    workflowImportPlugins: WorkflowImportPluginInstance[];
    workflowExportPlugins: WorkflowExportPluginInstance[];
    workflowUIPlugins: WorkflowUIPluginInstance[];
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
    workflowUIPlugins: [],
};

const useAppStore = create<AppState & AppActions>()((set) => ({
    ...defaultAppState,
    setLoaded: (loaded) => set({ loaded: loaded }),
    registerModule: (module) =>
        set((state) => ({ modules: [...state.modules, module] })),
    registerPlugin: (plugin) => {
        switch (plugin.plugin.type.toString()) {
            case "workflowImportPlugin":
                set((state) => ({
                    workflowImportPlugins: [
                        ...state.workflowImportPlugins,
                        plugin.plugin as WorkflowImportPluginInstance,
                    ],
                }));
                break;
            case "workflowExportPlugin":
                set((state) => ({
                    workflowExportPlugins: [
                        ...state.workflowExportPlugins,
                        plugin.plugin as WorkflowExportPluginInstance,
                    ],
                }));
                break;
            case "workflowUIPlugin":
                set((state) => ({
                    workflowUIPlugins: [
                        ...state.workflowUIPlugins,
                        plugin.plugin as WorkflowUIPluginInstance,
                    ],
                }));
                break;
            default:
                console.error(
                    `Plugin ${plugin.plugin.name} has an unsupported type: ${plugin.plugin.type}}`,
                );
                break;
        }
    },
}));

export default useAppStore;

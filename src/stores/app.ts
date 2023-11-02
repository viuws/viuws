import { create } from "zustand";

import { REGISTRY_PATH } from "../constants";
import { Message } from "../interfaces/message";
import { Module } from "../interfaces/module";
import { ExportPlugin, ImportPlugin, Plugin } from "../interfaces/plugin";
import { Registry } from "../interfaces/registry";
import { fetchModule, fetchRegistry, getFetchableUrl } from "../utils/fetch";
import { getModuleKey, getPluginKey, getRegistryKey } from "../utils/stores";

type AppState = {
    initialized: boolean;
    registries: Map<string, Registry>;
    modules: Map<string, Module>;
    importPlugins: Map<string, ImportPlugin>;
    exportPlugins: Map<string, ExportPlugin>;
};

type AppActions = {
    setInitialized: (initialized: boolean) => void;
    loadRegistryAsync: (
        repo: string | null,
        registry: Registry,
        loadPlugin: (pluginKey: string, pluginUrl: string) => void,
        checkIgnore: () => boolean,
        onError: (error: string) => void,
    ) => void;
    fetchAndLoadRegistryAsync: (
        repo: string | null,
        loadPlugin: (pluginKey: string, pluginUrl: string) => void,
        checkIgnore: () => boolean,
        onError: (error: string) => void,
    ) => void;
    fetchAndRegisterModuleAsync: (
        repo: string | null,
        moduleId: string,
        modulePath: string,
        checkIgnore: () => boolean,
        onError: (error: string) => void,
    ) => void;
    fetchAndRegisterPluginAsync: (
        repo: string | null,
        pluginId: string,
        pluginPath: string,
        loadPlugin: (pluginKey: string, pluginUrl: string) => void,
    ) => void;
    registerModule: (moduleKey: string, module: Module) => void;
    registerPlugin: (pluginKey: string, plugin: Plugin) => void;
    connectClient: (timeout: number) => Promise<void>;
    handleMessage: (message: Message) => void;
};

const defaultAppState: AppState = {
    initialized: false,
    registries: new Map<string, Registry>(),
    modules: new Map<string, Module>(),
    importPlugins: new Map<string, ImportPlugin>(),
    exportPlugins: new Map<string, ExportPlugin>(),
};

const useAppStore = create<AppState & AppActions>()((set, get) => ({
    ...defaultAppState,
    setInitialized: (initialized) => {
        set({ initialized: initialized });
    },
    loadRegistryAsync: (repo, registry, loadPlugin, checkIgnore, onError) => {
        const state = get();
        const registryKey = getRegistryKey(repo);
        if (state.registries.has(registryKey)) {
            return;
        }
        set((state) => ({
            registries: new Map(state.registries).set(registryKey, registry),
        }));
        if (registry.modules) {
            for (const moduleRef of registry.modules) {
                state.fetchAndRegisterModuleAsync(
                    repo,
                    moduleRef.id,
                    moduleRef.path,
                    checkIgnore,
                    onError,
                );
            }
        }
        if (registry.plugins) {
            for (const pluginRef of registry.plugins) {
                state.fetchAndRegisterPluginAsync(
                    repo,
                    pluginRef.id,
                    pluginRef.path,
                    loadPlugin,
                );
            }
        }
        if (registry.repos) {
            for (const subrepo of registry.repos) {
                state.fetchAndLoadRegistryAsync(
                    subrepo,
                    loadPlugin,
                    checkIgnore,
                    onError,
                );
            }
        }
    },
    fetchAndLoadRegistryAsync: (repo, loadPlugin, checkIgnore, onError) => {
        const state = get();
        const registryKey = getRegistryKey(repo);
        if (state.registries.has(registryKey)) {
            return;
        }
        fetchRegistry(REGISTRY_PATH, repo).then((registry) => {
            if (!checkIgnore()) {
                state.loadRegistryAsync(
                    repo,
                    registry,
                    loadPlugin,
                    checkIgnore,
                    onError,
                );
            }
        }, onError);
    },
    fetchAndRegisterModuleAsync: (
        repo,
        moduleId,
        modulePath,
        checkIgnore,
        onError,
    ) => {
        const state = get();
        const moduleKey = getModuleKey(repo, moduleId);
        if (state.modules.has(moduleKey)) {
            return;
        }
        fetchModule(modulePath, repo).then((module) => {
            if (!checkIgnore()) {
                state.registerModule(moduleKey, module);
            }
        }, onError);
    },
    fetchAndRegisterPluginAsync: (repo, pluginId, pluginPath, loadPlugin) => {
        const state = get();
        const pluginKey = getPluginKey(repo, pluginId);
        if (
            state.importPlugins.has(pluginKey) ||
            state.exportPlugins.has(pluginKey)
        ) {
            return;
        }
        const pluginUrl = getFetchableUrl(pluginPath, repo);
        loadPlugin(pluginKey, pluginUrl);
    },
    registerModule: (moduleKey, module) => {
        set((state) => ({
            modules: new Map(state.modules).set(moduleKey, module),
        }));
    },
    registerPlugin: (pluginKey, plugin) => {
        switch (plugin.plugin.type) {
            case "import":
                set((state) => ({
                    importPlugins: new Map(state.importPlugins).set(
                        pluginKey,
                        plugin.plugin as ImportPlugin,
                    ),
                }));
                break;
            case "export":
                set((state) => ({
                    exportPlugins: new Map(state.exportPlugins).set(
                        pluginKey,
                        plugin.plugin as ExportPlugin,
                    ),
                }));
                break;
            default:
                throw new Error(`Plugin ${pluginKey} has unknown type`);
        }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    connectClient: async (_timeout) => {
        // TODO connect client
    },
    handleMessage: (message) => {
        if (message.header.target == "webpage") {
            // TODO message handling
            // switch (message.payload.type) {
            //     case "pingResponse":
            //         setConnected(message.payload.ok);
            //         setConnectionError(message.payload.error ?? null);
            //         break;
            //     default:
            //         console.error(
            //             `Unsupported message type: ${
            //                 message.payload.type ?? "undefined"
            //             }`,
            //         );
            //         break;
            // }
        }
    },
}));

export default useAppStore;

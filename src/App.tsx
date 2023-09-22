import { useCallback, useEffect } from "react";

import "./App.css";
import { Module } from "./interfaces/module";
import { Plugin } from "./interfaces/plugin";
import { Registry } from "./interfaces/registry";
import Home from "./pages/Home";
import useAppStore from "./stores/app";
import useConfigStore, { ConfigState } from "./stores/config";
import createScriptElement from "./utils/createScriptElement";
import fetchYaml from "./utils/fetchYaml";

export default function App() {
    const appLoaded = useAppStore((state) => state.loaded);
    const setAppLoaded = useAppStore((state) => state.setLoaded);
    const loadConfig = useConfigStore((state) => state.load);
    const repoUrls = useConfigStore((state) => state.repos);
    const registerModule = useAppStore((state) => state.registerModule);
    const registerPlugin = useAppStore((state) => state.registerPlugin);

    const handlePluginEvent = useCallback(
        (event: Event) => {
            try {
                const plugin = (event as CustomEvent).detail as Plugin;
                registerPlugin(plugin);
            } catch (error) {
                console.error(error);
            }
        },
        [registerPlugin],
    );

    useEffect(() => {
        window.addEventListener("viuws:plugin", handlePluginEvent);
        return () => {
            window.removeEventListener("viuws:plugin", handlePluginEvent);
        };
    }, [handlePluginEvent]);

    useEffect(() => {
        let ignore = false;

        function loadApp() {
            fetchYaml<ConfigState>("config.yaml").then((configState) => {
                if (!ignore) {
                    loadConfig(configState);
                }
                setAppLoaded(true);
            }, console.error);
        }

        loadApp();

        return () => {
            ignore = true;
        };
    }, [loadConfig, setAppLoaded]);

    useEffect(() => {
        let ignore = false;
        const pluginScriptElements: HTMLScriptElement[] = [];

        function loadModules(moduleUrls: string[]) {
            const uniqueModuleUrls = new Set(moduleUrls);
            for (const moduleUrl of uniqueModuleUrls) {
                fetchYaml<Module>(moduleUrl).then((module) => {
                    if (!ignore) {
                        try {
                            registerModule(module);
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }, console.error);
            }
        }

        function loadPlugins(pluginUrls: string[]) {
            const uniquePluginUrls = new Set(pluginUrls);
            for (const pluginUrl of uniquePluginUrls) {
                const pluginScriptElement = createScriptElement(pluginUrl);
                document.body.appendChild(pluginScriptElement);
                pluginScriptElements.push(pluginScriptElement);
            }
        }

        function loadRepos(repoUrls: string[]) {
            const uniqueRepoUrls = new Set(repoUrls);
            for (const repoUrl of uniqueRepoUrls) {
                const baseUrl = `${repoUrl}/.viuws`;
                const registryUrl = `${baseUrl}/registry.yaml`;
                fetchYaml<Registry>(registryUrl).then((registry) => {
                    if (!ignore && registry.modules) {
                        const moduleUrls = registry.modules.map(
                            (moduleRef) => `${baseUrl}/${moduleRef.path}`,
                        );
                        loadModules(moduleUrls);
                    }
                    if (!ignore && registry.plugins) {
                        const pluginUrls = registry.plugins.map(
                            (pluginRef) => `${baseUrl}/${pluginRef.path}`,
                        );
                        loadPlugins(pluginUrls);
                    }
                    if (!ignore && registry.repos) {
                        loadRepos(registry.repos);
                    }
                }, console.error);
            }
        }

        if (appLoaded) {
            loadRepos(repoUrls);
        }

        return () => {
            ignore = true;
            for (const pluginScriptElement of pluginScriptElements) {
                document.body.removeChild(pluginScriptElement);
            }
        };
    }, [appLoaded, repoUrls, registerModule]);

    if (!appLoaded) {
        return (
            <div
                className="flex items-center justify-center"
                style={{ width: "100vw", height: "100vh" }}
            >
                <p>Loading...</p>
            </div>
        );
    }
    return <Home />;
}

import { useCallback, useEffect } from "react";

import "./App.css";
import { Module } from "./interfaces/module";
import { Plugin } from "./interfaces/plugin";
import { Registry } from "./interfaces/registry";
import Editor from "./pages/Editor";
import useAppStore from "./stores/app";
import useConfigStore, { ConfigState } from "./stores/config";
import createScriptElement from "./utils/createScriptElement";
import fetchYaml from "./utils/fetchYaml";

export default function App() {
    const loaded = useAppStore((app) => app.loaded);
    const setLoaded = useAppStore((app) => app.setLoaded);
    const registerModule = useAppStore((app) => app.registerModule);
    const registerPlugin = useAppStore((app) => app.registerPlugin);

    const configRepos = useConfigStore((config) => config.repos);
    const loadConfig = useConfigStore((config) => config.load);

    const handlePluginEvent = useCallback(
        (event: Event) => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                const pluginUrl = (event as CustomEvent).detail.url as string;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                const plugin = (event as CustomEvent).detail.plugin as Plugin;
                registerPlugin(pluginUrl, plugin);
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
                setLoaded(true);
            }, console.error);
        }

        loadApp();

        return () => {
            ignore = true;
        };
    }, [loadConfig, setLoaded]);

    useEffect(() => {
        let ignore = false;
        const pluginScriptElements: HTMLScriptElement[] = [];

        function loadModules(moduleUrls: string[]) {
            const uniqueModuleUrls = new Set(moduleUrls);
            for (const moduleUrl of uniqueModuleUrls) {
                fetchYaml<Module>(moduleUrl).then((module) => {
                    if (!ignore) {
                        try {
                            registerModule(moduleUrl, module);
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

        if (loaded) {
            loadRepos(configRepos);
        }

        return () => {
            ignore = true;
            for (const pluginScriptElement of pluginScriptElements) {
                document.body.removeChild(pluginScriptElement);
            }
        };
    }, [loaded, configRepos, registerModule]);

    if (!loaded) {
        return (
            <div
                className="flex items-center justify-center"
                style={{ width: "100vw", height: "100vh" }}
            >
                <p>Loading...</p>
            </div>
        );
    }
    return <Editor />;
}

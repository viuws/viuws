import { useEffect } from "react";

import "./App.css";
import { Module } from "./interfaces/module";
import { Registry } from "./interfaces/registry";
import Home from "./pages/Home";
import useAppStore from "./stores/app";
import useConfigStore, { ConfigState } from "./stores/config";
import fetchYaml from "./utils/fetchYaml";
import loadScript from "./utils/loadScript";

export default function App() {
    const loaded = useAppStore((state) => state.loaded);
    const loadConfig = useConfigStore((state) => state.load);
    const setLoaded = useAppStore((state) => state.setLoaded);
    const repoUrls = useConfigStore((state) => state.repos);
    const registerModule = useAppStore((state) => state.registerModule);
    const refreshPlugins = useAppStore((state) => state.refreshPlugins);

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
        const scriptElements: HTMLScriptElement[] = [];

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
                const scriptElement = loadScript(pluginUrl, refreshPlugins);
                document.body.appendChild(scriptElement);
                scriptElements.push(scriptElement);
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
                            (pluginPath) => `${baseUrl}/${pluginPath}`,
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
            loadRepos(repoUrls);
        }

        return () => {
            ignore = true;
            for (const scriptElement of scriptElements) {
                document.body.removeChild(scriptElement);
            }
        };
    }, [loaded, repoUrls, registerModule, refreshPlugins]);

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
    return <Home />;
}

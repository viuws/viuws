import { useEffect } from "react";

import "./App.css";
import { Module } from "./interfaces/module";
import { Registry } from "./interfaces/registry";
import Home from "./pages/Home";
import useAppStore from "./stores/app";
import useConfigStore, { ConfigState } from "./stores/config";
import fetchYaml from "./utils/fetchYaml";

function App() {
    const loaded = useAppStore((state) => state.loaded);
    const loadConfig = useConfigStore((state) => state.load);
    const setLoaded = useAppStore((state) => state.setLoaded);
    const repoUrls = useConfigStore((state) => state.repos);
    const registerModule = useAppStore((state) => state.registerModule);

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

        function loadModules(moduleUrls: string[]) {
            for (const moduleUrl of moduleUrls) {
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
            for (const pluginUrl of pluginUrls) {
                import(/* @vite-ignore */ pluginUrl).then(
                    ({ default: plugin }) => {
                        if (!ignore) {
                            try {
                                const initializePlugin = plugin as () => void;
                                initializePlugin(); // TODO
                            } catch (error) {
                                console.error(error);
                            }
                        }
                    },
                    console.error,
                );
            }
        }

        function loadRepos(repoUrls: string[]) {
            for (const repoUrl of repoUrls) {
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
            loadRepos(repoUrls);
        }

        return () => {
            ignore = true;
        };
    }, [loaded, repoUrls, registerModule]);

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

export default App;

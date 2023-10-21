import { useCallback, useEffect } from "react";

import "./App.css";
import Splash from "./components/Splash";
import { Module } from "./interfaces/module";
import { Plugin } from "./interfaces/plugin";
import { Registry } from "./interfaces/registry";
import Home from "./pages/Home";
import useAppStore from "./stores/app";
import useConfigStore, { ConfigState } from "./stores/config";
import createScriptElement from "./utils/createScriptElement";
import fetchYaml from "./utils/fetchYaml";
import getFetchableUrl from "./utils/getFetchableUrl";

export default function App() {
    const loaded = useAppStore((app) => app.loaded);
    const setLoaded = useAppStore((app) => app.setLoaded);
    const registerModule = useAppStore((app) => app.registerModule);
    const registerPlugin = useAppStore((app) => app.registerPlugin);

    const configRepos = useConfigStore((config) => config.repos);
    const loadConfig = useConfigStore((config) => config.load);

    const handlePluginEvent = useCallback(
        (event: Event) => {
            if (document.currentScript) {
                const m = /^viuws:plugin:(?<repo>[^#]+)#(?<pluginId>.+)$/.exec(
                    document.currentScript.id,
                );
                if (m) {
                    const { repo, pluginId } = m.groups!;
                    try {
                        const plugin = (event as CustomEvent).detail as Plugin;
                        registerPlugin(repo, pluginId, plugin);
                    } catch (error) {
                        console.error(error);
                    }
                }
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
        fetchYaml<ConfigState>("config.yaml").then((configState) => {
            if (!ignore) {
                loadConfig(configState);
            }
            setLoaded(true);
        }, console.error);
        return () => {
            ignore = true;
        };
    }, [loadConfig, setLoaded]);

    useEffect(() => {
        let ignore = false;
        const pluginScriptElements: HTMLScriptElement[] = [];

        function loadModule(
            repo: string,
            moduleId: string,
            modulePath: string,
        ) {
            const moduleUrl = getFetchableUrl(repo, modulePath);
            fetchYaml<Module>(moduleUrl).then((module) => {
                if (!ignore) {
                    try {
                        registerModule(repo, moduleId, module);
                    } catch (error) {
                        console.error(error);
                    }
                }
            }, console.error);
        }

        function loadPlugin(
            repo: string,
            pluginId: string,
            pluginPath: string,
        ) {
            const pluginUrl = getFetchableUrl(repo, pluginPath);
            const pluginScriptElement = createScriptElement(pluginUrl);
            pluginScriptElement.id = `viuws:plugin:${repo}#${pluginId}`;
            document.body.appendChild(pluginScriptElement);
            pluginScriptElements.push(pluginScriptElement);
        }

        function loadRepo(repo: string) {
            const basePath = ".viuws";
            const registryPath = `${basePath}/registry.yaml`;
            const registryUrl = getFetchableUrl(repo, registryPath);
            fetchYaml<Registry>(registryUrl).then((registry) => {
                if (!ignore && registry.modules) {
                    for (const moduleRef of new Set(registry.modules)) {
                        const modulePath = `${basePath}/${moduleRef.path}`;
                        loadModule(repo, moduleRef.id, modulePath);
                    }
                }
                if (!ignore && registry.plugins) {
                    for (const pluginRef of new Set(registry.plugins)) {
                        const pluginPath = `${basePath}/${pluginRef.path}`;
                        loadPlugin(repo, pluginRef.id, pluginPath);
                    }
                }
                if (!ignore && registry.repos) {
                    for (const repo of new Set(registry.repos)) {
                        loadRepo(repo);
                    }
                }
            }, console.error);
        }

        if (loaded) {
            for (const repo of new Set(configRepos)) {
                loadRepo(repo);
            }
        }

        return () => {
            ignore = true;
            for (const pluginScriptElement of pluginScriptElements) {
                document.body.removeChild(pluginScriptElement);
            }
        };
    }, [loaded, configRepos, registerModule]);

    if (!loaded) {
        return <Splash />;
    }
    return <Home />;
}

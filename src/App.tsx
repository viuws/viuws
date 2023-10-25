import { useCallback, useEffect } from "react";

import "./App.css";
import Splash from "./components/Splash";
import {
    CONFIG_FILE_PATH,
    MESSAGE_EVENT,
    PING_REQUEST_INTERVAL_MS,
    PLUGIN_EVENT,
    REGISTRY_BASE_PATH,
    REGISTRY_FILE_NAME,
} from "./constants";
import { Message } from "./interfaces/message";
import { Module } from "./interfaces/module";
import { Plugin } from "./interfaces/plugin";
import { Registry } from "./interfaces/registry";
import Home from "./pages/Home";
import useAppStore from "./stores/app";
import useConfigStore, { ConfigState } from "./stores/config";
import { createAsyncScriptElement } from "./utils/dom";
import { fetchYaml, getFetchableUrl } from "./utils/fetch";
import { sendPingRequestMessage } from "./utils/messaging";

export default function App() {
    const loaded = useAppStore((app) => app.loaded);
    const setLoaded = useAppStore((app) => app.setLoaded);
    const setConnected = useAppStore((app) => app.setConnected);
    const setConnectionError = useAppStore((app) => app.setConnectionError);
    const registerModule = useAppStore((app) => app.registerModule);
    const registerPlugin = useAppStore((app) => app.registerPlugin);

    const configRepos = useConfigStore((config) => config.repos);
    const loadConfig = useConfigStore((config) => config.load);

    const handleMessageEvent = useCallback(
        (event: Event) => {
            if (event instanceof CustomEvent) {
                const message = event.detail as Message;
                if (message.header.target === "webpage") {
                    switch (message.payload.type) {
                        case "pingResponse":
                            setConnected(message.payload.ok);
                            setConnectionError(message.payload.error ?? null);
                            break;
                        default:
                            console.error(
                                `Unsupported message type: ${
                                    message.payload.type ?? "undefined"
                                }`,
                            );
                            break;
                    }
                }
            }
        },
        [setConnected, setConnectionError],
    );

    const handlePluginEvent = useCallback(
        (event: Event) => {
            if (event instanceof CustomEvent && document.currentScript) {
                const m = /^plugin:(?<repo>[^#]+)#(?<pluginId>.+)$/.exec(
                    document.currentScript.id,
                );
                if (m) {
                    const { repo, pluginId } = m.groups!;
                    try {
                        const plugin = event.detail as Plugin;
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
        window.addEventListener(PLUGIN_EVENT, handlePluginEvent);
        window.addEventListener(MESSAGE_EVENT, handleMessageEvent);
        return () => {
            window.removeEventListener(PLUGIN_EVENT, handlePluginEvent);
            window.removeEventListener(MESSAGE_EVENT, handleMessageEvent);
        };
    }, [handleMessageEvent, handlePluginEvent]);

    useEffect(() => {
        let ignore = false;
        fetchYaml<ConfigState>(CONFIG_FILE_PATH).then((configState) => {
            if (!ignore) {
                loadConfig(configState);
                setLoaded(true);
            }
        }, console.error);
        return () => {
            ignore = true;
        };
    }, [loadConfig, setLoaded]);

    useEffect(() => {
        let ignore = false;
        let pingRequestInterval: number | undefined;
        const pluginScriptElements: HTMLScriptElement[] = [];

        function loadModule(
            repo: string,
            moduleId: string,
            modulePath: string,
        ) {
            const moduleUrl = getFetchableUrl(
                repo,
                `${REGISTRY_BASE_PATH}/${modulePath}`,
            );
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
            const pluginUrl = getFetchableUrl(
                repo,
                `${REGISTRY_BASE_PATH}/${pluginPath}`,
            );
            const pluginScriptElement = createAsyncScriptElement(pluginUrl);
            pluginScriptElement.id = `plugin:${repo}#${pluginId}`;
            document.body.appendChild(pluginScriptElement);
            pluginScriptElements.push(pluginScriptElement);
        }

        function loadRepo(repo: string) {
            const registryUrl = getFetchableUrl(
                repo,
                `${REGISTRY_BASE_PATH}/${REGISTRY_FILE_NAME}`,
            );
            fetchYaml<Registry>(registryUrl).then((registry) => {
                if (!ignore && registry.modules) {
                    for (const moduleRef of new Set(registry.modules)) {
                        loadModule(repo, moduleRef.id, moduleRef.path);
                    }
                }
                if (!ignore && registry.plugins) {
                    for (const pluginRef of new Set(registry.plugins)) {
                        loadPlugin(repo, pluginRef.id, pluginRef.path);
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
            pingRequestInterval = window.setInterval(() => {
                sendPingRequestMessage();
                // TODO set timeout to connection error
            }, PING_REQUEST_INTERVAL_MS);
        }

        return () => {
            ignore = true;
            for (const pluginScriptElement of pluginScriptElements) {
                document.body.removeChild(pluginScriptElement);
            }
            if (pingRequestInterval) {
                window.clearInterval(pingRequestInterval);
                pingRequestInterval = undefined;
            }
        };
    }, [loaded, configRepos, registerModule]);

    if (!loaded) {
        return <Splash />;
    }
    return <Home />;
}

import { useCallback, useEffect } from "react";

import "./App.css";
import AppSplash from "./components/AppSplash";
import {
    CLIENT_RECONNECT_INTERVAL,
    CLIENT_RECONNECT_TIMEOUT,
    CONFIG_FILE,
    MESSAGE_EVENT,
    PLUGIN_EVENT,
} from "./constants";
import { Message } from "./interfaces/message";
import { Plugin } from "./interfaces/plugin";
import Home from "./pages/Home";
import useAppStore from "./stores/app";
import useConfigStore from "./stores/config";
import { createAsyncScriptElement } from "./utils/dom";

export default function App() {
    const initialized = useAppStore((app) => app.initialized);
    const setInitialized = useAppStore((app) => app.setInitialized);
    const registerPlugin = useAppStore((app) => app.registerPlugin);
    const loadRegistryAsync = useAppStore((app) => app.loadRegistryAsync);
    const connectClient = useAppStore((app) => app.connectClient);
    const handleMessage = useAppStore((app) => app.handleMessage);

    const loadConfig = useConfigStore((config) => config.load);
    const configAsRegistry = useConfigStore((config) => config.asRegistry);

    const loadPlugin = useCallback((pluginKey: string, pluginUrl: string) => {
        const scriptElement = createAsyncScriptElement(pluginUrl);
        scriptElement.addEventListener("error", console.error);
        scriptElement.id = `viuws:plugin:${pluginKey}`;
        document.body.appendChild(scriptElement);
    }, []);

    const onPluginLoaded = useCallback(
        (event: Event) => {
            if (event instanceof CustomEvent && document.currentScript) {
                const pattern = /^viuws:plugin:(?<pluginKey>.+)$/;
                const match = pattern.exec(document.currentScript.id);
                if (match) {
                    const pluginKey = match.groups!.pluginKey;
                    const plugin = event.detail as Plugin;
                    registerPlugin(pluginKey, plugin);
                }
            }
        },
        [registerPlugin],
    );

    const onMessageReceived = useCallback(
        (event: Event) => {
            if (event instanceof CustomEvent) {
                const message = event.detail as Message;
                handleMessage(message);
            }
        },
        [handleMessage],
    );

    useEffect(() => {
        let ignore = false;
        let clientReconnectIntervalId: number;

        async function initialize() {
            await loadConfig(CONFIG_FILE, () => ignore);
            if (!ignore) {
                window.addEventListener(PLUGIN_EVENT, onPluginLoaded);
                window.addEventListener(MESSAGE_EVENT, onMessageReceived);
                connectClient(CLIENT_RECONNECT_TIMEOUT).catch(console.error);
                clientReconnectIntervalId = window.setInterval(() => {
                    connectClient(CLIENT_RECONNECT_TIMEOUT).catch(
                        console.error,
                    );
                }, CLIENT_RECONNECT_INTERVAL);
                setInitialized(true);
            }
        }

        initialize().catch(console.error);

        return () => {
            ignore = true;
            window.removeEventListener(PLUGIN_EVENT, onPluginLoaded);
            window.removeEventListener(MESSAGE_EVENT, onMessageReceived);
            if (clientReconnectIntervalId) {
                window.clearInterval(clientReconnectIntervalId);
            }
        };
    }, [
        loadConfig,
        onPluginLoaded,
        onMessageReceived,
        connectClient,
        setInitialized,
    ]);

    useEffect(() => {
        let ignore = false;

        if (initialized) {
            loadRegistryAsync(
                null,
                configAsRegistry(),
                loadPlugin,
                () => ignore,
                console.error,
            );
        }

        return () => {
            ignore = true;
        };
    }, [initialized, configAsRegistry, loadRegistryAsync, loadPlugin]);

    if (!initialized) {
        return <AppSplash />;
    }
    return <Home />;
}

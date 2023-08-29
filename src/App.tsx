import "./App.css";

import { useEffect } from "react";

import Home from "./pages/Home";

import { Registry } from "./interfaces/registry";
import { Process } from "./interfaces/process";

import useAppStore from "./stores/app";
import useConfigStore, { ConfigState } from "./stores/config";

import { fetchYaml } from "./utils/fetchYaml";

function App() {
  const appLoaded = useAppStore((state) => state.loaded);
  const setAppLoaded = useAppStore((state) => state.setLoaded);
  const registerProcess = useAppStore((state) => state.registerProcess);

  const registries = useConfigStore((state) => state.registries);
  const loadConfig = useConfigStore((state) => state.load);

  useEffect(() => {
    let ignore = false;

    async function loadApp() {
      const configState = await fetchYaml<ConfigState>("config.yaml");
      if (!ignore) {
        loadConfig(configState);
        setAppLoaded(true);
      }
    }

    loadApp().catch(console.error);

    return () => {
      ignore = true;
    };
  }, [loadConfig, setAppLoaded]);

  useEffect(() => {
    let ignore = false;

    function loadRegistries() {
      for (const repositoryUrl of registries) {
        const baseUrl = repositoryUrl + "/.viuws";
        const registryUrl = baseUrl + "/registry.yaml";
        fetchYaml<Registry>(registryUrl).then((registry) => {
          if (registry.processes) {
            for (const processRef of registry.processes) {
              const processUrl = baseUrl + "/" + processRef.path;
              fetchYaml<Process>(processUrl).then((process) => {
                if (!ignore) {
                  registerProcess(process);
                }
              }, console.error);
            }
          }
        }, console.error);
      }
    }

    if (appLoaded) {
      loadRegistries();
    }

    return () => {
      ignore = true;
    };
  }, [appLoaded, registries, registerProcess]);

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

export default App;

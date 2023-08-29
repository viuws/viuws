import "./App.css";

import { useEffect } from "react";

import Home from "./pages/Home";

import { Registry } from "./interfaces/registry";
import { Process } from "./interfaces/process";

import useAppStore from "./stores/appStore";
import useConfigStore, { ConfigState } from "./stores/configStore";

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

    function loadProcesses() {
      for (const baseUrl of registries) {
        fetchYaml<Registry>(baseUrl + "/.viuws-registry.yaml").then(
          (registry) => {
            if (registry.processes) {
              for (const processId in registry.processes) {
                const processPath = registry.processes[processId];
                const processUrl = baseUrl + "/" + processPath;
                fetchYaml<Process>(processUrl).then((process) => {
                  if (!ignore) {
                    registerProcess(process);
                  }
                }, console.error);
              }
            }
          },
          console.error,
        );
      }
    }

    if (appLoaded) {
      loadProcesses();
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

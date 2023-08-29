import "./App.css";

import { useEffect } from "react";

import Home from "./pages/Home";

import { Registry } from "./interfaces/registry";
import { Process } from "./interfaces/process";

import useAppStore from "./stores/appStore";
import useConfigStore, { Config } from "./stores/configStore";

import { fetchYaml } from "./utils/ioUtils";

function App() {
  const loadConfig = useConfigStore((state) => state.load);
  const configLoaded = useConfigStore((state) => state.loaded);
  const configRegistries = useConfigStore((state) => state.registries);

  const registerProcess = useAppStore((state) => state.registerProcess);

  useEffect(() => {
    async function loadConfigOnStartup() {
      const config = await fetchYaml<Config>("config.yaml");
      loadConfig(config);
    }

    async function loadRegistryOnStartup(registryUrl: string) {
      const registry = await fetchYaml<Registry>(registryUrl);
      if (registry.processes) {
        for (const processId in registry.processes) {
          const processPath = registry.processes[processId];
          const processUrl = registryUrl + "/" + processPath;
          fetchYaml<Process>(processUrl).then(registerProcess, console.error);
        }
      }
    }

    if (!configLoaded) {
      loadConfigOnStartup().then(() => {
        for (const registryUrl of configRegistries) {
          loadRegistryOnStartup(registryUrl).catch(console.error);
        }
      }, console.error);
    }
  }, [loadConfig, configLoaded, configRegistries, registerProcess]);

  if (!configLoaded) {
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

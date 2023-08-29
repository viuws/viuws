import "./App.css";

import { useEffect } from "react";

import Home from "./pages/Home";

import useConfigStore, { Config } from "./stores/configStore";

import { fetchYaml } from "./utils/ioUtils";

function App() {
  const loadConfig = useConfigStore((state) => state.load);
  const configLoaded = useConfigStore((state) => state.loaded);

  useEffect(() => {
    async function loadConfigOnStartup() {
      const config = await fetchYaml<Config>("config.yaml");
      loadConfig(config);
    }
    loadConfigOnStartup().catch(console.error);
  }, [loadConfig]);

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

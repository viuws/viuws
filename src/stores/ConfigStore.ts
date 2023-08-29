import { create } from "zustand";

export interface Config {
  registries: string[];
}

interface ConfigStore extends Config {
  load: (config: Config) => void;
}

const useConfigStore = create<ConfigStore>()((set) => ({
  registries: [],
  load: (config: Config) => set(config),
}));

export default useConfigStore;

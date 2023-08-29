import { create } from "zustand";

export interface Config {
  registries: string[];
}

interface ConfigStore extends Config {
  loaded: boolean;
  load: (config: Config) => void;
}

const useConfigStore = create<ConfigStore>()((set) => ({
  registries: [],
  loaded: false,
  load: (config: Config) => set({ ...config, loaded: true }),
}));

export default useConfigStore;

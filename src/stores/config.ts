import { create } from "zustand";

import { Registry } from "../interfaces/registry";
import { fetchYaml } from "../utils/fetch";

type ConfigState = Registry;

type ConfigActions = {
    load: (file: string, checkIgnore: () => boolean) => Promise<void>;
    asRegistry: () => Registry;
};

const defaultConfigState: ConfigState = {
    modules: [],
    plugins: [],
    repos: [],
};

const useConfigStore = create<ConfigState & ConfigActions>()((set, get) => ({
    ...defaultConfigState,
    load: async (file, checkIgnore) => {
        const configState = await fetchYaml<ConfigState>(file);
        if (!checkIgnore()) {
            set({ ...defaultConfigState, ...configState });
        }
    },
    asRegistry: () => {
        const state = get();
        return {
            modules: state.modules,
            plugins: state.plugins,
            repos: state.repos,
        };
    },
}));

export default useConfigStore;

import { create } from "zustand";

export type ConfigState = {
    repos: string[];
};

type ConfigActions = {
    load: (configState: ConfigState) => void;
};

const defaultConfigState: ConfigState = {
    repos: [],
};

const useConfigStore = create<ConfigState & ConfigActions>()((set) => ({
    ...defaultConfigState,
    load: (configState: ConfigState) =>
        set({ ...defaultConfigState, ...configState }),
}));

export default useConfigStore;

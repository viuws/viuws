import { create } from "zustand";

export type ConfigState = {
  registries: string[];
};

type ConfigActions = {
  load: (configState: ConfigState) => void;
};

const defaultConfigState: ConfigState = {
  registries: [],
};

const useConfigStore = create<ConfigState & ConfigActions>()((set) => ({
  ...defaultConfigState,
  load: (configState: ConfigState) =>
    set({ ...defaultConfigState, ...configState }),
}));

export default useConfigStore;

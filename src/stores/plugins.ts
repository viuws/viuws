import { create } from "zustand";

export type PluginsState = {};

type PluginsActions = {
    refresh: () => void;
};

const defaultPluginsState: PluginsState = {};

const usePluginsStore = create<PluginsState & PluginsActions>()(() => ({
    ...defaultPluginsState,
    refresh: () => {},
}));

export default usePluginsStore;

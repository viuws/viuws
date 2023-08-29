import { load as loadYaml } from "js-yaml";

import { Process } from "../interfaces/process";
import { Registry } from "../interfaces/registry";

import useAppStore from "../stores/appStore";

export async function fetchYaml<T>(url: string) {
  const response = await window.fetch(url);
  if (response.ok) {
    const text = await response.text();
    return loadYaml(text) as T;
  } else {
    return Promise.reject(response.statusText);
  }
}

async function loadRegistryProcesses(registryUrl: string, registry: Registry) {
  const registerProcess = useAppStore((state) => state.registerProcess);
  for (const processId in registry.processes) {
    if (registry.processes.hasOwnProperty(processId)) {
      const processPath = registry.processes[processId];
      fetchYaml<Process>(registryUrl + "/" + processPath).then(registerProcess);
    }
  }
}

export async function loadRegistry(
  registryUrl: string,
  registryPath: string = "/.viuws-registry.yaml",
) {
  const registry = await fetchYaml<Registry>(registryUrl + registryPath);
  if (registry.processes) {
    loadRegistryProcesses(registryUrl, registry);
  }
}

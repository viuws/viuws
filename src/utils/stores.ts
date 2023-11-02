export function getRegistryKey(repo: string | null) {
    return repo ?? "";
}

export function parseRegistryKey(registryKey: string) {
    return { repo: registryKey || null };
}

export function getModuleKey(repo: string | null, moduleId: string) {
    return `${repo ?? ""}:${moduleId}`;
}

export function parseModuleKey(moduleKey: string) {
    const pattern = /^(?<repo>.*):(?<moduleId>[^:]+)$/;
    const match = pattern.exec(moduleKey);
    if (!match) {
        throw new Error(`Invalid module key: ${moduleKey}`);
    }
    const repo = match.groups!.repo || null;
    const moduleId = match.groups!.moduleId;
    return { repo, moduleId };
}

export function getPluginKey(repo: string | null, pluginId: string) {
    return `${repo ?? ""}:${pluginId}`;
}

export function parsePluginKey(pluginKey: string) {
    const pattern = /^(?<repo>.*):(?<pluginId>[^:]+)$/;
    const match = pattern.exec(pluginKey);
    if (!match) {
        throw new Error(`Invalid plugin key: ${pluginKey}`);
    }
    const repo = match.groups!.repo || null;
    const pluginId = match.groups!.pluginId;
    return { repo, pluginId };
}

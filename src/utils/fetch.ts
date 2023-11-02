import { load as loadYaml } from "js-yaml";

import { BASE_PATH } from "../constants";
import { Module } from "../interfaces/module";
import { Registry } from "../interfaces/registry";
import { getGithubUrl, parseGithubRepo } from "./github";

export function getFetchableUrl(
    path: string,
    repo?: string | null,
    rev?: string | null,
) {
    if (repo) {
        const github = parseGithubRepo(repo);
        if (github) {
            return getGithubUrl(github, `${BASE_PATH}/${path}`, rev);
        }
        return `${repo}/${BASE_PATH}/${path}`;
    }
    return `./${path}`;
}

export async function fetchYaml<T>(url: string) {
    const response = await window.fetch(url);
    if (response.ok) {
        const text = await response.text();
        return loadYaml(text) as T;
    } else {
        return Promise.reject(response.statusText);
    }
}

export async function fetchRegistry(
    registryPath: string,
    repo?: string | null,
    rev?: string | null,
) {
    const registryUrl = getFetchableUrl(registryPath, repo, rev);
    return await fetchYaml<Registry>(registryUrl);
}

export async function fetchModule(
    modulePath: string,
    repo?: string | null,
    rev?: string | null,
) {
    const moduleUrl = getFetchableUrl(modulePath, repo, rev);
    return await fetchYaml<Module>(moduleUrl);
}

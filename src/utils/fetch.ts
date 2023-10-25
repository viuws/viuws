import { load as loadYaml } from "js-yaml";

import { getContentDeliveryUrl } from "./cdn";
import { parseGitHubUrl } from "./github";

export function getFetchableUrl(repo?: string, path?: string, rev?: string) {
    if (repo) {
        const github = parseGitHubUrl(repo);
        if (github) {
            return getContentDeliveryUrl(github, path, rev);
        }
    }
    let url = "./";
    if (repo) {
        url = repo;
        if (!url.endsWith("/")) {
            url += "/";
        }
    }
    if (path) {
        url += path;
    }
    return url;
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

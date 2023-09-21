import { load as loadYaml } from "js-yaml";

export default async function fetchYaml<T>(url: string) {
    const response = await window.fetch(url);
    if (response.ok) {
        const text = await response.text();
        return loadYaml(text) as T;
    } else {
        return Promise.reject(response.statusText);
    }
}

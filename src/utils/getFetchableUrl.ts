import getJsDelivrUrl from "./getJsDelivrUrl";
import isGitHubUrl from "./isGitHubUrl";

export default function getFetchableUrl(
    repo?: string,
    path?: string,
    rev?: string,
) {
    if (repo !== undefined && isGitHubUrl(repo)) {
        return getJsDelivrUrl(repo, path, rev);
    }
    if (rev !== undefined) {
        console.warn("rev is ignored because repo is not a GitHub URL");
    }
    let url = "./";
    if (repo !== undefined) {
        url = repo;
        if (!url.endsWith("/")) {
            url += "/";
        }
    }
    if (path !== undefined) {
        url += path;
    }
    return url;
}

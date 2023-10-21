import getContentDeliveryUrl from "./getContentDeliveryUrl";
import isGitHubUrl from "./isGitHubUrl";

export default function getFetchableUrl(
    repo?: string,
    path?: string,
    rev?: string,
) {
    if (repo && isGitHubUrl(repo)) {
        return getContentDeliveryUrl(repo, path, rev);
    }
    if (rev) {
        console.warn("rev is ignored because repo is not a GitHub URL");
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

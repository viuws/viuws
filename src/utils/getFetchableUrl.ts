import getContentDeliveryUrl from "./getContentDeliveryUrl";
import parseGitHubUrl from "./parseGitHubUrl";

export default function getFetchableUrl(
    repo?: string,
    path?: string,
    rev?: string,
) {
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

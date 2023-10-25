export function getContentDeliveryUrl(
    github: {
        owner: string;
        repo: string;
    },
    path?: string,
    rev?: string,
) {
    let url: string;
    if (rev) {
        url = `https://cdn.jsdelivr.net/gh/${github.owner}/${github.repo}@${rev}/`;
    } else {
        url = `https://cdn.jsdelivr.net/gh/${github.owner}/${github.repo}/`;
    }
    if (path) {
        url += path;
    }
    return url;
}

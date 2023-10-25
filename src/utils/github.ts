export function parseGitHubUrl(url: string) {
    const pattern = /^https:\/\/github.com\/(?<owner>[^/]+)\/(?<repo>[^/]+)/;
    const match = pattern.exec(url);
    if (match) {
        const owner = match.groups!.owner;
        let repo = match.groups!.repo;
        if (repo.endsWith(".git")) {
            repo = repo.slice(0, -4);
        }
        return { owner, repo };
    }
    return null;
}

export async function fetchLatestGitHubRelease(github: {
    owner: string;
    repo: string;
}) {
    const url = `https://api.github.com/repos/${github.owner}/${github.repo}/releases/latest`;
    const response = await window.fetch(url);
    if (response.ok) {
        const text = await response.text();
        const data = JSON.parse(text) as { [k: string]: unknown };
        return data.tag_name as string;
    } else {
        return Promise.reject(response.statusText);
    }
}

export type Github = {
    owner: string;
    repo: string;
};

export function parseGithubRepo(repo: string) {
    const pattern = /^https:\/\/github.com\/(?<owner>[^/]+)\/(?<repo>[^/]+)/;
    const match = pattern.exec(repo);
    if (match) {
        const github = match.groups as Github;
        if (github.repo.endsWith(".git")) {
            github.repo = github.repo.slice(0, -4);
        }
        return github;
    }
    return null;
}

export function getGithubUrl(
    github: Github,
    path: string,
    rev?: string | null,
) {
    if (rev) {
        return `https://cdn.jsdelivr.net/gh/${github.owner}/${github.repo}@${rev}/${path}`;
    }
    return `https://cdn.jsdelivr.net/gh/${github.owner}/${github.repo}/${path}`;
}

export async function fetchLatestGithubRevision(github: Github) {
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

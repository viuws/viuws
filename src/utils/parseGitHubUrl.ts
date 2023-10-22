export default function parseGitHubUrl(url: string) {
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

export default function isGitHubUrl(url: string) {
    return /^https:\/\/github.com\/[^/]+\/[^/]+/.test(url);
}

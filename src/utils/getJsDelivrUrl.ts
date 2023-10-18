export default function getJsDelivrUrl(
    ghUrl: string,
    path?: string,
    rev?: string,
) {
    const ghUrlComponents = ghUrl.split("/");
    const ghUser = ghUrlComponents[3];
    let ghRepo = ghUrlComponents[4];
    if (ghRepo.endsWith(".git")) {
        ghRepo = ghRepo.slice(0, -4);
    }
    let url: string;
    if (rev !== undefined) {
        url = `https://cdn.jsdelivr.net/gh/${ghUser}/${ghRepo}@${rev}/`;
    } else {
        url = `https://cdn.jsdelivr.net/gh/${ghUser}/${ghRepo}/`;
    }
    if (path !== undefined) {
        url += path;
    }
    return url;
}

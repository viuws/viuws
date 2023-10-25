export function getWorkflowFilename(workflowName: string) {
    return `${workflowName
        .toLowerCase()
        .replace(" ", "_")
        .replace(/[^a-z0-9-_]/g, "")}.yaml`;
}

export function getNextTaskId(currentTaskIds: string[], moduleId: string) {
    let n = 0;
    for (const taskId of currentTaskIds) {
        if (taskId.startsWith(moduleId + "_")) {
            const x = parseInt(taskId.slice(moduleId.length + 1));
            if (!isNaN(x) && x > n) {
                n = x;
            }
        }
    }
    return `${moduleId}_${n + 1}`;
}

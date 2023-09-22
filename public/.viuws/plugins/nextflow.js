function createNextflowUI(workflowData) {}
function exportToNextflow(workflowData) {}

window.dispatchEvent(
    new CustomEvent("viuws:plugin", {
        detail: {
            plugin: {
                name: "nextflow",
                type: "workflowUI",
                uiTitle: "Nextflow",
                uiFunction: createNextflowUI,
            },
        },
    }),
);

window.dispatchEvent(
    new CustomEvent("viuws:plugin", {
        detail: {
            plugin: {
                name: "nextflow",
                type: "workflowExport",
                exportMenuItem: "Nextflow",
                exportFunction: exportToNextflow,
            },
        },
    }),
);

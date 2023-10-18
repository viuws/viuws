function nextflowExport() {}

window.dispatchEvent(
    new CustomEvent("viuws:plugin", {
        detail: {
            plugin: {
                name: "nextflow",
                type: "workflowExport",
                exportMenuItem: "Nextflow",
                exportFunction: nextflowExport,
            },
        },
    }),
);

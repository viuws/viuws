function nextflowExport() {}

window.dispatchEvent(
    new CustomEvent("viuws:plugin", {
        detail: {
            url: ".viuws/plugins/nextflow.js",
            plugin: {
                plugin: {
                    name: "nextflow",
                    type: "workflowExport",
                    exportMenuItem: "Nextflow",
                    exportFunction: nextflowExport,
                },
            },
        },
    }),
);

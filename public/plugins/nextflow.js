function nextflowExport() {}

window.dispatchEvent(
    new CustomEvent("viuws:plugin", {
        detail: {
            plugin: {
                name: "nextflow",
                type: "export",
                exportMenuItem: "Nextflow",
                exportFunction: nextflowExport,
            },
        },
    }),
);

export function createAsyncScriptElement(scriptUrl: string) {
    const scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.src = scriptUrl;
    scriptElement.async = true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    scriptElement.addEventListener("error", (_event) => {
        console.error(`Failed to load plugin: ${scriptUrl}`);
    });
    return scriptElement;
}

export function createHiddenFileInputElement(file: Blob, filename: string) {
    const fileElement = document.createElement("a");
    fileElement.href = URL.createObjectURL(file);
    fileElement.download = filename;
    fileElement.hidden = true;
    return fileElement;
}

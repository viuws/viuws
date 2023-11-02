export function createAsyncScriptElement(scriptUrl: string) {
    const scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.src = scriptUrl;
    scriptElement.async = true;
    return scriptElement;
}

export function createHiddenDownloadElement(file: Blob, filename: string) {
    const downloadElement = document.createElement("a");
    downloadElement.href = URL.createObjectURL(file);
    downloadElement.download = filename;
    downloadElement.hidden = true;
    return downloadElement;
}

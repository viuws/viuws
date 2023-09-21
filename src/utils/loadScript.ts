export default function loadScript(scriptUrl: string, onLoad?: () => void) {
    const scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.src = scriptUrl;
    scriptElement.async = true;
    if (onLoad) {
        scriptElement.addEventListener("load", (_event) => {
            onLoad();
        });
    }
    scriptElement.addEventListener("error", (_event) => {
        console.error(`Failed to load script: ${scriptUrl}`);
    });
    return scriptElement;
}

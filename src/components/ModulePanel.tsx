import useAppStore from "../stores/app";

export default function ModulePanel() {
    const modules = useAppStore((app) => app.modules);

    const onDragStart = (
        event: React.DragEvent<HTMLLIElement>,
        moduleUrl: string,
    ) => {
        event.dataTransfer.setData("viuws/module", moduleUrl);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <ul>
            {[...modules].map(([moduleUrl, module]) => (
                <li
                    key={moduleUrl}
                    onDragStart={(event) => onDragStart(event, moduleUrl)}
                    draggable
                >
                    {module.name}
                </li>
            ))}
        </ul>
    );
}

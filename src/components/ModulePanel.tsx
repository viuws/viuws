import useAppStore from "../stores/app";

export default function ModulePanel() {
    const modules = useAppStore((app) => app.modules);

    const onDragStart = (
        event: React.DragEvent<HTMLLIElement>,
        moduleName: string,
    ) => {
        event.dataTransfer.setData("application/reactflow", moduleName);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <ul>
            {[...modules].map(([moduleUrl, module]) => (
                <li
                    key={moduleUrl}
                    onDragStart={(event) => onDragStart(event, module.name)}
                    draggable
                >
                    {module.name}
                </li>
            ))}
        </ul>
    );
}

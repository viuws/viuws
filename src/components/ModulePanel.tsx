import useAppStore from "../stores/app";

export default function ModulePanel() {
    const modules = useAppStore((app) => app.modules);

    const onDragStart = (
        event: React.DragEvent<HTMLLIElement>,
        moduleKey: string,
    ) => {
        event.dataTransfer.setData("viuws/module", moduleKey);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <ul>
            {[...modules].map(([moduleKey, module]) => (
                <li
                    key={moduleKey}
                    onDragStart={(event) => onDragStart(event, moduleKey)}
                    draggable
                >
                    {module.name}
                </li>
            ))}
        </ul>
    );
}

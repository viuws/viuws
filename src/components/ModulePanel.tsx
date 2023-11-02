import { useCallback } from "react";

import { MODULE_TRANSFER_FORMAT } from "../constants";
import useAppStore from "../stores/app";

export default function ModulePanel() {
    const modules = useAppStore((app) => app.modules);

    const onDragStart = useCallback(
        (event: React.DragEvent<HTMLLIElement>, moduleKey: string) => {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData(MODULE_TRANSFER_FORMAT, moduleKey);
        },
        [],
    );

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

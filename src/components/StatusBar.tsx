import {
    faCheck,
    faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useAppStore from "../stores/app";

export default function StatusBar() {
    const connected = useAppStore((state) => state.connected);
    const connectionError = useAppStore((state) => state.connectionError);

    return (
        <div>
            <FontAwesomeIcon
                icon={connected ? faCheck : faTriangleExclamation}
                className="mr-2"
            />
            {connectionError ?? "Connected"}
        </div>
    );
}

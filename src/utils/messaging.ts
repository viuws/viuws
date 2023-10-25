import { MESSAGE_EVENT } from "../constants";
import { Address, Message } from "../interfaces/message";

export function sendMessage(target: Address, payload: Message["payload"]) {
    const message: Message = {
        header: {
            id: 0, // TODO
            source: "webpage",
            target: target,
        },
        payload: payload,
    };
    window.dispatchEvent(
        new CustomEvent(MESSAGE_EVENT, {
            detail: message,
        }),
    );
    return message.header.id;
}

export function sendPingRequestMessage() {
    return sendMessage("contentScript", { type: "pingRequest" });
}

import { Message, ToasterEventTypes } from "Packages/Common/Domain/Toaster/Types";
import { Event } from "Packages/Common/Domain/Bus/Event";

export function createMessagesWereAddedToToast(
    toastId: string,
    messages: Message[],
): MessagesWereAddedToToast {
    return {
        type: ToasterEventTypes.MESSAGES_WERE_ADDED_TO_TOAST,
        payload: {
            toastId,
            messages,
        },
    };
}

export type MessagesWereAddedToToast = Event<ToasterEventTypes.MESSAGES_WERE_ADDED_TO_TOAST, {
    toastId: string;
    messages: Message[];
}>;

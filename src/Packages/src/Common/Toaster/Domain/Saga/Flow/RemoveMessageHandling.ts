import { delay, put, select } from "redux-saga/effects";
import { ToasterSettings, ToasterState, ToasterStateSelector } from "../../Types";
import { findToastByMessageId } from "../../Query/ToastQuery";
import { getNonRemovingMessagesInToast } from "../../Query/MessageQuery";
import { RemoveMessage } from "../../Command/RemoveMessage";
import { createToastOutroAnimationWasStarted } from "../../Event/ToastOutroAnimationWasStarted";
import { createToastWasRemoved } from "../../Event/ToastWasRemoved";
import { createMessageOutroAnimationWasStarted } from "../../Event/MessageOutroAnimationWasStarted";
import { createMessageWasRemoved } from "../../Event/MessageWasRemoved";

export function* handleRemoveMessage(
    toasterSettings: ToasterSettings,
    toasterStateSelector: ToasterStateSelector,
    command: RemoveMessage,
): Generator {
    // @ts-ignore
    const toasterState: ToasterState = yield select(toasterStateSelector);
    const messageIdToRemove = command.payload.messageId;
    const toast = findToastByMessageId(toasterState, messageIdToRemove);
    if (!toast) {
        return;
    }
    const nonRemovingMessages = getNonRemovingMessagesInToast(
        toasterState,
        toast.id,
    );
    if (nonRemovingMessages.length === 1) {
        if (nonRemovingMessages[0].id !== messageIdToRemove) {
            return;
        }
        yield put(createToastOutroAnimationWasStarted(toast.id));
        yield delay(toasterSettings.toastOutroAnimationTimeInMs);
        yield put(createToastWasRemoved(toast.id));
        return;
    }
    yield put(createMessageOutroAnimationWasStarted(messageIdToRemove));
    yield delay(toasterSettings.toastMessageOutroAnimationTimeInMs);
    yield put(createMessageWasRemoved(messageIdToRemove));
}

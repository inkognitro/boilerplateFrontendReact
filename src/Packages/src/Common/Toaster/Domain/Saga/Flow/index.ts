import { spawn, takeEvery } from "@redux-saga/core/effects";
import { ToasterStateSelector } from "../../Types";
import { handleRemoveMessage } from "./RemoveMessageHandling";
import { handleShowMessage } from "./ShowMessageHandling";
import { ToasterCommandTypes } from "../../Command/Types";

function* watchShowMessageCommands(toasterStateSelector: ToasterStateSelector): Generator {
    yield takeEvery(ToasterCommandTypes.SHOW_MESSAGE, handleShowMessage, toasterStateSelector);
}

function* watchRemoveMessageCommands(toasterStateSelector: ToasterStateSelector): Generator {
    yield takeEvery(ToasterCommandTypes.REMOVE_MESSAGE, handleRemoveMessage, toasterStateSelector);
}

export function createToasterSaga(toasterStateSelector: ToasterStateSelector): () => Generator {
    return function* (): Generator {
        yield spawn(watchRemoveMessageCommands, toasterStateSelector);
        yield spawn(watchShowMessageCommands, toasterStateSelector);
    };
}
